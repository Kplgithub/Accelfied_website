import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { ApiError, apiGet } from './api';
import type { CompanyProfile, CompanySummary, CountryFacet, Page, Post, PostCard, PostKind, Review, Service, ServiceGroup, ServicePlace, SiteSettings } from './types';

/**
 * Cached reads from the API. Every function here is safe to call from any
 * server component; results are shared across visitors and refreshed in the
 * background after `revalidate` seconds.
 */

export async function getServiceGroups(): Promise<ServiceGroup[]> {
  'use cache';
  cacheLife({ stale: 300, revalidate: 600, expire: 86_400 });
  cacheTag('services');
  const { groups } = await apiGet<{ groups: ServiceGroup[] }>('/v1/categories');
  return groups;
}

export async function getService(slug: string): Promise<Service | null> {
  const groups = await getServiceGroups();
  for (const group of groups) {
    const match = group.services.find((service) => service.slug === slug);
    if (match) return match;
  }
  return null;
}

export interface DirectoryQuery {
  service?: string;
  country?: string;
  city?: string;
  budget?: string;
  hourlyRate?: string[];
  teamSize?: string[];
  industry?: string;
  minRating?: string;
  verified?: string;
  q?: string;
  sort?: string;
  page?: number;
}

export async function getCompanies(query: DirectoryQuery): Promise<Page<CompanySummary>> {
  'use cache';
  cacheLife({ stale: 30, revalidate: 60, expire: 3_600 });
  cacheTag('companies');
  return apiGet<Page<CompanySummary>>('/v1/companies', { ...query, limit: 12 });
}

/** Up to 50 companies of one place (the API's page limit), for the real-data facts on location pages. */
export async function getPlaceCompanies(query: Pick<DirectoryQuery, 'service' | 'country' | 'city'>): Promise<Page<CompanySummary>> {
  'use cache';
  cacheLife({ stale: 300, revalidate: 600, expire: 86_400 });
  cacheTag('companies');
  return apiGet<Page<CompanySummary>>('/v1/companies', { ...query, sort: 'rating', limit: 50 });
}

/** Companies paying for the top of this directory page. An outage shows the page without them. */
export async function getSponsored(service: string, country?: string, city?: string): Promise<CompanySummary[]> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 300, expire: 3_600 });
  cacheTag('sponsored', 'companies');
  try {
    const { items } = await apiGet<{ items: CompanySummary[] }>('/v1/sponsored', { service, country, city });
    return items;
  } catch (error) {
    console.error('Loading sponsored companies failed', error);
    return [];
  }
}

export async function getCountryFacets(service?: string): Promise<CountryFacet[]> {
  'use cache';
  cacheLife({ stale: 300, revalidate: 600, expire: 86_400 });
  cacheTag('companies');
  const { countries } = await apiGet<{ countries: CountryFacet[] }>('/v1/companies/facets/countries', { service });
  return countries;
}

export async function getCompany(slug: string): Promise<CompanyProfile | null> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 300, expire: 86_400 });
  cacheTag('companies', `company:${slug}`);
  try {
    return await apiGet<CompanyProfile>(`/v1/companies/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getCompanyReviews(
  slug: string,
  query: { page?: number; rating?: string; sort?: string } = {},
): Promise<Page<Review>> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 300, expire: 86_400 });
  cacheTag('reviews', `company:${slug}`);
  return apiGet<Page<Review>>(`/v1/companies/${encodeURIComponent(slug)}/reviews`, { ...query, limit: 10 });
}

export async function getFeaturedCompanies(limit = 6): Promise<CompanySummary[]> {
  'use cache';
  cacheLife({ stale: 300, revalidate: 600, expire: 86_400 });
  cacheTag('companies');
  const page = await apiGet<Page<CompanySummary>>('/v1/companies', { sort: 'recommended', minRating: 4, limit });
  // Only companies with real reviews are featured.
  return page.items.filter((company) => company.rating.count > 0);
}

export async function getStats(): Promise<{ companies: number; reviews: number }> {
  'use cache';
  cacheLife({ stale: 300, revalidate: 600, expire: 86_400 });
  cacheTag('companies');
  return apiGet<{ companies: number; reviews: number }>('/v1/stats');
}

export async function getSitemapCompanies(): Promise<Array<{ slug: string; updatedAt: string }>> {
  'use cache';
  cacheLife('hours');
  cacheTag('companies');
  const { items } = await apiGet<{ items: Array<{ slug: string; updatedAt: string }> }>('/v1/companies/sitemap');
  return items;
}

export type RecentReview = Review & { company: { slug: string; name: string } };

/** Newest published reviews across the directory. */
export async function getRecentReviews(limit = 6): Promise<RecentReview[]> {
  'use cache';
  cacheLife({ stale: 120, revalidate: 300, expire: 86_400 });
  cacheTag('reviews');
  const { items } = await apiGet<{ items: RecentReview[] }>('/v1/reviews/recent', { limit });
  return items;
}

const EMPTY_SEO = { title: '', description: '' };
const DEFAULT_SETTINGS: SiteSettings = {
  announcement: { active: false, text: '', linkLabel: '', href: '' },
  contact: { email: '', phone: '', address: '' },
  legal: { companyName: '', grievanceOfficer: '', grievanceEmail: '', jurisdictionCity: '', updatedOn: '' },
  seo: { home: EMPTY_SEO, services: EMPTY_SEO, agencies: EMPTY_SEO, blog: EMPTY_SEO, getVerified: EMPTY_SEO },
};

/** Announcement bar, contact details and page titles set in the admin panel. */
export async function getSiteSettings(): Promise<SiteSettings> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 300, expire: 86_400 });
  cacheTag('site');
  try {
    const settings = await apiGet<SiteSettings>('/v1/site');
    // An API older than this website may not send every section yet.
    return { ...DEFAULT_SETTINGS, ...settings, legal: { ...DEFAULT_SETTINGS.legal, ...settings.legal } };
  } catch (error) {
    // The site keeps working on defaults if settings cannot be read.
    console.error('Site settings unavailable', error);
    return DEFAULT_SETTINGS;
  }
}

/** Companies our team picked for the home page, in their order. */
export async function getTeamPicks(): Promise<CompanySummary[]> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 300, expire: 86_400 });
  cacheTag('featured', 'companies');
  const { items } = await apiGet<{ items: CompanySummary[] }>('/v1/companies/featured');
  return items;
}

export async function getPosts(query: { kind?: PostKind; company?: string; page?: number; limit?: number } = {}): Promise<Page<PostCard>> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 300, expire: 86_400 });
  cacheTag('blog');
  return apiGet<Page<PostCard>>('/v1/blog', { limit: 12, ...query });
}

export async function getPost(slug: string): Promise<Post | null> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 300, expire: 86_400 });
  cacheTag('blog', `blog:${slug}`);
  try {
    return await apiGet<Post>(`/v1/blog/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getSitemapPosts(): Promise<Array<{ slug: string; updatedAt: string }>> {
  'use cache';
  cacheLife('hours');
  cacheTag('blog');
  const { items } = await apiGet<{ items: Array<{ slug: string; updatedAt: string }> }>('/v1/blog/sitemap');
  return items;
}

/** Every service offered per country and per city, from published listings. Feeds location pages and the sitemap. */
export async function getServicePlaces(): Promise<ServicePlace[]> {
  'use cache';
  cacheLife({ stale: 600, revalidate: 1_800, expire: 86_400 });
  cacheTag('companies');
  const { items } = await apiGet<{ items: ServicePlace[] }>('/v1/seo/places');
  return items;
}

export interface SitemapCompanies {
  items: Array<{ slug: string; updatedAt: string }>;
  total: number;
  pageSize: number;
}

/** One sitemap file of published profiles (page counts from 0). */
export async function getSitemapCompanyPage(page: number): Promise<SitemapCompanies> {
  'use cache';
  cacheLife('hours');
  cacheTag('companies');
  return apiGet<SitemapCompanies>('/v1/seo/sitemap/companies', { page });
}

/** Ids of the profile sitemap files: one per page of published profiles. */
export async function profileSitemapIds(): Promise<Array<{ id: number }>> {
  const { total, pageSize } = await getSitemapCompanyPage(0);
  return Array.from({ length: Math.max(1, Math.ceil(total / pageSize)) }, (_, id) => ({ id }));
}

/**
 * Who a review invite was sent to, to greet them on the review form. Not
 * cached: each token is personal and stops working once the review is in.
 */
export async function getReviewInvite(token: string): Promise<{ companySlug: string; name: string } | null> {
  try {
    return (await apiGet<{ invite: { companySlug: string; name: string } }>(`/v1/review-invites/${encodeURIComponent(token)}`)).invite;
  } catch {
    return null;
  }
}
