'use server';

import { refresh } from 'next/cache';
import { ApiError, apiSend } from '@/lib/api';
import type { FormState } from '@/lib/form-state';
import { getSessionToken } from '@/lib/session';
import { clientIp, submit, text } from '@/lib/submit';

type Result<T> = ({ ok: true } & T) | { ok: false; message: string };

async function send<T>(path: string, body: unknown): Promise<Result<{ data: T }>> {
  const token = await getSessionToken();
  if (!token) return { ok: false, message: 'Your session has ended. Please log in again.' };
  try {
    return { ok: true, data: await apiSend<T>('POST', path, body, { token, clientIp: await clientIp() }) };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 429) return { ok: false, message: 'You have tried a few times already. Please wait a few minutes.' };
      if (error.status >= 500) return { ok: false, message: 'The payment service did not answer. Please try again in a moment.' };
      return { ok: false, message: error.message };
    }
    console.error('Billing request failed', error);
    return { ok: false, message: 'We could not reach our servers. Please try again in a moment.' };
  }
}

/** Creates the Razorpay subscription that Checkout then charges. */
export async function startVerifiedPlan(): Promise<Result<{ subscriptionId: string; keyId: string }>> {
  const result = await send<{ subscriptionId: string; keyId: string }>('/v1/me/billing/subscribe', {});
  return result.ok ? { ok: true, ...result.data } : result;
}

/** Sends what Checkout returned; the API checks the signature before anything changes. */
export async function confirmVerifiedPayment(payment: {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}): Promise<Result<object>> {
  const result = await send<void>('/v1/me/billing/confirm', {
    razorpay_payment_id: String(payment.razorpay_payment_id ?? ''),
    razorpay_subscription_id: String(payment.razorpay_subscription_id ?? ''),
    razorpay_signature: String(payment.razorpay_signature ?? ''),
  });
  if (result.ok) refresh();
  return result.ok ? { ok: true } : result;
}

export async function submitVerificationDetails(_prev: FormState, form: FormData): Promise<FormState> {
  const payload = {
    legalName: text(form, 'legalName'),
    gstin: text(form, 'gstin').toUpperCase() || undefined,
    registrationNumber: text(form, 'registrationNumber'),
    pan: text(form, 'pan').toUpperCase(),
    address: text(form, 'address'),
  };
  const state = await submit('/v1/me/billing/verification', payload, form, 'Details sent. Our team will check them.');
  if (state.status === 'success') refresh();
  return state;
}

export async function cancelVerifiedPlan(): Promise<void> {
  const result = await send<void>('/v1/me/billing/cancel', {});
  if (result.ok) refresh();
}
