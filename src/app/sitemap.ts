import type { MetadataRoute } from 'next';
import { getSitemapPosts } from '@/lib/data';
import { SITE_URL } from '@/lib/site';

/**
 * Main pages and the blog. Directory pages live in /agencies/sitemap.xml and
 * company profiles in /profile/sitemap/<n>.xml, all listed in robots.txt.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getSitemapPosts();
  return [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/services`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/agencies`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/get-matched`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/get-listed`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/how-reviews-work`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/get-verified`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/about`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${SITE_URL}/refund-policy`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'daily', priority: 0.6 },
    ...posts.map((post) => ({ url: `${SITE_URL}/blog/${post.slug}`, lastModified: post.updatedAt, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ];
}
