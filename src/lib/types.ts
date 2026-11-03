/** Shapes returned by the Accelfied API (see Accelfied_backend). */

export interface Service {
  slug: string;
  name: string;
  group: string;
  groupSlug: string;
  description: string;
  popular: boolean;
}

export interface ServiceGroup {
  slug: string;
  name: string;
  services: Service[];
}

export interface Place {
  city: string;
  region?: string;
  country: string;
  countryCode: string;
}

export interface ServiceLine {
  slug: string;
  name: string;
  percent: number;
}

export interface CompanySummary {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  logoUrl: string;
  website: string;
  verified: boolean;
  teamSize: string;
  hourlyRate: string;
  minProjectSize: number;
  headquarters: Place;
  locationCount: number;
  services: ServiceLine[];
  rating: { average: number; count: number };
}

export interface CompanyProfile extends Omit<CompanySummary, 'rating'> {
  description: string;
  foundedYear: number | null;
  locations: Place[];
  industries: string[];
  clients: string[];
  portfolio: Array<{ id: string; title: string; description: string; imageUrl: string; url: string; serviceSlug: string }>;
  rating: {
    average: number;
    count: number;
    quality: number;
    schedule: number;
    cost: number;
    willingToRefer: number;
    distribution: Record<'1' | '2' | '3' | '4' | '5', number>;
  };
  publishedAt: string | null;
}

export interface Review {
  id: string;
  verified: boolean;
  reviewer: {
    name: string | null;
    jobTitle: string;
    companyName: string | null;
    industry: string;
    companySize: string;
    location: string;
  };
  project: {
    title: string;
    serviceSlug: string;
    serviceName: string;
    budget: string;
    startedOn: string;
    endedOn: string | null;
    ongoing: boolean;
  };
  ratings: { overall: number; quality: number; schedule: number; cost: number; willingToRefer: number };
  content: { background: string; challenge: string; solution: string; results: string };
  publishedAt: string | null;
}

export interface Page<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CountryFacet {
  countryCode: string;
  country: string;
  count: number;
}

export type AccountType = 'client' | 'provider';

export interface Account {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: AccountType;
  createdAt: string;
}

export type CompanyStatus = 'pending' | 'published' | 'rejected' | 'suspended';

export interface OwnedCompany extends CompanyProfile {
  status: CompanyStatus;
  contact: { email: string; phone: string };
  createdAt: string;
}

export type ReviewStatus = 'pending' | 'published' | 'rejected';

export interface OwnedReview extends Review {
  status: ReviewStatus;
  submittedAt: string;
}

export interface AuthoredReview extends OwnedReview {
  company: { slug: string; name: string; published: boolean } | null;
}

export interface Lead {
  id: string;
  serviceSlug: string;
  serviceName: string;
  budget: string;
  timeline: string;
  description: string;
  preferredLocation: string;
  contact: { name: string; email: string; phone: string; companyName: string };
  status: string;
  createdAt: string;
}

export interface SentLead extends Lead {
  company: { slug: string; name: string } | null;
}

export interface CompanyClaim {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  workEmail: string;
  jobTitle: string;
  reviewNote: string;
  createdAt: string;
  decidedAt: string | null;
  company: { slug: string; name: string } | null;
}

export type SubscriptionStatus = 'created' | 'authenticated' | 'active' | 'pending' | 'halted' | 'cancelled' | 'completed' | 'expired' | 'paused';

export interface VerificationDetails {
  legalName: string;
  gstin?: string;
  registrationNumber: string;
  pan: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNote?: string;
  submittedAt: string;
  decidedAt: string | null;
}

/** Amounts are in paise. */
export interface Billing {
  enabled: boolean;
  keyId: string | null;
  plan: { name: string; taxable: number; gst: number; total: number; currency: 'INR' };
  company: { id: string; name: string; status: CompanyStatus; verified: boolean } | null;
  subscription: { id: string; status: SubscriptionStatus; currentEnd: string | null; cancelAtCycleEnd: boolean } | null;
  verification: VerificationDetails | null;
  invoices: Array<{ id: string; number: string; total: number; paidAt: string; periodStart: string | null; periodEnd: string | null }>;
}

export interface Invoice {
  _id: string;
  number: string;
  description: string;
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  billedTo: { name: string; gstin?: string; address?: string };
  periodStart: string | null;
  periodEnd: string | null;
  paidAt: string;
  razorpayPaymentId: string;
  seller: { legalName: string; gstin: string; address: string };
}

export type PostKind = 'article' | 'company-feature' | 'interview';

export interface PostCard {
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  kind: PostKind;
  company: { slug: string; name: string; logoUrl: string; verified: boolean } | null;
  interviewee: { name: string; role: string };
  tags: string[];
  authorName: string;
  publishedAt: string;
  readMinutes: number;
}

export interface Post extends PostCard {
  body: string;
  seoTitle: string;
  seoDescription: string;
  updatedAt: string;
}

type SeoEntry = { title: string; description: string };

/** Settings our team changes from the admin panel. */
export interface SiteSettings {
  announcement: { active: boolean; text: string; linkLabel: string; href: string };
  contact: { email: string; phone: string; address: string };
  seo: Record<'home' | 'services' | 'agencies' | 'blog' | 'getVerified', SeoEntry>;
}

/** A service offered in a country (city empty) or a city, by published companies. */
export interface ServicePlace {
  service: string;
  serviceName: string;
  countryCode: string;
  country: string;
  city: string;
  citySlug: string;
  companies: number;
  reviews: number;
  /** Review-weighted rating, 0 when there are no reviews. */
  rating: number;
}
