const API_URL = (process.env.API_URL ?? 'http://localhost:4000').replace(/\/+$/, '');
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Public address for Brevo inbound parsing: https://www.accelfied.com/api/webhooks/brevo-inbound.
 * Brevo posts companies' replies to invite emails here. The API is not reachable from the
 * internet, so this passes the body and the x-inbound-key header through; the API checks the key.
 */
export async function POST(request: Request) {
  const key = request.headers.get('x-inbound-key');
  if (!key) return Response.json({ error: 'Missing key' }, { status: 401 });

  const body = await request.arrayBuffer().catch(() => null);
  if (!body || body.byteLength === 0 || body.byteLength > MAX_BYTES) {
    return Response.json({ error: 'Invalid body' }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_URL}/v1/webhooks/brevo-inbound`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-inbound-key': key },
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    });
    // Brevo retries anything that is not 2xx, so pass the API's answer back as is.
    return new Response(await res.text(), { status: res.status, headers: { 'content-type': 'application/json' } });
  } catch {
    return Response.json({ error: 'API unavailable' }, { status: 502 });
  }
}
