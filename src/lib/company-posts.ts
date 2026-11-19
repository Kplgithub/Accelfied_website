/** A blog post the signed-in company wrote. Mirrors CompanyPostDto in the API. */
export interface CompanyPost {
  id: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  tags: string[];
  status: 'draft' | 'pending' | 'published' | 'rejected';
  paid: boolean;
  paidAt: string | null;
  submittedAt: string | null;
  /** Latest time we promise to have it live: 72 hours after it was sent. */
  liveBy: string | null;
  decidedAt: string | null;
  reviewNote: string;
  blogSlug: string | null;
  words: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyPostFull extends CompanyPost {
  body: string;
  keyId: string | null;
}

export interface CompanyPostOverview {
  enabled: boolean;
  price: { total: number; taxable: number; gst: number; currency: string };
  /** The price in each currency. Missing from APIs older than rupee prices. */
  prices?: Record<'USD' | 'INR', { total: number; taxable: number; gst: number; currency: string }>;
  reviewHours: number;
  company: { name: string; slug: string; status: string } | null;
  posts: CompanyPost[];
}

export const MIN_WORDS = 150;

export const POST_STATUS: Record<CompanyPost['status'], { label: string; className: string }> = {
  draft: { label: 'Draft, not paid', className: 'bg-paper-deep text-ink-soft' },
  pending: { label: 'With our team', className: 'bg-saffron-tint text-saffron-ink' },
  published: { label: 'Live', className: 'bg-accent-tint text-accent' },
  rejected: { label: 'Needs changes', className: 'bg-danger-tint text-danger' },
};

export const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
