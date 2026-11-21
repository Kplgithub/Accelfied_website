const API_URL = (process.env.API_URL ?? 'http://localhost:4000').replace(/\/+$/, '');
const BOTS = /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|facebookexternalhit|whatsapp|telegram|embedly|monitor|curl|wget|python|axios|node-fetch/i;
const MAX_BYTES = 512;

/**
 * Someone opened the join page from a personal link (/join?ref=<company>). Passes it to the
 * API so the admin panel can show who opened their link. Always answers 204.
 */
export async function POST(request: Request) {
  const userAgent = request.headers.get('user-agent') ?? '';
  if (!userAgent || BOTS.test(userAgent)) return new Response(null, { status: 204 });

  const text = await request.text().catch(() => '');
  if (!text || text.length > MAX_BYTES) return new Response(null, { status: 204 });

  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  await fetch(`${API_URL}/v1/personal-links/click`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(clientIp ? { 'x-forwarded-for': clientIp } : {}) },
    body: text,
    cache: 'no-store',
    signal: AbortSignal.timeout(3_000),
  }).catch(() => undefined);
  return new Response(null, { status: 204 });
}
