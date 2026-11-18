'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { ApiError, apiSend } from '@/lib/api';
import type { FormState } from '@/lib/form-state';
import { getSessionToken } from '@/lib/session';
import { clientIp, echo, friendly, text } from '@/lib/submit';

type Result<T> = ({ ok: true } & T) | { ok: false; message: string };
export type OrderResult = Result<{ orderId: string; keyId: string; amount: number; currency: string }>;

const HOME = '/dashboard/company/blog';
const isId = (id: unknown): id is string => typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);

async function call<T>(method: 'POST' | 'PUT' | 'DELETE', path: string, body?: unknown): Promise<Result<{ data: T }>> {
  const token = await getSessionToken();
  if (!token) return { ok: false, message: 'Your session has ended. Please log in again.' };
  try {
    return { ok: true, data: await apiSend<T>(method, path, body, { token, clientIp: await clientIp() }) };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 429) return { ok: false, message: 'You have tried a few times already. Please wait a few minutes.' };
      if (error.status >= 500) return { ok: false, message: 'Our servers did not answer. Please try again in a moment.' };
      return { ok: false, message: error.message };
    }
    console.error('Company post request failed', error);
    return { ok: false, message: 'We could not reach our servers. Please try again in a moment.' };
  }
}

/** Saves a new draft (then opens it) or changes an existing one. */
export async function saveCompanyPost(id: string | null, _prev: FormState, form: FormData): Promise<FormState> {
  const payload = {
    title: text(form, 'title'),
    excerpt: text(form, 'excerpt'),
    body: String(form.get('body') ?? ''),
    coverUrl: text(form, 'coverUrl'),
    tags: text(form, 'tags')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 5),
  };
  const token = await getSessionToken();
  if (!token) return { status: 'error', message: 'Please log in again; nothing you typed is lost.', values: echo(form), nonce: Date.now() };
  let createdId = '';
  try {
    if (id === null) {
      createdId = (await apiSend<{ id: string }>('POST', '/v1/me/company-posts', payload, { token, clientIp: await clientIp() })).id;
    } else {
      if (!isId(id)) return { status: 'error', message: 'This post was not found.', nonce: Date.now() };
      await apiSend('PUT', `/v1/me/company-posts/${id}`, payload, { token, clientIp: await clientIp() });
    }
  } catch (error) {
    if (error instanceof ApiError) {
      const errors: Record<string, string> = {};
      for (const issue of error.issues) {
        // "tags.2" belongs to the tags field.
        const key = issue.path.split('.')[0] || issue.path;
        errors[key] ??= friendly(issue.message);
      }
      const message = error.status === 400 && error.issues.length ? 'Some fields need a second look.' : error.status === 429 ? 'Please wait a few minutes and try again.' : error.message;
      return { status: 'error', message, errors, values: echo(form), nonce: Date.now() };
    }
    console.error('Saving a company post failed', error);
    return { status: 'error', message: 'We could not save this right now. Please try again in a moment.', values: echo(form), nonce: Date.now() };
  }
  if (createdId) redirect(`${HOME}/${createdId}`);
  refresh();
  return { status: 'success', message: 'Saved.', nonce: Date.now() };
}

/** Makes the Razorpay order that Checkout then charges. */
export async function startPostCheckout(id: string): Promise<OrderResult> {
  if (!isId(id)) return { ok: false, message: 'This post was not found.' };
  const result = await call<{ orderId: string; keyId: string; amount: number; currency: string }>('POST', `/v1/me/company-posts/${id}/checkout`, {});
  return result.ok ? { ok: true, ...result.data } : result;
}

/** Sends what Checkout returned; the API checks the signature before the post goes to our team. */
export async function confirmPostPayment(
  id: string,
  payment: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string },
): Promise<Result<object>> {
  if (!isId(id)) return { ok: false, message: 'This post was not found.' };
  const result = await call('POST', `/v1/me/company-posts/${id}/confirm`, {
    razorpay_order_id: String(payment.razorpay_order_id ?? ''),
    razorpay_payment_id: String(payment.razorpay_payment_id ?? ''),
    razorpay_signature: String(payment.razorpay_signature ?? ''),
  });
  if (result.ok) refresh();
  return result.ok ? { ok: true } : result;
}

export async function resubmitCompanyPost(id: string): Promise<void> {
  if (!isId(id)) return;
  const result = await call('POST', `/v1/me/company-posts/${id}/resubmit`, {});
  if (result.ok) refresh();
}

export async function deleteCompanyPost(id: string): Promise<void> {
  if (!isId(id)) return;
  const result = await call('DELETE', `/v1/me/company-posts/${id}`);
  if (result.ok) redirect(HOME);
}
