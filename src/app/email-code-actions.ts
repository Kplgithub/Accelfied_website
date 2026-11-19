'use server';

import { redirect } from 'next/navigation';
import { ApiError, apiSend } from '@/lib/api';
import type { FormState } from '@/lib/form-state';
import { getSessionToken, loginHref, safeNext } from '@/lib/session';
import { clientIp, text } from '@/lib/submit';

const CODE = /^\d{6}$/;

/** Checks the 6-digit code from the signup email, then carries on to where the person was going. */
export async function verifyEmailCode(_prev: FormState, form: FormData): Promise<FormState> {
  const code = text(form, 'code').replace(/\s/g, '');
  const next = safeNext(text(form, 'next'));
  if (!CODE.test(code)) return { status: 'error', errors: { code: 'Enter the 6-digit code from the email.' }, nonce: Date.now() };
  const token = await getSessionToken();
  if (!token) redirect(loginHref(`/verify-email?next=${encodeURIComponent(next)}`));
  try {
    await apiSend('POST', '/v1/auth/email-code/verify', { code }, { token, clientIp: await clientIp() });
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) redirect(loginHref(`/verify-email?next=${encodeURIComponent(next)}`));
      if (error.code === 'INVALID_CODE' || error.code === 'CODE_EXPIRED') return { status: 'error', errors: { code: error.message }, nonce: Date.now() };
      if (error.status === 429) return { status: 'error', message: 'Too many tries. Please wait a few minutes and try again.', nonce: Date.now() };
      return { status: 'error', message: error.message, nonce: Date.now() };
    }
    console.error('Email code check failed', error);
    return { status: 'error', message: 'We could not reach our servers. Please try again in a moment.', nonce: Date.now() };
  }
  redirect(next);
}

/** Emails a fresh code. */
export async function sendEmailCode(): Promise<FormState> {
  const token = await getSessionToken();
  if (!token) return { status: 'error', message: 'Please log in again to continue.', nonce: Date.now() };
  try {
    const sent = await apiSend<{ sent: boolean; email?: string }>('POST', '/v1/auth/email-code', undefined, { token, clientIp: await clientIp() });
    return sent.sent
      ? { status: 'success', message: `We sent a new code to ${sent.email}.`, nonce: Date.now() }
      : { status: 'success', message: 'Your email is already confirmed.', nonce: Date.now() };
  } catch (error) {
    if (error instanceof ApiError && error.status === 429) return { status: 'error', message: error.code === 'TOO_MANY_REQUESTS' ? error.message : 'Please wait a minute before asking for a new code.', nonce: Date.now() };
    return { status: 'error', message: 'We could not send a code right now. Please try again in a moment.', nonce: Date.now() };
  }
}
