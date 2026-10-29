'use server';

import { refresh } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ApiError, apiGet, apiSend } from '@/lib/api';
import type { FormState } from '@/lib/form-state';
import { safeNext, SESSION_COOKIE, sessionCookieOptions } from '@/lib/session';
import { SITE_URL } from '@/lib/site';
import { clientIp, echo, friendly, text } from '@/lib/submit';
import type { Account } from '@/lib/types';

interface IssuedSession {
  token: string;
  expiresAt: string;
  user: Account;
}

async function startSession(session: IssuedSession, remember: boolean) {
  // Without "stay logged in" the cookie ends with the browser session.
  (await cookies()).set(SESSION_COOKIE, session.token, sessionCookieOptions(remember ? session.expiresAt : undefined));
}

function failure(error: unknown, form: FormData, fallback: string, omit: string[] = []): FormState {
  const values = echo(form);
  for (const key of omit) delete values[key];
  if (error instanceof ApiError) {
    const errors: Record<string, string> = {};
    for (const issue of error.issues) if (!errors[issue.path]) errors[issue.path] = friendly(issue.message);
    const message =
      error.status === 400 && error.issues.length
        ? 'Some fields need a second look.'
        : error.status === 429 && error.code !== 'TOO_MANY_REQUESTS'
          ? 'Too many attempts. Please wait a few minutes and try again.'
          : error.message;
    return { status: 'error', message, errors, values, nonce: Date.now() };
  }
  console.error(fallback, error);
  return { status: 'error', message: 'We could not reach our servers. Please try again in a moment.', values, nonce: Date.now() };
}

export async function register(_prev: FormState, form: FormData): Promise<FormState> {
  const password = String(form.get('password') ?? '');
  const errors: Record<string, string> = {};
  if (password !== String(form.get('confirmPassword') ?? '')) errors.confirmPassword = 'Passwords do not match.';
  if (form.get('terms') !== 'on') errors.terms = 'Please accept the terms to continue.';
  const secrets = ['password', 'confirmPassword'];
  if (Object.keys(errors).length) {
    const values = echo(form);
    for (const key of secrets) delete values[key];
    return { status: 'error', message: 'Some fields need a second look.', errors, values, nonce: Date.now() };
  }

  const accountType = text(form, 'accountType') === 'provider' ? 'provider' : 'client';
  let session: IssuedSession;
  try {
    session = await apiSend<IssuedSession>(
      'POST',
      '/v1/auth/register',
      {
        firstName: text(form, 'firstName'),
        lastName: text(form, 'lastName'),
        email: text(form, 'email'),
        password,
        accountType,
        companyFax: text(form, 'companyFax'),
      },
      { clientIp: await clientIp() },
    );
  } catch (error) {
    return failure(error, form, 'Registration failed', secrets);
  }
  await startSession(session, true);
  // Companies go straight into creating their listing; clients to where they were headed.
  redirect(safeNext(text(form, 'next'), accountType === 'provider' ? '/dashboard/company' : '/dashboard'));
}

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  const remember = form.get('remember') === 'on';
  let session: IssuedSession;
  try {
    session = await apiSend<IssuedSession>(
      'POST',
      '/v1/auth/login',
      { email: text(form, 'email'), password: String(form.get('password') ?? ''), remember },
      { clientIp: await clientIp() },
    );
  } catch (error) {
    return failure(error, form, 'Login failed', ['password']);
  }
  await startSession(session, remember);
  redirect(safeNext(text(form, 'next')));
}

export async function logout(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await apiSend('POST', '/v1/auth/logout', undefined, { token }).catch(() => undefined);
  store.delete(SESSION_COOKIE);
  redirect('/');
}

export async function forgotPassword(_prev: FormState, form: FormData): Promise<FormState> {
  try {
    await apiSend('POST', '/v1/auth/forgot-password', { email: text(form, 'email') }, { clientIp: await clientIp() });
  } catch (error) {
    return failure(error, form, 'Password reset request failed');
  }
  return {
    status: 'success',
    message: `If an account exists for ${text(form, 'email')}, a reset link is on its way. It works for one hour.`,
    nonce: Date.now(),
  };
}

export async function resetPassword(_prev: FormState, form: FormData): Promise<FormState> {
  const password = String(form.get('password') ?? '');
  if (password !== String(form.get('confirmPassword') ?? '')) {
    return { status: 'error', message: 'Some fields need a second look.', errors: { confirmPassword: 'Passwords do not match.' }, nonce: Date.now() };
  }
  try {
    await apiSend('POST', '/v1/auth/reset-password', { token: text(form, 'token'), password }, { clientIp: await clientIp() });
  } catch (error) {
    return failure(error, form, 'Password reset failed', ['password', 'confirmPassword']);
  }
  redirect('/login?reset=1');
}

export async function updateProfile(_prev: FormState, form: FormData): Promise<FormState> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  try {
    await apiSend('PATCH', '/v1/auth/me', { firstName: text(form, 'firstName'), lastName: text(form, 'lastName') }, { token });
  } catch (error) {
    return failure(error, form, 'Profile update failed');
  }
  refresh();
  return { status: 'success', message: 'Your name is updated.', values: echo(form), nonce: Date.now() };
}

export async function changePassword(_prev: FormState, form: FormData): Promise<FormState> {
  const password = String(form.get('password') ?? '');
  if (password !== String(form.get('confirmPassword') ?? '')) {
    return { status: 'error', message: 'Some fields need a second look.', errors: { confirmPassword: 'Passwords do not match.' }, nonce: Date.now() };
  }
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  try {
    await apiSend(
      'POST',
      '/v1/auth/change-password',
      { currentPassword: String(form.get('currentPassword') ?? ''), password },
      { token, clientIp: await clientIp() },
    );
  } catch (error) {
    return failure(error, form, 'Password change failed', ['currentPassword', 'password', 'confirmPassword']);
  }
  return { status: 'success', message: 'Password changed. Other devices have been logged out.', nonce: Date.now() };
}

const OAUTH_PROVIDERS = ['google', 'linkedin'] as const;

/** Sends the visitor to Google or LinkedIn. The provider returns them to /auth/callback/<provider>. */
export async function startOAuth(form: FormData): Promise<void> {
  const provider = OAUTH_PROVIDERS.find((item) => item === text(form, 'provider'));
  const next = safeNext(text(form, 'next'), '');
  const back = text(form, 'from') === 'join' ? '/join' : '/login';
  if (!provider) redirect(back);

  let url: string;
  try {
    ({ url } = await apiGet<{ url: string }>(`/v1/auth/oauth/${provider}/start`, {
      redirectUri: `${SITE_URL}/auth/callback/${provider}`,
      accountType: text(form, 'accountType') === 'provider' ? 'provider' : 'client',
      next,
    }));
  } catch (error) {
    const reason = error instanceof ApiError && error.code === 'PROVIDER_DISABLED' ? 'unavailable' : 'failed';
    if (reason === 'failed') console.error('OAuth start failed', error);
    const params = new URLSearchParams({ oauth: reason, provider });
    if (next) params.set('next', next);
    if (back === '/join' && text(form, 'accountType')) params.set('as', text(form, 'accountType'));
    redirect(`${back}?${params.toString()}`);
  }
  redirect(url);
}
