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
