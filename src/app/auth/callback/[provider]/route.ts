import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { ApiError, apiSend } from '@/lib/api';
import { safeNext, SESSION_COOKIE, sessionCookieOptions } from '@/lib/session';
import { dashboardUrl, SITE_URL } from '@/lib/site';
import type { Account } from '@/lib/types';

interface FinishedSignIn {
  token: string;
  expiresAt: string;
  user: Account;
  next: string;
  created: boolean;
}

const PROVIDERS = new Set(['google', 'linkedin']);

/** Google or LinkedIn sends the visitor back here with a one-time code. */
export async function GET(request: NextRequest, ctx: RouteContext<'/auth/callback/[provider]'>) {
  const { provider } = await ctx.params;
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const failed = (reason: string) => Response.redirect(`${SITE_URL}/login?oauth=${reason}&provider=${encodeURIComponent(provider)}`, 303);

  // The visitor pressed "Cancel" on the provider's page, or the link is broken.
  if (!PROVIDERS.has(provider) || !code || !state) return failed(request.nextUrl.searchParams.get('error') ? 'cancelled' : 'failed');

  let session: FinishedSignIn;
  try {
    session = await apiSend<FinishedSignIn>('POST', `/v1/auth/oauth/${provider}/finish`, { code, state }, {
      clientIp: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
    });
  } catch (error) {
    if (!(error instanceof ApiError)) console.error('OAuth finish failed', error);
    const reasons: Record<string, string> = { EMAIL_NOT_VERIFIED: 'unverified', INVALID_STATE: 'expired', PROVIDER_DISABLED: 'unavailable' };
    return failed((error instanceof ApiError && reasons[error.code]) || 'failed');
  }

  (await cookies()).set(SESSION_COOKIE, session.token, sessionCookieOptions(session.expiresAt));
  const fallback = session.user.accountType === 'provider' && session.created ? '/dashboard/company' : '/dashboard';
  const next = safeNext(session.next, fallback);
  const target = dashboardUrl(next);
  return Response.redirect(target === next ? `${SITE_URL}${next}` : target, 303);
}
