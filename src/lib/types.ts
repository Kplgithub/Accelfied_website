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
