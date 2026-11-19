import type { CompanyDetails, OwnedCompany } from './types';

export type SectionKey =
  | 'company'
  | 'basics'
  | 'services'
  | 'industries'
  | 'clients'
  | 'locations'
  | 'social'
  | 'awards'
  | 'portfolio'
  | 'team';

export interface ProfileSection {
  key: SectionKey;
  title: string;
  /** Shown on the dashboard when the section is not done yet. */
  tip: string;
  done: boolean;
  /** Share of the profile health score this section is worth. */
  weight: number;
  href: string;
}

const edit = (key: SectionKey) => `/dashboard/company?section=${key}`;

/** The Edit Profile sections, in order, with what "done" means for each. */
export function profileSections(company: OwnedCompany, details: CompanyDetails): ProfileSection[] {
  const focus = details.clientFocus.small + details.clientFocus.midmarket + details.clientFocus.enterprise;
  const hasSocial = Object.values(company.socials).some(Boolean);
  return [
    {
      key: 'company',
      title: 'Company information',
      tip: 'Add a logo, a one-line tagline and a full description.',
      done: Boolean(company.logoUrl && company.tagline && company.description.length >= 200),
      weight: 21,
      href: edit('company'),
    },
    {
      key: 'basics',
      title: 'Size and pricing',
      tip: 'Add the year you were founded so clients see your experience.',
      done: Boolean(company.foundedYear),
      weight: 6,
      href: edit('basics'),
    },
    {
      key: 'services',
      title: 'Service lines',
      tip: 'List every service you offer and how much of your work each one is.',
      done: company.services.length > 0,
      weight: 8,
      href: edit('services'),
    },
    {
      key: 'industries',
      title: 'Industries',
      tip: 'Pick the industries you know best, so clients in them find you.',
      done: company.industries.length > 0,
      weight: 6,
      href: edit('industries'),
    },
    {
      key: 'clients',
      title: 'Clients',
      tip: 'Say which client sizes you work with and name a few clients.',
      done: focus === 100 && company.clients.length > 0,
      weight: 8,
      href: edit('clients'),
    },
    {
      key: 'locations',
      title: 'Locations',
      tip: 'Add every office, so you show on more city pages.',
      done: company.locations.length > 0,
      weight: 6,
      href: edit('locations'),
    },
    {
      key: 'social',
      title: 'Social media',
      tip: 'Link your LinkedIn page so clients can check your team.',
      done: hasSocial,
      weight: 5,
      href: edit('social'),
    },
    {
      key: 'awards',
      title: 'Awards and recognition',
      tip: 'Add awards or rankings your company has won.',
      done: details.awards.length > 0,
      weight: 5,
      href: edit('awards'),
    },
    {
      key: 'portfolio',
      title: 'Portfolio',
      tip: 'Add at least three projects with pictures.',
      done: company.portfolio.length >= 3,
      weight: 15,
      href: '/dashboard/company/portfolio',
    },
    {
      key: 'team',
      title: 'Team',
      tip: 'Introduce the people clients will work with.',
      done: company.team.length > 0,
      weight: 5,
      href: '/dashboard/company/team',
    },
  ];
}

export interface ProfileHealth {
  score: number;
  label: 'Needs work' | 'Good' | 'Great';
  sections: ProfileSection[];
  /** Sections still to do, most valuable first. */
  todo: ProfileSection[];
}

/** Reviews are part of health too: up to 15 points, 5 per published review. */
export function profileHealth(company: OwnedCompany, details: CompanyDetails): ProfileHealth {
  const sections = profileSections(company, details);
  const fromSections = sections.reduce((sum, section) => sum + (section.done ? section.weight : 0), 0);
  const fromReviews = Math.min(company.rating.count, 3) * 5;
  const score = Math.min(100, fromSections + fromReviews);
  return {
    score,
    label: score >= 80 ? 'Great' : score >= 50 ? 'Good' : 'Needs work',
    sections,
    todo: sections.filter((section) => !section.done).sort((a, b) => b.weight - a.weight),
  };
}
