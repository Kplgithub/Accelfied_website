/** Human labels for the value lists the API accepts. Keep in sync with the backend constants. */

export const TEAM_SIZES = [
  { value: '1-9', label: '1–9 people' },
  { value: '10-49', label: '10–49 people' },
  { value: '50-249', label: '50–249 people' },
  { value: '250-999', label: '250–999 people' },
  { value: '1000-9999', label: '1,000–9,999 people' },
  { value: '10000+', label: '10,000+ people' },
] as const;

export const HOURLY_RATES = [
  { value: '<25', label: 'Under $25/hr' },
  { value: '25-49', label: '$25–$49/hr' },
  { value: '50-99', label: '$50–$99/hr' },
  { value: '100-149', label: '$100–$149/hr' },
  { value: '150-199', label: '$150–$199/hr' },
  { value: '200-300', label: '$200–$300/hr' },
  { value: '300+', label: '$300+/hr' },
] as const;

export const MIN_PROJECT_SIZES = [
  { value: 0, label: 'No minimum' },
  { value: 1000, label: '$1,000+' },
  { value: 5000, label: '$5,000+' },
  { value: 10000, label: '$10,000+' },
  { value: 25000, label: '$25,000+' },
  { value: 50000, label: '$50,000+' },
  { value: 75000, label: '$75,000+' },
  { value: 100000, label: '$100,000+' },
  { value: 250000, label: '$250,000+' },
] as const;

export const BUDGETS = [
  { value: '<10000', label: 'Under $10,000' },
  { value: '10000-49999', label: '$10,000 – $49,999' },
  { value: '50000-199999', label: '$50,000 – $199,999' },
  { value: '200000-999999', label: '$200,000 – $999,999' },
  { value: '1000000+', label: '$1,000,000+' },
] as const;

export const TIMELINES = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-3-months', label: 'Within 1–3 months' },
  { value: '3-6-months', label: 'Within 3–6 months' },
  { value: '6-months-plus', label: 'In 6 months or more' },
  { value: 'flexible', label: 'I’m flexible' },
] as const;

export const INDUSTRIES = [
  'Advertising & marketing',
  'Arts, entertainment & music',
  'Automotive',
  'Business services',
  'Consumer products',
  'Education',
  'Energy & natural resources',
  'Financial services',
  'Gaming',
  'Government',
  'Healthcare & medical',
  'Hospitality & leisure',
  'Information technology',
  'Legal',
  'Manufacturing',
  'Media',
  'Non-profit',
  'Real estate',
  'Retail',
  'Supply chain, logistics & transport',
  'Telecommunications',
  'Other',
] as const;

export const SORTS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'reviews', label: 'Most reviews' },
  { value: 'newest', label: 'Newest' },
] as const;

const lookup = <T extends { value: string | number; label: string }>(list: readonly T[]) => {
  const map = new Map<string | number, string>(list.map((item) => [item.value, item.label]));
  return (value: string | number) => map.get(value) ?? String(value);
};

export const teamSizeLabel = lookup(TEAM_SIZES);
export const hourlyRateLabel = lookup(HOURLY_RATES);
export const minProjectLabel = lookup(MIN_PROJECT_SIZES);
export const budgetLabel = lookup(BUDGETS);
export const timelineLabel = lookup(TIMELINES);
