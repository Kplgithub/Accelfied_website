import { SITE_URL } from '@/lib/site';

const API_URL = (process.env.API_URL ?? 'http://localhost:4000').replace(/\/+$/, '');
/** Link checkers and previews open links too; they are sent on without being counted. */
const BOTS = /bot|crawl|spider|slurp|preview|scan|safelink|proofpoint|mimecast|barracuda|headless|lighthouse|monitor|curl|wget|python|axios|node-fetch|go-http/i;
const TOKEN = /^[\w-]{10,100}$/;
const FALLBACK = '/join?as=provider';

/**
 * Every link in a company invite email points here
 * (https://www.accelfied.com/api/invite/<token>?l=join&s=1). The API notes the click so the
 * admin panel can show which companies opened their invite, and says where the link goes.
 * The visitor is then redirected there. If anything fails they still land on the join page.
 */
async function open(request: Request, token: string, record: boolean): Promise<Response> {
  const url = new URL(request.url);
  let path = FALLBACK;
  if (TOKEN.test(token)) {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    try {
      const res = await fetch(`${API_URL}/v1/company-invites/click`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(clientIp ? { 'x-forwarded-for': clientIp } : {}) },
        body: JSON.stringify({ token, link: url.searchParams.get('l') ?? 'join', step: url.searchParams.get('s') ?? '1', record }),
        cache: 'no-store',
        signal: AbortSignal.timeout(3_000),
      });
      const body = res.ok ? ((await res.json()) as { path?: unknown }) : null;
      // Only ever a path on this site, never another address.
      if (typeof body?.path === 'string' && body.path.startsWith('/') && !body.path.startsWith('//')) path = body.path;
    } catch {
      // Keep the fallback.
    }
  }
  return new Response(null, {
    status: 302,
    headers: { location: `${SITE_URL}${path}`, 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' },
  });
}

export async function GET(request: Request, { params }: RouteContext<'/api/invite/[token]'>) {
  const { token } = await params;
  const userAgent = request.headers.get('user-agent') ?? '';
  return open(request, token, Boolean(userAgent) && !BOTS.test(userAgent));
}

export async function HEAD(request: Request, { params }: RouteContext<'/api/invite/[token]'>) {
  const { token } = await params;
  return open(request, token, false);
}
