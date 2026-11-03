import Link from 'next/link';
import { placePath } from '@/lib/places';
import type { ServicePlace } from '@/lib/types';

/** A block of links to other location pages. Renders nothing when there are none. */
export function PlaceLinks({ title, places, label }: { title: string; places: ServicePlace[]; label: (place: ServicePlace) => string }) {
  if (!places.length) return null;
  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
      <ul className="mt-5 grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((place) => (
          <li key={placePath(place)}>
            <Link href={placePath(place)} className="group -mx-3 flex items-baseline justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface">
              <span className="text-ink group-hover:text-accent">{label(place)}</span>
              <span className="shrink-0 text-sm text-ink-faint">{place.companies}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

