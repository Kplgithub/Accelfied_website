import type { MetadataRoute } from 'next';
import { getSitemapCompanyPage, profileSitemapIds } from '@/lib/data';
import { SITE_URL } from '@/lib/site';

/** One file per 40,000 published profiles, so the sitemap keeps working as the directory grows. */
export function generateSitemaps(): Promise<Array<{ id: number }>> {
  return profileSitemapIds();
}

export default async function sitemap({ id }: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const page = Number.parseInt(await id, 10);
  if (!Number.isInteger(page) || page < 0) return [];
  const { items } = await getSitemapCompanyPage(page);
  return items.map((company) => ({
    url: `${SITE_URL}/profile/${company.slug}`,
    lastModified: company.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));
}
