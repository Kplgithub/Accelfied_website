import 'server-only';
import type { Metadata } from 'next';
import { placeHeading, placeSummary, resolvePlace, type PlaceParams } from '@/components/directory/location-landing';
import { getServicePlaces } from './data';
import { MAX_DESCRIPTION } from './seo-text';
import { countrySlug, isIndexable, placePath } from './places';

/** Placeholder so the routes validate at build time before any company is published. */
export const SHELL = '__shell__';

/** Busiest location pages are rendered ahead of time; the rest render on first visit and are cached. */
const PRERENDER_LIMIT = 500;

export async function placeStaticParams(level: 'country' | 'city'): Promise<PlaceParams[]> {
  const places = (await getServicePlaces()).filter((p) => (level === 'city' ? p.city : !p.city) && isIndexable(p)).slice(0, PRERENDER_LIMIT);
  if (!places.length) return [level === 'city' ? { service: SHELL, country: SHELL, city: SHELL } : { service: SHELL, country: SHELL }];
  return places.map((p) => ({ service: p.service, country: countrySlug(p.countryCode), ...(level === 'city' ? { city: p.citySlug } : {}) }));
}

export async function placeMetadata(params: PlaceParams): Promise<Metadata> {
  const resolved = await resolvePlace(params);
  if (!resolved) return { title: 'Page not found', robots: { index: false } };
  const { service, place } = resolved;
  const title = placeHeading(service, place);
  const summary = placeSummary(service, place);
  // Search results cut descriptions at about 155 characters, so the longest call to action that fits is used.
  const cta = [' Compare client reviews, hourly rates and project sizes, then request quotes.', ' Compare reviews and rates.', ''].find(
    (text) => summary.length + text.length <= MAX_DESCRIPTION,
  );
  const description = summary + (cta ?? '');
  return {
    title,
    description,
    alternates: { canonical: placePath(place) },
    // Pages with only a few listings stay out of search results until more companies join.
    robots: isIndexable(place) ? undefined : { index: false, follow: true },
  };
}
