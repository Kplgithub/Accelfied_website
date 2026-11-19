import type { CompanySuggestion } from '@/lib/types';

const API_URL = (process.env.API_URL ?? 'http://localhost:4000').replace(/\/+$/, '');

/**
 * Company name suggestions for the search boxes. The API caches answers in
 * Redis; browsers and any CDN in front may keep each answer for a minute.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const q = (params.get('q') ?? '').replace(/\s+/g, ' ').trim().slice(0, 60);
  const limit = Math.min(10, Math.max(1, Number(params.get('limit')) || 6));
  if (q.length < 2) return Response.json({ items: [] });
  const res = await fetch(`${API_URL}/v1/companies/suggest?${new URLSearchParams({ q, limit: String(limit) })}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(4_000),
  }).catch(() => null);
  if (!res?.ok) return Response.json({ items: [], error: true }, { status: 502, headers: { 'cache-control': 'no-store' } });
  const data = (await res.json()) as { items: CompanySuggestion[] };
  return Response.json({ items: data.items }, { headers: { 'cache-control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=300' } });
}
