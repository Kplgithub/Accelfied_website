/**
 * Content of the standalone SEO landing pages (cost calculators, comparisons, industries).
 * These pages are not linked from the site menus; search engines find them through the sitemap.
 */

export interface Faq {
  q: string;
  a: string;
}

/** A block of text with an optional bullet list, rendered under its own H2. */
export interface TextSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface Table {
  caption: string;
  headers: string[];
  rows: string[][];
  note?: string;
}

/** Shared by every landing page: what the hero, metadata and sitemap need. */
export interface LandingBase {
  slug: string;
  /** H1. */
  title: string;
  /** <title>, at most about 60 characters with the " | Accelfied" suffix. */
  metaTitle: string;
  /** Meta description, at most 155 characters. */
  description: string;
  eyebrow: string;
  intro: string[];
  faqs: Faq[];
  /** Directory services this page links to (service slugs). */
  services: string[];
  /** Last time the prices and facts on the page were checked (ISO date). */
  reviewed: string;
}

export interface RangeOption {
  id: string;
  label: string;
  hint: string;
  /** Rupees. */
  low: number;
  high: number;
}

export interface ProjectType extends RangeOption {
  /** Typical timeline in weeks, for a small studio. */
  weeks?: [number, number];
  /** Scales the add-ons (used where an add-on grows with the size of the business). */
  scale?: number;
}

export interface Modifier {
  id: string;
  label: string;
  options: Array<{ label: string; factor: number }>;
  /** Index of the option selected at first. */
  initial: number;
}

export interface CalculatorPage extends LandingBase {
  /** "project" for one-time builds, "month" for retainers. */
  unit: 'project' | 'month';
  typesLabel: string;
  types: ProjectType[];
  addonsLabel: string;
  addons: RangeOption[];
  modifiers: Modifier[];
  /** Short line under the result, e.g. what the estimate leaves out. */
  resultNote: string;
  tables: Table[];
  sections: TextSection[];
}

export interface ComparisonPage extends LandingBase {
  /** Column names, e.g. ["Agency", "Freelancer"]. */
  sides: [string, string];
  rows: Array<{ factor: string; a: string; b: string }>;
  /** Headings of the two "when to choose" lists, e.g. "Choose an agency when". */
  chooseTitles: [string, string];
  chooseA: string[];
  chooseB: string[];
  sections: TextSection[];
}

export interface IndustryPage extends LandingBase {
  /** Exact industry value companies pick on their profile (see INDUSTRIES). */
  industry: string;
  /** Short name used in sentences, e.g. "healthcare". */
  short: string;
  builds: Array<{ title: string; text: string }>;
  compliance: TextSection;
  costs: Table;
  sections: TextSection[];
  questions: string[];
}
