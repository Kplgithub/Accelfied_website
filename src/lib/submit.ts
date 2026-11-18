import 'server-only';
import { headers } from 'next/headers';
import { ApiError, apiSend } from './api';
import type { FormState } from './form-state';
import { getSessionToken } from './session';

export const text = (form: FormData, key: string) => String(form.get(key) ?? '').trim();
export const optional = (form: FormData, key: string) => text(form, key) || undefined;

export function echo(form: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === 'string' && !key.startsWith('$')) values[key] = values[key] ? `${values[key]},${value}` : value;
  }
  return values;
}

export async function clientIp(): Promise<string | undefined> {
  const list = (await headers()).get('x-forwarded-for');
  return list?.split(',')[0]?.trim() || undefined;
}

export async function submit(
  path: string,
  payload: unknown,
  form: FormData,
  /** The confirmation shown, or a function that words it from the API's answer. */
  success: string | ((data: unknown) => string),
  method: 'POST' | 'PATCH' | 'PUT' = 'POST',
): Promise<FormState> {
  const token = await getSessionToken();
  if (!token) return { status: 'error', message: 'Please log in again to continue.', values: echo(form), nonce: Date.now() };
  try {
    const data = await apiSend<unknown>(method, path, payload, { token, clientIp: await clientIp() });
    return { status: 'success', message: typeof success === 'function' ? success(data) : success, nonce: Date.now() };
  } catch (error) {
    if (error instanceof ApiError) {
      const errors: Record<string, string> = {};
      for (const issue of error.issues) if (!errors[issue.path]) errors[issue.path] = friendly(issue.message);
      const message =
        error.status === 400 && error.issues.length
          ? 'Some fields need a second look.'
          : error.status === 429
            ? 'You have sent a few of these already. Please try again a little later.'
            : error.status === 401
              ? 'Your session has ended. Please log in again; nothing you typed is lost.'
              : error.message;
      return { status: 'error', message, errors, values: echo(form), nonce: Date.now() };
    }
    console.error('Form submission failed', error);
    return {
      status: 'error',
      message: 'We could not send this right now. Please try again in a moment.',
      values: echo(form),
      nonce: Date.now(),
    };
  }
}

/** Turns validator wording into something a visitor can act on. */
export function friendly(message: string): string {
  if (/too small.*>=?(\d+) characters/i.test(message)) {
    const min = message.match(/(\d+)/)?.[1];
    return `Please write at least ${min} characters.`;
  }
  if (/invalid email/i.test(message)) return 'Enter a valid email address.';
  if (/invalid url/i.test(message)) return 'Enter a full web address, starting with https://';
  if (/expected.*received undefined|required/i.test(message)) return 'This field is required.';
  if (/invalid option/i.test(message)) return 'Please choose an option.';
  return message;
}
