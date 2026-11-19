const API_URL = (process.env.API_URL ?? 'http://localhost:4000').replace(/\/+$/, '');
const MAX_BYTES = 512 * 1024;

/**
 * Public address for Razorpay webhooks: https://www.accelfied.com/api/webhooks/razorpay.
 * The API is not reachable from the internet, so this passes the exact bytes and the
 * signature header through to it. The API checks the signature; this route trusts nothing.
 */
export async function POST(request: Request) {
  const signature = request.headers.get('x-razorpay-signature');
  if (!signature) return Response.json({ error: 'Missing signature' }, { status: 400 });

  const body = await request.arrayBuffer().catch(() => null);
  if (!body || body.byteLength === 0 || body.byteLength > MAX_BYTES) {
    return Response.json({ error: 'Invalid body' }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_URL}/v1/webhooks/razorpay`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-razorpay-signature': signature },
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });
    // Razorpay retries anything that is not 2xx, so pass the API's answer back as is.
    return new Response(await res.text(), { status: res.status, headers: { 'content-type': 'application/json' } });
  } catch {
    return Response.json({ error: 'API unavailable' }, { status: 502 });
  }
}
