import { NextResponse, type NextRequest } from 'next/server';
import { LEGACY_SESSION_COOKIE, ROLE_COOKIE, SESSION_COOKIE, sessionCookieOptions } from '@/lib/session-cookie';
import { CLIENT_URL, dashboardBase, type DashboardRole, isDashboardPath, SITE_URL, VENDOR_URL } from '@/lib/site';

/**
 * Runs before every page. It does three cheap things:
 *
 * 1. Keeps the account dashboard on its subdomain: companies on NEXT_PUBLIC_VENDOR_URL, clients
 *    on NEXT_PUBLIC_CLIENT_URL. /dashboard on www moves to the visitor's own subdomain, a
 *    dashboard opened on the other one moves too, and public pages asked for on a dashboard
 *    subdomain move back to www. Dashboard subdomains are never indexed. With neither set the
 *    dashboard stays on the main site.
 * 2. Moves an old host-only sign-in cookie to the shared one, so nobody is logged out by the move.
 * 3. Answers unknown company profiles with a real 404.
 *
 * For 3: profile pages stream (Cache Components), so a `notFound()` inside the page
 * arrives after the 200 status is sent. Search engines then see a soft 404.
 * This check runs before rendering and is cheap: the API serves it from Redis,
 * and known slugs are remembered here for a minute.
 */
const API_URL = (process.env.API_URL ?? 'http://localhost:4000').replace(/\/+$/, '');
const KNOWN_TTL_MS = 60_000;
const MISSING_TTL_MS = 30_000;
const MAX_REMEMBERED = 5_000;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const remembered = new Map<string, { exists: boolean; until: number }>();

async function profileExists(slug: string): Promise<boolean> {
  const hit = remembered.get(slug);
  if (hit && hit.until > Date.now()) return hit.exists;
  let exists = true;
  try {
    const res = await fetch(`${API_URL}/v1/companies/${slug}`, {
      method: 'GET',
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(3_000),
    });
    // Only a clear "not found" hides the page. Any API trouble lets the page render as usual.
    exists = res.status !== 404;
    await res.body?.cancel();
  } catch {
    return true;
  }
  if (remembered.size >= MAX_REMEMBERED) remembered.delete(remembered.keys().next().value as string);
  remembered.set(slug, { exists, until: Date.now() + (exists ? KNOWN_TTL_MS : MISSING_TTL_MS) });
  return exists;
}

const hostOf = (url: string) => (url ? new URL(url).host : '');
const DASHBOARD_HOSTS = new Set([hostOf(VENDOR_URL), hostOf(CLIENT_URL)].filter(Boolean));
const NOINDEX = 'noindex, nofollow';
/** Paths the dashboard needs on its own host: framework files, uploads, the site's own API routes. */
const DASHBOARD_PASS = /^\/(?:dashboard(?:\/|$)|_next\/|api\/|uploads\/|blog-images\/)/;
/** Files from /public such as the logo and textures; sitemaps and text files belong to www. */
const STATIC_FILE = /\/[^/]+\.(?!xml$|txt$)[a-z0-9]+$/i;

function moveTo(base: string, request: NextRequest, status = 308): NextResponse {
  return NextResponse.redirect(`${base}${request.nextUrl.pathname}${request.nextUrl.search}`, status);
}

const isRole = (value: unknown): value is DashboardRole => value === 'provider' || value === 'client';

/**
 * The signed-in visitor's account type. Read from the routing cookie set at sign-in; for older
 * sign-ins without it, asked from the API once and then remembered in the cookie.
 */
async function visitorRole(request: NextRequest): Promise<{ role: DashboardRole | null; remember: boolean }> {
  const saved = request.cookies.get(ROLE_COOKIE)?.value;
  if (isRole(saved)) return { role: saved, remember: false };
  const token = request.cookies.get(SESSION_COOKIE)?.value || request.cookies.get(LEGACY_SESSION_COOKIE)?.value;
  if (!token) return { role: null, remember: false };
  try {
    const res = await fetch(`${API_URL}/v1/auth/me`, {
      headers: { accept: 'application/json', authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(3_000),
    });
    if (!res.ok) {
      await res.body?.cancel();
      return { role: null, remember: false };
    }
    const body = (await res.json()) as { user?: { accountType?: unknown } };
    const role = body.user?.accountType;
    return isRole(role) ? { role, remember: true } : { role: null, remember: false };
  } catch {
    return { role: null, remember: false };
  }
}

function rememberRole(response: NextResponse, role: DashboardRole | null, remember: boolean): NextResponse {
  if (remember && role) response.cookies.set(ROLE_COOKIE, role, sessionCookieOptions());
  return response;
}

async function dashboardHostResponse(request: NextRequest, host: string): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  let response: NextResponse;
  if (pathname === '/robots.txt') {
    response = new NextResponse('User-agent: *\nDisallow: /\n', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
  } else if (pathname === '/') {
    response = NextResponse.redirect(new URL('/dashboard', request.nextUrl.origin), 307);
  } else if (isDashboardPath(pathname) && (request.method === 'GET' || request.method === 'HEAD')) {
    // A company on the clients' subdomain (or the other way round) moves to its own one.
    const { role, remember } = await visitorRole(request);
    const own = role ? dashboardBase(role) : '';
    response = rememberRole(own && hostOf(own) !== host ? moveTo(own, request, 307) : carrySession(request), role, remember);
  } else if (DASHBOARD_PASS.test(pathname) || STATIC_FILE.test(pathname)) {
    response = carrySession(request);
  } else {
    // Log in, Join, profiles, blogs and every other public page live on www.
    response = moveTo(SITE_URL, request);
  }
  response.headers.set('X-Robots-Tag', NOINDEX);
  return response;
}

/**
 * Sign-ins made before the cookie was shared sit in a host-only `af_session` cookie on www.
 * Copy it to the shared cookie once (this request sees it too) and remove the old one.
 */
function carrySession(request: NextRequest, response?: NextResponse): NextResponse {
  const legacy = request.cookies.get(LEGACY_SESSION_COOKIE)?.value;
  if (!legacy) return response ?? NextResponse.next();
  const current = request.cookies.get(SESSION_COOKIE)?.value;
  let out = response;
  if (!out) {
    if (!current) request.cookies.set(SESSION_COOKIE, legacy);
    out = NextResponse.next({ request: { headers: request.headers } });
  }
  // A browser-session cookie: the API still decides how long the sign-in itself lasts.
  if (!current) out.cookies.set(SESSION_COOKIE, legacy, sessionCookieOptions());
  out.cookies.delete(LEGACY_SESSION_COOKIE);
  return out;
}

/**
 * When the cookie became shared (COOKIE_DOMAIN), browsers that signed in before kept a host-only
 * `af_sid` on www next to the shared one. Two cookies with one name confuse sign-in and keep www
 * signed in after logging out, so the host-only copy is removed (a delete without a domain only
 * touches that one).
 */
function dropHostOnlyCopy(request: NextRequest, response: NextResponse): NextResponse {
  if (!process.env.COOKIE_DOMAIN?.trim()) return response;
  const raw = request.headers.get('cookie') ?? '';
  const copies = raw.split(';').filter((part) => part.trim().startsWith(`${SESSION_COOKIE}=`)).length;
  if (copies > 1 && !response.cookies.get(SESSION_COOKIE)) {
    response.headers.append('set-cookie', `${SESSION_COOKIE}=; Path=/; Max-Age=0`);
  }
  return response;
}

export async function proxy(request: NextRequest) {
  return dropHostOnlyCopy(request, await route(request));
}

async function route(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (DASHBOARD_HOSTS.size) {
    const host = request.headers.get('host') ?? '';
    if (DASHBOARD_HOSTS.has(host)) return dashboardHostResponse(request, host);
    // Old links, bookmarks and emails to www.accelfied.com/dashboard keep working and land on the
    // visitor's own subdomain. Form posts from a page opened before the move still finish here.
    if (isDashboardPath(pathname) && (request.method === 'GET' || request.method === 'HEAD')) {
      const { role, remember } = await visitorRole(request);
      // 307: where /dashboard goes depends on who asks, so browsers must not remember it.
      return rememberRole(carrySession(request, moveTo(dashboardBase(role), request, 307)), role, remember);
    }
  }
  if (!pathname.startsWith('/profile/') || pathname.split('/').length !== 3) return carrySession(request);

  const slug = pathname.split('/')[2] ?? '';
  if (slug === 'sitemap') return carrySession(request);
  if (!SLUG.test(slug) || !(await profileExists(slug))) {
    // Any path with no matching route renders the site's not-found page with a 404 status.
    return NextResponse.rewrite(new URL('/__missing__/profile', request.url), { status: 404 });
  }
  return carrySession(request);
}

export const config = {
  // Everything except build files and icons, which never depend on the host or the visitor.
  matcher: '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png).*)',
};
