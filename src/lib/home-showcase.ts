import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { apiGet } from './api';
import type { CompanySummary } from './types';

export interface ShowcaseCategory {
  service: string;
  name: string;
  companies: CompanySummary[];
}

export interface ClientLogo {
  name: string;
  imageUrl: string;
  href: string;
}

export interface HomeShowcase {
  topRated: { heading: string; categories: ShowcaseCategory[] };
  clientLogos: { heading: string; logos: ClientLogo[] };
}

const EMPTY: HomeShowcase = { topRated: { heading: '', categories: [] }, clientLogos: { heading: '', logos: [] } };

/**
 * The home page sections our team sets in the admin panel: top-rated companies per category and
 * client logos. Ratings inside come from approved reviews only. If the API is older than this site
 * or cannot be reached, both sections are simply left out.
 */
export async function getHomeShowcase(): Promise<HomeShowcase> {
  'use cache';
  cacheLife({ stale: 60, revalidate: 300, expire: 86_400 });
  cacheTag('home-showcase', 'companies', 'reviews');
  try {
    const data = await apiGet<HomeShowcase>('/v1/home/showcase');
    return { topRated: data.topRated ?? EMPTY.topRated, clientLogos: data.clientLogos ?? EMPTY.clientLogos };
  } catch (error) {
    console.error('Home showcase unavailable', error);
    return EMPTY;
  }
}
