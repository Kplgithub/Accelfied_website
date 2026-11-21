/**
 * The sign-in cookie. Kept free of server-only imports so the proxy can use it too.
 *
 * With COOKIE_DOMAIN set (production: accelfied.com) the cookie is shared by www and the
 * vendor subdomain, so one sign-in on www also opens the dashboard on vendor.accelfied.com.
 * The name changed from `af_session` when the cookie became shared: an old host-only cookie
 * with the same name would shadow the new one. The proxy moves old cookies over once.
 */
export const SESSION_COOKIE = 'af_sid';
export const LEGACY_SESSION_COOKIE = 'af_session';

const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN?.trim() || undefined;

function secure(): boolean {
  // COOKIE_SECURE=false lets sign-in work over plain http (e.g. http://IP:port) until a domain with https is set up.
  return process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : process.env.NODE_ENV === 'production';
}

/** Cookie settings for a new session. Without an expiry the cookie ends with the browser session. */
export function sessionCookieOptions(expiresAt?: string) {
  return {
    httpOnly: true,
    secure: secure(),
    sameSite: 'lax' as const,
    path: '/',
    ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
    ...(expiresAt ? { expires: new Date(expiresAt) } : {}),
  };
}

/** Settings that remove the session cookie. The domain must match the one it was set with. */
export function clearedSessionCookie() {
  return { name: SESSION_COOKIE, value: '', ...sessionCookieOptions(), expires: new Date(0), maxAge: 0 };
}

/**
 * Account type of the signed-in person ('provider' or 'client'), so the proxy can send them to
 * their own dashboard subdomain without asking the API. Only a routing hint: pages still check
 * the session itself.
 */
export const ROLE_COOKIE = 'af_role';

export function clearedRoleCookie() {
  return { name: ROLE_COOKIE, value: '', ...sessionCookieOptions(), expires: new Date(0), maxAge: 0 };
}
