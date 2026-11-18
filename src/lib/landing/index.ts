import { CALCULATORS } from './calculators';
import { COMPARISONS } from './comparisons';
import { INDUSTRY_PAGES } from './industries';
import type { LandingBase } from './types';

/**
 * Standalone SEO landing pages. They are deliberately left out of the header, footer and other menus
 * (kapil, 2026-11-18); search engines reach them through /sitemap.xml, and they link to each other and
 * into the directory.
 */
export type LandingKind = 'tools' | 'compare' | 'industries';

const PAGES: Record<LandingKind, LandingBase[]> = {
  tools: CALCULATORS,
  compare: COMPARISONS,
  industries: INDUSTRY_PAGES,
};

export interface LandingLink {
  kind: LandingKind;
  slug: string;
  title: string;
  path: string;
  reviewed: string;
}

export function landingLinks(kind?: LandingKind): LandingLink[] {
  const kinds = kind ? [kind] : (Object.keys(PAGES) as LandingKind[]);
  return kinds.flatMap((k) => PAGES[k].map((page) => ({ kind: k, slug: page.slug, title: page.title, path: `/${k}/${page.slug}`, reviewed: page.reviewed })));
}
