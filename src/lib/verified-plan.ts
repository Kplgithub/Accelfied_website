/** Accelfied Verified: the paid plan for companies. Prices in rupees. */
export const VERIFIED_PLAN = {
  name: 'Accelfied Verified',
  monthly: 599,
  gstRate: 0.18,
} as const;

export const verifiedMonthlyWithGst = Math.round(VERIFIED_PLAN.monthly * (1 + VERIFIED_PLAN.gstRate) * 100) / 100;

export const formatRupees = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: Number.isInteger(value) ? 0 : 2 }).format(value);

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
      { label: 'A blog post about your company, by name', free: false, verified: true },
      { label: 'Your personal interview, published on Accelfied', free: false, verified: true },
    ],
  },
];
