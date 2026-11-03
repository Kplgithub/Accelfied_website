import 'server-only';
import type { Metadata } from 'next';
import { getSiteSettings } from './data';
import type { SiteSettings } from './types';

/** Page metadata with the title and description our team set in the admin panel, when they set one. */
export async function withSeo(page: keyof SiteSettings['seo'], fallback: Metadata): Promise<Metadata> {
  const { seo } = await getSiteSettings();
  const entry = seo[page];
  return {
    ...fallback,
    ...(entry.title ? { title: { absolute: entry.title } } : {}),
    ...(entry.description ? { description: entry.description } : {}),
  };
}
