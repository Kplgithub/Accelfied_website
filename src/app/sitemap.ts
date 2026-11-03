import type { MetadataRoute } from 'next';
import { getServiceGroups, getSitemapCompanies, getSitemapPosts } from '@/lib/data';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [groups, companies, posts] = await Promise.all([getServiceGroups(), getSitemapCompanies(), getSitemapPosts()]);
  return [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/services`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/agencies`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/get-listed`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/how-reviews-work`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/get-verified`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'daily', priority: 0.6 },
    ...posts.map((post) => ({ url: `${SITE_URL}/blog/${post.slug}`, lastModified: post.updatedAt, changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...groups.flatMap((group) =>
      group.services.map((service) => ({
        url: `${SITE_URL}/agencies/${service.slug}`,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      })),
    ),
    ...companies.map((company) => ({
      url: `${SITE_URL}/profile/${company.slug}`,
      lastModified: company.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ];
}
