import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';
import { Container } from '@/components/ui/container';
import { getServicePlaces } from '@/lib/data';
import { getStatePlaces, isIndexable, placePath } from '@/lib/places';
import type { ServicePlace } from '@/lib/types';

const INDIA = 'IN';

/**
 * Links from the home page to the busiest city and state pages in India, so people (and search engines)
 * reach "web development companies in Jaipur" in one click. Counts are live listings; nothing is shown
 * for a place without companies.
 */
export async function IndiaSearches() {
  const [places, states] = await Promise.all([getServicePlaces(), getStatePlaces()]);
  const busiest = (list: ServicePlace[], limit: number) => list.filter(isIndexable).sort((a, b) => b.companies - a.companies || a.city.localeCompare(b.city)).slice(0, limit);
  const cities = busiest(places.filter((p) => p.countryCode === INDIA && p.city), 18);
  const stateList = busiest(states, 12);
  if (!cities.length && !stateList.length) return null;

  return (
    <section className="py-20 lg:py-28" aria-labelledby="india-searches">
      <Container>
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Across India</p>
          <h2 id="india-searches" className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">
            Find a company in your city or state
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            Some projects go better when you can sit across the table. Start with the cities and states that have the most companies listed right now.
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10">
          {cities.length > 0 && <PlaceList title="Popular city searches" places={cities} />}
          {stateList.length > 0 && <PlaceList title="Popular state searches" places={stateList} />}
        </div>
      </Container>
    </section>
  );
}

function PlaceList({ title, places }: { title: string; places: ServicePlace[] }) {
  return (
    <Reveal className="min-w-0">
      <h3 className="font-semibold text-ink">{title}</h3>
      <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((place) => (
          <li key={placePath(place)}>
            <Link
              href={placePath(place)}
              prefetch={false}
              className="lift flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-[15px]"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <MapPin className="size-4 shrink-0 text-accent" aria-hidden="true" />
                <span className="truncate text-ink">
                  {place.serviceName} in {place.city}
                </span>
              </span>
              <span className="shrink-0 rounded-full bg-paper px-2.5 py-0.5 text-sm text-ink-soft tabular-nums">{place.companies}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
