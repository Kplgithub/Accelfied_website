import type { Metadata } from 'next';
import { MAX_TITLE, OG_DEFAULTS } from '@/lib/seo-text';
import type { LandingBase } from './types';

/** Indexable, self-canonical metadata for a landing page; a missing page is kept out of search results. */
export function landingMetadata(page: LandingBase | undefined, path: string): Metadata {
  if (!page) return { title: 'Page not found', robots: { index: false } };
  // Long titles skip the " | Accelfied" suffix so search results show the keyword part, not a cut-off brand.
  const fits = page.metaTitle.length + ' | Accelfied'.length <= MAX_TITLE;
  const images = ['/opengraph-image'];
  return {
    title: fits ? page.metaTitle : { absolute: page.metaTitle },
    description: page.description,
    alternates: { canonical: path },
    openGraph: { ...OG_DEFAULTS, type: 'article', url: path, title: page.metaTitle, description: page.description, modifiedTime: page.reviewed, images },
    twitter: { card: 'summary_large_image', images },
  };
}
