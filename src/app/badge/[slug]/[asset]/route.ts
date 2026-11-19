import { drawBadge, drawFallback, earnedBadges, parseAsset } from '@/lib/badges/catalog';
import { toSvg } from '@/lib/badges/art';
import { svgToPng } from '@/lib/badges/png';
import { soraText } from '@/lib/badges/text';
import { getCompany, getCompanyAwards } from '@/lib/data';

const LIVE_CACHE = 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400';

function notFound(): Response {
  return new Response('Not found', { status: 404, headers: { 'cache-control': 'public, max-age=300' } });
}

/**
 * One badge file of one company, such as /badge/pink-city-web/seal-premier-dark.png?w=1024.
 *
 * Embedded badges check the company's status on every (cached) load: if the company no longer
 * holds the badge, for example after its Verified plan ends, a plain "Listed on Accelfied" tile of
 * the same size is served instead. Downloads (?download=1) of a badge the company does not hold 404.
 */
export async function GET(request: Request, { params }: RouteContext<'/badge/[slug]/[asset]'>) {
  const { slug, asset } = await params;
  const parsed = parseAsset(asset);
  if (!parsed) return notFound();
  const company = await getCompany(slug);
  if (!company) return notFound();
  const awards = company.verified ? await getCompanyAwards(slug) : [];
  const url = new URL(request.url);
  const download = url.searchParams.get('download') === '1';

  const item = earnedBadges(company, awards).find((badge) => badge.id === parsed.id);
  let art = item ? drawBadge(parsed.id, parsed.theme, company, awards, soraText) : null;
  let title = item ? `${company.name}: ${item.title} on Accelfied` : '';
  if (!art) {
    if (download) return notFound();
    art = drawFallback(parsed.id, parsed.theme, company, soraText);
    title = `${company.name} on Accelfied`;
  }
  if (!art) return notFound();

  const svg = toSvg(art, title);
  const headers: Record<string, string> = {
    'cache-control': LIVE_CACHE,
    'x-content-type-options': 'nosniff',
    'access-control-allow-origin': '*',
  };
  if (download) headers['content-disposition'] = `attachment; filename="accelfied-${slug}-${asset}"`;

  if (parsed.format === 'svg') return new Response(svg, { headers: { ...headers, 'content-type': 'image/svg+xml; charset=utf-8' } });

  const allowed = item?.pngWidths ?? [art.width];
  const requested = Number(url.searchParams.get('w') ?? allowed[0]);
  const width = allowed.includes(requested) ? requested : allowed[0];
  return new Response(svgToPng(svg, width) as BodyInit, { headers: { ...headers, 'content-type': 'image/png' } });
}
