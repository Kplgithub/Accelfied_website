import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { profileSitemapIds } from '@/lib/data';

/**
 * Private and per-visitor pages are blocked from crawling. Form pages such as
 * Log in or Write a review stay crawlable but carry `noindex`, so search
 * engines can see that instruction and drop them.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const profileSitemaps = (await profileSitemapIds()).map(({ id }) => `${SITE_URL}/profile/sitemap/${id}.xml`);
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/dashboard', '/api/', '/auth/', '/claim/', '/reset-password'] }],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/agencies/sitemap.xml`, ...profileSitemaps],
  };
}
