import { NextResponse, type NextRequest } from 'next/server';
import { LEGACY_SESSION_COOKIE, SESSION_COOKIE, sessionCookieOptions } from '@/lib/session-cookie';
import { isDashboardPath, SITE_URL, VENDOR_URL } from '@/lib/site';

/**
 * Runs before every page. It does three cheap things:
 *
 * 1. Keeps the account dashboard on the vendor subdomain (NEXT_PUBLIC_VENDOR_URL, e.g.
 *    https://vendor.accelfied.com). /dashboard on www moves there with a permanent redirect, and
 *    public pages asked for on the vendor subdomain move back to www. The vendor subdomain is
 *    never indexed. Without NEXT_PUBLIC_VENDOR_URL the dashboard stays on the main site.
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

const VENDOR_HOST = VENDOR_URL ? new URL(VENDOR_URL).host : '';
const NOINDEX = 'noindex, nofollow';
/** Paths the dashboard needs on its own host: framework files, uploads, the site's own API routes. */
const VENDOR_PASS = /^\/(?:dashboard(?:\/|$)|_next\/|api\/|uploads\/|blog-images\/)/;
/** Files from /public such as the logo and textures; sitemaps and text files belong to www. */
const STATIC_FILE = /\/[^/]+\.(?!xml$|txt$)[a-z0-9]+$/i;

function moveTo(base: string, request: NextRequest, status = 308): NextResponse {
  return NextResponse.redirect(`${base}${request.nextUrl.pathname}${request.nextUrl.search}`, status);
}

function vendorResponse(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  let response: NextResponse;
  if (pathname === '/robots.txt') {
    response = new NextResponse('User-agent: *\nDisallow: /\n', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
  } else if (pathname === '/') {
    response = NextResponse.redirect(new URL('/dashboard', VENDOR_URL), 307);
  } else if (VENDOR_PASS.test(pathname) || STATIC_FILE.test(pathname)) {
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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (VENDOR_HOST) {
    if (request.headers.get('host') === VENDOR_HOST) return vendorResponse(request);
    // Old links, bookmarks and emails to www.accelfied.com/dashboard keep working. Form posts
    // from a page opened before the move still finish here instead of being redirected.
    if (isDashboardPath(pathname) && (request.method === 'GET' || request.method === 'HEAD')) {
      return carrySession(request, moveTo(VENDOR_URL, request));
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
