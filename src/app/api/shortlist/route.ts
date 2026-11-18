import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/session';

const API_URL = (process.env.API_URL ?? 'http://localhost:4000').replace(/\/+$/, '');
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const noStore = { 'cache-control': 'private, no-store' };

async function token() {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

/** The signed-in visitor's saved company slugs. Signed-out visitors get `signedIn: false`. */
export async function GET() {
  const session = await token();
  if (!session) return Response.json({ signedIn: false, slugs: [] }, { headers: noStore });
  const res = await fetch(`${API_URL}/v1/me/shortlist/slugs`, {
    headers: { authorization: `Bearer ${session}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(5_000),
  }).catch(() => null);
  if (res?.status === 401) return Response.json({ signedIn: false, slugs: [] }, { headers: noStore });
  const data = res?.ok ? await res.json() : { slugs: [] };
  return Response.json({ signedIn: true, slugs: data.slugs ?? [] }, { headers: noStore });
}

/** Saves (`saved: true`) or removes a company. */
export async function POST(request: Request) {
  const session = await token();
  if (!session) return Response.json({ message: 'Log in to save companies.' }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { slug?: unknown; saved?: unknown } | null;
  const slug = typeof body?.slug === 'string' ? body.slug : '';
  if (!SLUG.test(slug)) return Response.json({ message: 'Unknown company.' }, { status: 400 });
  const res = await fetch(`${API_URL}/v1/me/shortlist/${slug}`, {
    method: body?.saved ? 'PUT' : 'DELETE',
    headers: { authorization: `Bearer ${session}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(5_000),
  }).catch(() => null);
  if (!res) return Response.json({ message: 'Could not save. Please try again.' }, { status: 502 });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return Response.json({ message: data.message ?? 'Could not save. Please try again.' }, { status: res.status });
  }
  return new Response(null, { status: 204 });
}
