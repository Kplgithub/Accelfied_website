'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { ApiError, apiSend } from '@/lib/api';
import type { FormState } from '@/lib/form-state';
import { clientIp, echo, friendly, submit, text } from '@/lib/submit';

const CODE = /^\d{6}$/;
const codeError = (form: FormData, extra: Record<string, string> = {}): FormState => ({
  status: 'error',
  message: 'Some fields need a second look.',
  errors: { code: 'Enter the 6-digit code.', ...extra },
  values: echo(form),
  nonce: Date.now(),
});

/** Forgot password, test mode: the code stands in for the emailed reset link. */
export async function resetPasswordWithCode(_prev: FormState, form: FormData): Promise<FormState> {
  const code = text(form, 'code');
  const password = String(form.get('password') ?? '');
  if (!CODE.test(code)) return codeError(form);
  if (password !== String(form.get('confirmPassword') ?? '')) {
    return { status: 'error', message: 'Some fields need a second look.', errors: { confirmPassword: 'Passwords do not match.' }, values: echo(form), nonce: Date.now() };
  }
  try {
    await apiSend('POST', '/v1/auth/reset-password/code', { email: text(form, 'email'), code, password }, { clientIp: await clientIp() });
  } catch (error) {
    const values = echo(form);
    delete values.password;
    delete values.confirmPassword;
    if (error instanceof ApiError) {
      const errors: Record<string, string> = {};
      for (const issue of error.issues) if (!errors[issue.path]) errors[issue.path] = friendly(issue.message);
      if (error.code === 'INVALID_CODE') errors.code = error.message;
      const message =
        error.status === 400 && error.issues.length ? 'Some fields need a second look.' : error.status === 429 ? 'Too many tries. Please wait a few minutes.' : error.message;
      return { status: 'error', message, errors, values, nonce: Date.now() };
    }
    return { status: 'error', message: 'We could not reset your password right now. Please try again.', values, nonce: Date.now() };
  }
  redirect('/login?reset=1');
}

/** Dashboard banner, test mode: confirms the account email with the code. */
export async function confirmEmailWithCode(_prev: FormState, form: FormData): Promise<FormState> {
  const code = text(form, 'code');
  if (!CODE.test(code)) return codeError(form);
  const state = await submit('/v1/auth/verify-email/code', { code }, form, 'Email confirmed.');
  if (state.status === 'success') refresh();
  return state;
}

/** Dashboard claims, test mode: confirms the work email on a claim with the code. */
export async function confirmClaimWithCode(_prev: FormState, form: FormData): Promise<FormState> {
  const code = text(form, 'code');
  const id = text(form, 'claimId');
  if (!CODE.test(code)) return codeError(form);
  if (!/^[a-f\d]{24}$/i.test(id)) return { status: 'error', message: 'This claim could not be found.', nonce: Date.now() };
  const state = await submit(`/v1/claims/${id}/confirm/code`, { code }, form, 'Work email confirmed. Our team checks the claim next.');
  if (state.status === 'success') refresh();
  return state;
}
