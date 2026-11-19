import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { ApiError, apiGet, apiPrivateGet } from './api';
import { requireUser } from './session';
import type { Review, ReviewStatus } from './types';

export interface Workspace {
  skippedTasks: string[];
  featuredReviewId: string | null;
  story: string;
}

export interface Certification {
  slug: string;
  name: string;
  share: number;
  qualifyingReviews: number;
  reviewsNeeded: number;
  shareMet: boolean;
  reviewsMet: boolean;
  earned: boolean;
}

export interface CertificationRules {
  reviews: number;
  minRating: number;
  months: number;
  minShare: number;
}

export interface ProjectCard {
  id: string;
  status: ReviewStatus;
  verified: boolean;
  featured: boolean;
  reviewer: { name: string; jobTitle: string; companyName: string; anonymous: boolean };
  project: { title: string; serviceSlug: string; serviceName: string };
  rating: number;
  createdAt: string;
  publishedAt: string | null;
  portfolioItemId: string | null;
}

export interface ProjectList {
  counts: { published: number; pending: number; rejected: number; portfolio: number };
  services: Array<{ slug: string; name: string; count: number }>;
  items: ProjectCard[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProjectDetail extends ProjectCard {
  review: Review;
  moderationNote: string;
  portfolioItem: { id: string; title: string; description: string; imageUrl: string; url: string; serviceSlug: string } | null;
}

export interface Performance {
  days: number;
  from: string;
  to: string;
  page: string;
  totals: { impressions: number; views: number; websiteClicks: number | null; leads: number | null };
  previous: { impressions: number; views: number; websiteClicks: number | null; leads: number | null };
  series: Array<{ day: string; impressions: number; views: number; websiteClicks: number }>;
  pages: Array<{ page: string; impressions: number; avgPosition: number; views: number }>;
  pageOptions: string[];
}

export interface PersonProfile {
  avatarUrl: string;
  jobTitle: string;
  companyName: string;
  contactEmail: string;
  phone: string;
  linkedinUrl: string;
  xUrl: string;
  location: string;
  industry: string;
  headline: string;
  bio: string;
}

export interface CompanyExtras {
  story: string;
  featuredReview: Review | null;
  certifications: Array<{ slug: string; name: string }>;
}

export const PERFORMANCE_DAYS = [7, 30, 90, 180, 365] as const;

export async function getMyWorkspace(returnTo: string): Promise<Workspace> {
  const { token } = await requireUser(returnTo);
  return apiPrivateGet<Workspace>('/v1/me/company/workspace', token);
}

export async function getMyCertifications(returnTo: string): Promise<{ rules: CertificationRules; items: Certification[] }> {
  const { token } = await requireUser(returnTo);
  return apiPrivateGet('/v1/me/company/certifications', token);
}

export async function getMyProjects(
  returnTo: string,
  query: { q?: string; service?: string; status?: string; sort?: string; page?: number },
): Promise<ProjectList> {
  const { token } = await requireUser(returnTo);
  return apiPrivateGet<ProjectList>('/v1/me/company/projects', token, { ...query, limit: 12 });
}

/** Null when the project is not this company's. */
export async function getMyProject(returnTo: string, id: string): Promise<ProjectDetail | null> {
  const { token } = await requireUser(returnTo);
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  try {
    return await apiPrivateGet<ProjectDetail>(`/v1/me/company/projects/${id}`, token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getMyPerformance(returnTo: string, days: number, page = ''): Promise<Performance> {
  const { token } = await requireUser(returnTo);
  return apiPrivateGet<Performance>('/v1/me/company/performance', token, { days, ...(page ? { page } : {}) });
}

export async function getMyProfile(returnTo: string): Promise<PersonProfile> {
  const { token } = await requireUser(returnTo);
  return (await apiPrivateGet<{ profile: PersonProfile }>('/v1/me/profile', token)).profile;
}

/** For the header: the picture only, and never an error (the menu falls back to initials). */
export async function getAvatarUrl(token: string): Promise<string> {
  try {
    return (await apiPrivateGet<{ profile: PersonProfile }>('/v1/me/profile', token)).profile.avatarUrl;
  } catch {
    return '';
  }
}

const NO_EXTRAS: CompanyExtras = { story: '', featuredReview: null, certifications: [] };

/** Team story, pinned review and earned certifications for a public profile. */
export async function getCompanyExtras(slug: string): Promise<CompanyExtras> {
  'use cache';
  cacheTag(`company:${slug}`, 'reviews');
  cacheLife('minutes');
  try {
    return await apiGet<CompanyExtras>(`/v1/companies/${encodeURIComponent(slug)}/extras`);
  } catch {
    return NO_EXTRAS;
  }
}
