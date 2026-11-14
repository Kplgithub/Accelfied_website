const API_URL = (process.env.API_URL ?? 'http://localhost:4000').replace(/\/+$/, '');
const BOTS = /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|facebookexternalhit|embedly|monitor|curl|wget|python|axios|node-fetch/i;
const MAX_BYTES = 2_048;

/**
 * Receives a reader's report from the blog post page and passes it to the API.
 * Always answers 204: the browser never waits on it or learns anything from it.
 */
export async function POST(request: Request) {
  const userAgent = request.headers.get('user-agent') ?? '';
  if (!userAgent || BOTS.test(userAgent)) return new Response(null, { status: 204 });

  const text = await request.text().catch(() => '');
  if (!text || text.length > MAX_BYTES) return new Response(null, { status: 204 });

  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  await fetch(`${API_URL}/v1/blog/reads`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(clientIp ? { 'x-forwarded-for': clientIp } : {}) },
    body: text,
    cache: 'no-store',
    signal: AbortSignal.timeout(3_000),
  }).catch(() => undefined);
  return new Response(null, { status: 204 });
}
