import { getCompany } from '@/lib/data';
import { badgeSvg } from '@/lib/badge';

/**
 * Embeddable "Verified on Accelfied" badge. Companies place it on their own
 * site, linking back to their profile. It always reflects live data.
 */
export async function GET(_request: Request, { params }: RouteContext<'/badge/[slug]'>) {
  const company = await getCompany((await params).slug);
  if (!company) return new Response('Not found', { status: 404, headers: { 'cache-control': 'public, max-age=300' } });
  return new Response(badgeSvg(company), {
    headers: {
      'content-type': 'image/svg+xml; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      'x-content-type-options': 'nosniff',
      'access-control-allow-origin': '*',
    },
  });
}
