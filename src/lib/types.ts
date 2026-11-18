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
  /** Verified with 10+ published reviews averaging 4.5 or more. */
  premier: boolean;
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
  team: TeamMember[];
  socials: Socials;
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

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  linkedinUrl: string;
}

export interface Socials {
  linkedin: string;
  facebook: string;
  instagram: string;
  x: string;
  youtube: string;
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
  emailVerified: boolean;
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
  conversationId: string | null;
  createdAt: string;
}

export interface SentLead extends Lead {
  company: { slug: string; name: string } | null;
}

export interface CompanyClaim {
  id: string;
  status: 'unconfirmed' | 'pending' | 'approved' | 'rejected';
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

/** Amounts are in the currency's smallest unit (cents). */
export type BillingInterval = 'monthly' | 'yearly';

/** Prices are in cents, GST included. */
export interface PlanPrice {
  name: string;
  taxable: number;
  gst: number;
  total: number;
  gstRate: number;
  currency: string;
  interval: BillingInterval;
}

export interface SponsorOption {
  pageKey: string;
  label: string;
  service: { slug: string; name: string };
  countryCode: string | null;
  country: string | null;
  city: string | null;
  taken: number;
  mine: { status: SubscriptionStatus; currentEnd: string | null; cancelAtCycleEnd: boolean } | null;
}

export interface Sponsorships {
  enabled: boolean;
  keyId: string | null;
  plan: PlanPrice;
  maxPerPage: number;
  company: { name: string; status: CompanyStatus } | null;
  options: SponsorOption[];
}

export interface Billing {
  enabled: boolean;
  keyId: string | null;
  /** The monthly plan; `plans` has both billing periods. */
  plan: PlanPrice;
  plans: Record<BillingInterval, PlanPrice>;
  company: { id: string; name: string; status: CompanyStatus; verified: boolean } | null;
  subscription: { id: string; status: SubscriptionStatus; interval: BillingInterval; currentEnd: string | null; cancelAtCycleEnd: boolean } | null;
  verification: VerificationDetails | null;
  invoices: Array<{ id: string; number: string; description: string; total: number; currency: string; paidAt: string; periodStart: string | null; periodEnd: string | null }>;
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
  currency: string;
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
  legal: { companyName: string; grievanceOfficer: string; grievanceEmail: string; jurisdictionCity: string; updatedOn: string };
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
  /**
   * Website only: 'state' when this entry is an Indian state page built from /v1/seo/states.
   * `city` then holds the state's name and `citySlug` its slug, so state pages share the city URL level.
   */
  kind?: 'state';
}

/** One service in one Indian state, from /v1/seo/states. */
export interface StatePlace {
  service: string;
  serviceName: string;
  state: string;
  stateSlug: string;
  companies: number;
  reviews: number;
  rating: number;
}

export interface IndianStateInfo {
  slug: string;
  name: string;
  cities: string[];
}

export type SenderRole = 'client' | 'company';

export interface Conversation {
  id: string;
  role: SenderRole;
  company: { slug: string; name: string; logoUrl: string };
  client: { name: string };
  subject: string;
  lastMessageAt: string;
  lastPreview: string;
  lastSenderRole: SenderRole;
  unread: number;
  fromBrief: boolean;
}

export interface ChatMessage {
  id: string;
  senderRole: SenderRole;
  mine: boolean;
  body: string;
  createdAt: string;
}

export interface Thread {
  conversation: Conversation;
  messages: ChatMessage[];
  olderCursor: string | null;
}

export interface SavedCompany {
  savedAt: string;
  company: CompanySummary;
}

export interface CompanyAnalytics {
  days: number;
  from: string;
  to: string;
  totals: { impressions: number; views: number; websiteClicks: number; leads: number; shortlists: number };
  series: Array<{ day: string; impressions: number; views: number; websiteClicks: number; leads: number }>;
  pages: Array<{ page: string; impressions: number; avgPosition: number; views: number }>;
}

export interface ReviewInvite {
  id: string;
  name: string;
  email: string;
  status: 'sent' | 'reviewed';
  sentAt: string;
  sendCount: number;
  canResendAt: string | null;
}

export interface ClientFocus {
  small: number;
  midmarket: number;
  enterprise: number;
}

export interface CompanyAward {
  id: string;
  title: string;
  url: string;
  year: number | null;
}

export interface CompanyPackage {
  id: string;
  title: string;
  serviceSlug: string;
  serviceName: string;
  description: string;
  tiers: Array<{ name: 'Starter' | 'Growth' | 'Scale'; price: number; duration: string; summary: string }>;
  features: Array<{ label: string; values: string[] }>;
  status: 'published' | 'hidden';
}

export interface CompanyDetails {
  clientFocus: ClientFocus;
  awards: CompanyAward[];
  packages: CompanyPackage[];
}

export interface PublicCompanyDetails extends CompanyDetails {
  pricing: { reviewBudgets: Array<{ budget: string; count: number }>; mostCommonBudget: string | null };
}

export type LocationPreference = 'any' | 'near' | 'countries';

export interface ProjectBrief {
  id: string;
  serviceSlug: string;
  serviceName: string;
  goal: string;
  locationPreference: LocationPreference;
  countries: string[];
  nearCity: string;
  website: string;
  companyName: string;
  about: string;
  employees: string;
  budget: string;
  timeline: string;
  introduction: string;
  objectives: string[];
  deliverables: string[];
  questions: string[];
  additionalRequirements: string;
  status: 'draft' | 'sent';
  sentCount: number;
  sentAt: string | null;
  createdAt: string;
}

export interface BriefProvider {
  company: CompanySummary;
  budgetFit: 'fits' | 'above';
  estimate: { from: number; to: number } | null;
  reviewSnippet: { text: string; rating: number; projectTitle: string } | null;
  serviceReviewCount: number;
  conversationId: string | null;
}

export interface ReviewDraft {
  companySlug: string;
  step: number;
  answers: Record<string, string | number | boolean>;
  updatedAt: string;
}
