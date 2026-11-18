import { NextResponse, type NextRequest } from 'next/server';

/**
 * Answers unknown company profiles with a real 404.
 *
 * Profile pages stream (Cache Components), so a `notFound()` inside the page
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

export async function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split('/')[2] ?? '';
  if (slug === 'sitemap') return NextResponse.next();
  if (!SLUG.test(slug) || !(await profileExists(slug))) {
    // Any path with no matching route renders the site's not-found page with a 404 status.
    return NextResponse.rewrite(new URL('/__missing__/profile', request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/profile/:slug',
};
