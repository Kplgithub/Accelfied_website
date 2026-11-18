const API_URL = (process.env.API_URL ?? 'http://localhost:4000').replace(/\/+$/, '');
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*\.(png|jpg|webp)$/;

/**
 * Serves blog images (covers and in-body pictures) from the API on the site's own address,
 * so posts can use https://<site>/blog-images/<name>. A name never changes its bytes,
 * so the response is cached for a year by browsers and any CDN in front of the site.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!NAME.test(name)) return new Response('Not found', { status: 404 });

  const res = await fetch(`${API_URL}/v1/blog-images/${name}`, { cache: 'no-store', signal: AbortSignal.timeout(10_000) }).catch(() => null);
  if (!res?.ok || !res.body) return new Response('Not found', { status: res?.status === 404 || !res ? 404 : 502 });

  return new Response(res.body, {
    headers: {
      'content-type': res.headers.get('content-type') ?? 'application/octet-stream',
      'cache-control': 'public, max-age=31536000, immutable',
      'x-content-type-options': 'nosniff',
    },
  });
}
