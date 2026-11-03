import type { MetadataRoute } from 'next';
import { getServiceGroups, getServicePlaces } from '@/lib/data';
import { isIndexable, placeUrl } from '@/lib/places';
import { SITE_URL } from '@/lib/site';

/** Leaves room for the service pages under Google's 50,000 URL limit. */
const MAX_PLACES = 48_000;

/** Service pages plus every country and city page with enough listings to be indexed. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [groups, places] = await Promise.all([getServiceGroups(), getServicePlaces()]);
  return [
    ...groups.flatMap((group) =>
      group.services.map((service) => ({ url: `${SITE_URL}/agencies/${service.slug}`, changeFrequency: 'daily' as const, priority: 0.8 })),
    ),
    ...places
      .filter(isIndexable)
      .slice(0, MAX_PLACES)
      .map((place) => ({ url: placeUrl(place), changeFrequency: 'daily' as const, priority: place.city ? 0.6 : 0.7 })),
  ];
}
