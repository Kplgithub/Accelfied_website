'use client';

import { MapPin, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { COUNTRIES } from '@/lib/countries';
import type { ServiceGroup } from '@/lib/types';

export function HeroSearch({ groups }: { groups: ServiceGroup[] }) {
  const router = useRouter();
  const [service, setService] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!service) {
      setError(true);
      return;
    }
    router.push(`/agencies/${service}${country ? `?country=${country}` : ''}`);
  }

  return (
    <form onSubmit={onSubmit} className="w-full" role="search" aria-label="Find companies">
      <div className="flex flex-col gap-2 rounded-[1.6rem] border border-line bg-surface p-2 shadow-[var(--shadow-lift)] md:flex-row md:items-center md:gap-0">
        <label className="flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 md:py-2">
          <Search className="size-5 shrink-0 text-brand" aria-hidden="true" />
          <span className="sr-only">Service you need</span>
          <select
            value={service}
            onChange={(event) => {
              setService(event.target.value);
              setError(false);
            }}
            aria-invalid={error}
            aria-describedby={error ? 'hero-search-error' : undefined}
            className="w-full cursor-pointer appearance-none bg-transparent text-[16px] text-ink outline-none"
          >
            <option value="">Choose a service</option>
            {groups.map((group) => (
              <optgroup key={group.slug} label={group.name}>
                {group.services.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <span className="hidden h-8 w-px bg-line md:block" aria-hidden="true" />
        <label className="flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 md:py-2">
          <MapPin className="size-5 shrink-0 text-brand" aria-hidden="true" />
          <span className="sr-only">Location</span>
          <select
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            className="w-full cursor-pointer appearance-none bg-transparent text-[16px] text-ink outline-none"
          >
            <option value="">Anywhere in the world</option>
            {COUNTRIES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="inline-flex h-13 cursor-pointer items-center justify-center gap-2 rounded-[1.1rem] bg-brand px-7 font-medium text-white transition-colors hover:bg-brand-strong"
        >
          Find companies
        </button>
      </div>
      {error && (
        <p id="hero-search-error" role="alert" className="mt-3 pl-4 text-sm font-medium text-danger">
          Pick a service first, then we will show matching companies.
        </p>
      )}
    </form>
  );
}
