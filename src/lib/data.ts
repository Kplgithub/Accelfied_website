import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { ApiError, apiGet } from './api';
import type { CompanyProfile, CompanySummary, CountryFacet, Page, Review, Service, ServiceGroup } from './types';

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

export async function getFeaturedCompanies(): Promise<CompanySummary[]> {
  'use cache';
  cacheLife({ stale: 300, revalidate: 600, expire: 86_400 });
  cacheTag('companies');
  const page = await apiGet<Page<CompanySummary>>('/v1/companies', { sort: 'recommended', minRating: 4, limit: 6 });
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
