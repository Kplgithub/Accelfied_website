/** The Verified plan: the paid plan for companies. $6 a month or $59 a year, GST included, paid by autopay. */
export const VERIFIED_PLAN = {
  name: 'Verified plan',
  monthly: 6,
  yearly: 59,
  currency: 'USD',
} as const;

/** Every price on the site is shown and charged in US dollars. */
export type Currency = 'USD';

/** What paying yearly saves against twelve monthly payments. */
export const YEARLY_SAVING = VERIFIED_PLAN.monthly * 12 - VERIFIED_PLAN.yearly;

/** A paid place at the top of one directory page, GST included. */
export const SPONSORED_PLACE = { monthly: 29, perPage: 3 } as const;

/** A whole price for marketing copy, such as "$6" or "$59". */
export const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: VERIFIED_PLAN.currency, maximumFractionDigits: Number.isInteger(value) ? 0 : 2 }).format(value);

/** A price from the API without trailing zeros, such as "$6". */
export const formatWhole = (minor: number, currency = 'USD') => formatMoney(minor, currency).replace(/\.00$/, '');

/** Amounts from the API come in the currency's smallest unit (cents). An invoice keeps the currency it was paid in. */
export const formatMoney = (minor: number, currency = 'USD') =>
  new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(minor / 100);

/** true = included, false = not included, string = what you get. */
type Cell = boolean | string;

export const PLAN_COMPARISON: Array<{ title: string; rows: Array<{ label: string; free: Cell; verified: Cell }> }> = [
  {
    title: 'Core features',
    rows: [
      { label: 'Company profile with services, rates and locations', free: true, verified: true },
      { label: 'Client reviews', free: true, verified: true },
      { label: 'Portfolio of past work', free: true, verified: true },
      { label: 'Project requests from clients', free: true, verified: true },
      { label: 'Basic profile analytics', free: true, verified: true },
    ],
  },
  {
    title: 'Verified add-ons',
    rows: [
      { label: 'Company verification by our team', free: false, verified: true },
      { label: 'Verified badge on your profile and in listings', free: false, verified: true },
      { label: 'Listed above companies that are not verified', free: false, verified: true },
      { label: 'Premier Verified badge once you have 10+ reviews averaging 4.5', free: false, verified: true },
      { label: 'Link to your website from directory pages', free: false, verified: true },
      { label: 'Featured client review', free: false, verified: 'Your choice' },
      { label: 'Number of reviews shown', free: 'Up to 5', verified: 'Unlimited' },
      { label: 'Custom profile address', free: false, verified: true },
      { label: 'Advanced analytics', free: false, verified: true },
      { label: 'Social media links on your profile', free: false, verified: true },
    ],
  },
  {
    title: 'Growth support from our team',
    rows: [
      { label: 'We promote your company across Accelfied', free: false, verified: true },
      { label: 'A blog post about your company, written by our team', free: false, verified: true },
      { label: 'That post shared on our LinkedIn, once you approve it', free: false, verified: true },
      { label: 'Your personal interview, published on Accelfied', free: false, verified: true },
    ],
  },
];

/** Subscription states in which the company has paid for the current month. */
export const PAYING_STATUSES = ['authenticated', 'active', 'pending'] as const;
