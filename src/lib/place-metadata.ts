import 'server-only';
import type { Metadata } from 'next';
import { placeHeading, placeSummary, resolvePlace, type PlaceParams } from '@/components/directory/location-landing';
import { getServicePlaces } from './data';
import { pagedCanonical } from './page-param';
import { MAX_DESCRIPTION } from './seo-text';
import { countrySlug, getStatePlaces, isIndexable, placePath } from './places';

/** Placeholder so the routes validate at build time before any company is published. */
export const SHELL = '__shell__';

/** Busiest location pages are rendered ahead of time; the rest render on first visit and are cached. */
const PRERENDER_LIMIT = 500;

export async function placeStaticParams(level: 'country' | 'city'): Promise<PlaceParams[]> {
  const all = level === 'city' ? [...(await getServicePlaces()), ...(await getStatePlaces())] : await getServicePlaces();
  const places = all.filter((p) => (level === 'city' ? p.city : !p.city) && isIndexable(p)).slice(0, PRERENDER_LIMIT);
  if (!places.length) return [level === 'city' ? { service: SHELL, country: SHELL, city: SHELL } : { service: SHELL, country: SHELL }];
  return places.map((p) => ({ service: p.service, country: countrySlug(p.countryCode), ...(level === 'city' ? { city: p.citySlug } : {}) }));
}

export async function placeMetadata(
  params: PlaceParams,
  searchParams: Promise<Record<string, string | string[] | undefined>>,
): Promise<Metadata> {
  const resolved = await resolvePlace(params);
  if (!resolved) return { title: 'Page not found', robots: { index: false } };
  const { service, place } = resolved;
  const { canonical, suffix } = await pagedCanonical(placePath(place), searchParams);
  const title = `${placeHeading(service, place)}${suffix}`;
  const summary = placeSummary(service, place);
  // Search results cut descriptions at about 155 characters, so the longest call to action that fits is used.
  const cta = [' Compare checked client reviews, hourly rates and minimum budgets, then send one brief.', ' Compare reviews and rates for free.', ' Compare reviews and rates.', ''].find(
    (text) => summary.length + text.length <= MAX_DESCRIPTION,
  );
  const description = summary + (cta ?? '');
  return {
    title,
    description,
    alternates: { canonical },
    // Pages with only a few listings stay out of search results until more companies join.
    robots: isIndexable(place) ? undefined : { index: false, follow: true },
  };
}
