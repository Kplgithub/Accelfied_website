import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { ApiError, apiPrivateGet } from './api';
import type { Account } from './types';

export const SESSION_COOKIE = 'af_session';

export async function getSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value || undefined;
}

/** The signed-in account, or null. Looked up once per request. */
export const getCurrentUser = cache(async (): Promise<Account | null> => {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    const { user } = await apiPrivateGet<{ user: Account }>('/v1/auth/me', token);
    return user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
});

/** For pages that only make sense signed in: sends visitors to log in and back. */
export async function requireUser(returnTo: string): Promise<{ user: Account; token: string }> {
  const [user, token] = await Promise.all([getCurrentUser(), getSessionToken()]);
  if (!user || !token) redirect(loginHref(returnTo));
  return { user, token };
}

export function loginHref(returnTo: string): string {
  return `/login?next=${encodeURIComponent(returnTo)}`;
}

/** Only same-site paths are allowed as a post-login destination. */
export function safeNext(value: unknown, fallback = '/dashboard'): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback;
  return value.slice(0, 500);
}
