import { ArrowUpRight, Globe2, Landmark, MapPin } from 'lucide-react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';
import { Container } from '@/components/ui/container';
import { countryName } from '@/lib/countries';
import { getCountryFacets, getServicePlaces, getStateData } from '@/lib/data';
import { getStatePlaces, isIndexable, placePath } from '@/lib/places';
import type { CountryFacet, ServicePlace } from '@/lib/types';

const INDIA = 'IN';
const CITY_CARDS = 6;
const SERVICES_PER_CITY = 4;
const STATES = 8;
const COUNTRIES = 8;

interface PlaceGroup {
  slug: string;
  name: string;
  /** Busiest service first. */
  places: ServicePlace[];
}

/** Groups service pages by city (or state), busiest place first. */
function byPlace(places: ServicePlace[]): PlaceGroup[] {
  const groups = new Map<string, PlaceGroup>();
  for (const place of places.filter(isIndexable)) {
    const group = groups.get(place.citySlug) ?? { slug: place.citySlug, name: place.city, places: [] };
    group.places.push(place);
    groups.set(place.citySlug, group);
  }
  const weight = (group: PlaceGroup) => group.places.reduce((sum, place) => sum + place.companies, 0);
  for (const group of groups.values()) group.places.sort((a, b) => b.companies - a.companies || a.serviceName.localeCompare(b.serviceName));
  return [...groups.values()].sort((a, b) => weight(b) - weight(a) || a.name.localeCompare(b.name));
}

/**
 * Cities, states and countries with live listings, in one section. Every count is a real number of
 * published companies, and only places that have companies are shown.
 */
export async function LocationExplorer() {
  const [places, statePlaces, { states }, countries] = await Promise.all([getServicePlaces(), getStatePlaces(), getStateData(), getCountryFacets()]);
  const cities = byPlace(places.filter((place) => place.countryCode === INDIA && place.city)).slice(0, CITY_CARDS);
  const stateGroups = byPlace(statePlaces).slice(0, STATES);
  const countryList = countries.filter((country) => country.count > 0).slice(0, COUNTRIES);
  if (!cities.length && !stateGroups.length && !countryList.length) return null;

  const stateOf = new Map(states.flatMap((state) => state.cities.map((city) => [city.toLowerCase(), state.name] as const)));

  return (
    <section className="relative overflow-hidden bg-night py-20 text-paper lg:py-28" aria-labelledby="locations-heading">
      <div className="grid-lines absolute inset-0" aria-hidden="true" />
      <span className="orb -top-40 right-0 size-[420px] bg-accent/30" aria-hidden="true" />
      <Container className="relative">
        <Reveal className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-accent-soft uppercase">Across India</p>
            <h2 id="locations-heading" className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
              Find a company in your city or state
            </h2>
          </div>
          <p className="text-lg text-paper/70 lg:pb-1">
            Some projects go better when you can sit across the table. These are the places with companies listed right now, busiest first.
          </p>
        </Reveal>

        <div className={`mt-12 grid gap-6 ${cities.length ? 'lg:grid-cols-[minmax(0,1fr)_340px]' : ''}`}>
          {cities.length > 0 && (
            <ul className="grid gap-4 sm:grid-cols-2">
              {cities.map((city, index) => (
                <Reveal as="li" key={city.slug} delay={(index % 2) * 90} className="h-full">
                  <CityCard city={city} state={stateOf.get(city.name.toLowerCase())} />
                </Reveal>
              ))}
            </ul>
          )}

          <Reveal className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {stateGroups.length > 0 && (
              <PlacePanel icon={<Landmark className="size-4.5" aria-hidden="true" />} title="States">
                {stateGroups.map((state) => (
                  <PanelRow key={state.slug} href={placePath(state.places[0]!)} label={state.name} meta={`${state.places.length} ${state.places.length === 1 ? 'service' : 'services'}`} />
                ))}
              </PlacePanel>
            )}
            {countryList.length > 0 && (
              <PlacePanel icon={<Globe2 className="size-4.5" aria-hidden="true" />} title="Countries">
                {countryList.map((country: CountryFacet) => (
                  <PanelRow
                    key={country.countryCode}
                    href={`/agencies?country=${country.countryCode}`}
                    label={countryName(country.countryCode)}
                    meta={`${country.count} ${country.count === 1 ? 'company' : 'companies'}`}
                  />
                ))}
              </PlacePanel>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function CityCard({ city, state }: { city: PlaceGroup; state?: string }) {
  const shown = city.places.slice(0, SERVICES_PER_CITY);
  const more = city.places.length - shown.length;
  return (
    <div className="group flex h-full flex-col rounded-[1.5rem] bg-white/[0.045] p-6 ring-1 ring-white/10 transition-[background-color,box-shadow] duration-300 hover:bg-white/[0.07] hover:ring-white/25">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-2xl font-semibold text-white">{city.name}</h3>
          <p className="mt-0.5 text-sm text-paper/55">
            {state ? `${state} · ` : ''}
            {city.places.length} {city.places.length === 1 ? 'service' : 'services'}
          </p>
        </div>
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/90 text-white shadow-[0_8px_20px_-8px_rgb(199_54_47/0.9)] transition-transform duration-300 group-hover:-translate-y-0.5">
          <MapPin className="size-4.5" aria-hidden="true" />
        </span>
      </div>
      <ul className="mt-5 flex-1 space-y-1">
        {shown.map((place) => (
          <li key={place.service}>
            <Link
              href={placePath(place)}
              prefetch={false}
              className="group/link -mx-2 flex items-center justify-between gap-3 rounded-xl px-2 py-2 text-[15px] text-paper/80 transition-colors hover:bg-white/5 hover:text-white"
            >
              <span className="truncate">{place.serviceName}</span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-paper/80 tabular-nums">{place.companies}</span>
                <ArrowUpRight className="size-4 text-accent-soft opacity-60 transition-opacity group-hover/link:opacity-100" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {more > 0 && <p className="mt-3 text-sm text-accent-soft">+{more} more services in {city.name}</p>}
    </div>
  );
}

function PlacePanel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-[1.5rem] bg-paper p-5 text-ink shadow-[0_20px_50px_-30px_rgb(0_0_0/0.6)]">
      <h3 className="flex items-center gap-2 px-1 text-sm font-semibold tracking-[0.14em] text-ink-soft uppercase">
        <span className="text-brand">{icon}</span>
        {title}
      </h3>
      <ul className="mt-3 divide-y divide-line">{children}</ul>
    </div>
  );
}

function PanelRow({ href, label, meta }: { href: string; label: string; meta: string }) {
  return (
    <li>
      <Link href={href} prefetch={false} className="group flex items-center justify-between gap-3 rounded-lg px-1 py-2.5 text-[15px] transition-colors hover:text-accent">
        <span className="truncate font-medium">{label}</span>
        <span className="flex shrink-0 items-center gap-1.5 text-sm text-ink-faint">
          {meta}
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </span>
      </Link>
    </li>
  );
}
