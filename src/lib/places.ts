import 'server-only';
import { countryName } from './countries';
import { getServicePlaces } from './data';
import { SITE_URL } from './site';
import type { ServicePlace } from './types';

/**
 * Location pages with fewer companies than this stay reachable for visitors
 * but are kept out of search results and the sitemap. One company is enough
 * (kapil, 2026-11-18): every location page also carries its own real-data facts
 * and FAQ (PlaceFacts), so even a small page is not thin.
 */
export const MIN_COMPANIES_TO_INDEX = 1;

/** URL-safe form of a place name: "New Delhi" becomes "new-delhi". */
export function placeSlug(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Country names come from our fixed list, never from what a company typed. */
export function countrySlug(countryCode: string): string {
  return placeSlug(countryName(countryCode));
}

export function placeName(place: ServicePlace): string {
  return place.city || countryName(place.countryCode);
}

export function placePath(place: ServicePlace): string {
  const base = `/agencies/${place.service}/${countrySlug(place.countryCode)}`;
  return place.city ? `${base}/${place.citySlug}` : base;
}

export function placeUrl(place: ServicePlace): string {
  return `${SITE_URL}${placePath(place)}`;
}

export function isIndexable(place: ServicePlace): boolean {
  return place.companies >= MIN_COMPANIES_TO_INDEX;
}

/**
 * Services that at least one published company offers. Service pages for the rest have no listings yet, so they
 * stay out of search results and the sitemap until a company joins, like thin location pages.
 */
export async function listedServices(): Promise<Set<string>> {
  return new Set((await getServicePlaces()).map((place) => place.service));
}

export async function findPlace(service: string, country: string, city?: string): Promise<ServicePlace | null> {
  const places = await getServicePlaces();
  return (
    places.find(
      (place) =>
        place.service === service &&
        countrySlug(place.countryCode) === country &&
        (city ? place.citySlug === city : place.city === ''),
    ) ?? null
  );
}

export interface RelatedPlaces {
  /** Countries this service is offered in (service pages). */
  countries: ServicePlace[];
  /** Cities in the same country offering the same service. */
  cities: ServicePlace[];
  /** Other services offered in the same city or country. */
  services: ServicePlace[];
}

/** Internal links between location pages, busiest first. */
export async function relatedPlaces(service: string, near?: ServicePlace, limit = 24): Promise<RelatedPlaces> {
  const places = await getServicePlaces();
  const countries = places.filter((p) => p.service === service && !p.city).slice(0, limit);
  if (!near) {
    const cities = places.filter((p) => p.service === service && p.city).slice(0, limit);
    return { countries, cities, services: [] };
  }
  const cities = places
    .filter((p) => p.service === service && p.countryCode === near.countryCode && p.city && p.citySlug !== near.citySlug)
    .slice(0, limit);
  const services = places
    .filter((p) => p.service !== service && p.countryCode === near.countryCode && p.citySlug === near.citySlug)
    .slice(0, limit);
  return { countries: countries.filter((p) => p.countryCode !== near.countryCode), cities, services };
}
