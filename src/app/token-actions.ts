'use server';

import { refresh } from 'next/cache';
import { ApiError, apiSend } from '@/lib/api';
import type { FormState } from '@/lib/form-state';
import { clientIp, text } from '@/lib/submit';

/** Posts a token from an email link. Works signed in or out. */
async function confirm(path: string, form: FormData, success: string): Promise<FormState> {
  const token = text(form, 'token');
  try {
    await apiSend('POST', path, { token }, { clientIp: await clientIp() });
    refresh();
    return { status: 'success', message: success, nonce: Date.now() };
  } catch (error) {
    if (error instanceof ApiError && error.status !== 500) {
      return { status: 'error', message: error.status === 429 ? 'Too many tries. Please wait a few minutes.' : error.message, nonce: Date.now() };
    }
    console.error('Confirming a link failed', error);
    return { status: 'error', message: 'We could not confirm this right now. Please try again in a moment.', nonce: Date.now() };
  }
}

export async function confirmEmail(_prev: FormState, form: FormData): Promise<FormState> {
  return confirm('/v1/auth/verify-email', form, 'Your email is confirmed. Thank you.');
}

export async function confirmClaim(_prev: FormState, form: FormData): Promise<FormState> {
  return confirm('/v1/claims/confirm', form, 'Thank you. Your claim is confirmed, and our team will now check it. We email you with the result, usually within two working days.');
}

export async function unsubscribeInvite(_prev: FormState, form: FormData): Promise<FormState> {
  return confirm('/v1/company-invites/unsubscribe', form, 'Done. We will not send you any more invitation emails.');
}
