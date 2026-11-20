'use client';

import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition, type FormEvent } from 'react';
import { BUDGETS, HOURLY_RATES, INDUSTRIES, SORTS, TEAM_SIZES } from '@/lib/labels';
import type { CountryFacet } from '@/lib/types';
import { startNavigationProgress } from '../layout/navigation-progress';

/** One look for every filter control: soft border, brand focus ring, no doubled browser outline. */
const controlLook =
  'h-11 rounded-xl border text-[15px] transition-[border-color,box-shadow,background-color] duration-150 hover:border-ink/40 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15';

const FILTER_KEYS = ['country', 'budget', 'hourlyRate', 'teamSize', 'industry', 'minRating', 'verified', 'q'] as const;

export function DirectoryFilters({
  countries,
  showSearch,
  showLocation = true,
}: {
  countries: CountryFacet[];
  showSearch: boolean;
  /** Location pages already fix the place, so they hide this filter. */
  showLocation?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(params.get('q') ?? '');

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    startNavigationProgress();
    startTransition(() => router.push(`${pathname}${next.size ? `?${next}` : ''}`, { scroll: false }));
  }

  function clearAll() {
    const next = new URLSearchParams(params.toString());
    FILTER_KEYS.forEach((key) => next.delete(key));
    next.delete('page');
    setQ('');
    startNavigationProgress();
    startTransition(() => router.push(`${pathname}${next.size ? `?${next}` : ''}`, { scroll: false }));
  }

  function onSearch(event: FormEvent) {
    event.preventDefault();
    update('q', q.trim().length >= 2 ? q.trim() : '');
  }

  const active = FILTER_KEYS.filter((key) => params.get(key)).length;

  const selects = (
    <>
      {showLocation && (
        <FilterSelect label="Location" value={params.get('country') ?? ''} onChange={(v) => update('country', v)}>
          <option value="">Any location</option>
          {countries.map((c) => (
            <option key={c.countryCode} value={c.countryCode}>
              {c.country} ({c.count})
            </option>
          ))}
        </FilterSelect>
      )}
      <FilterSelect label="Your budget" value={params.get('budget') ?? ''} onChange={(v) => update('budget', v)}>
        <option value="">Any budget</option>
        {BUDGETS.map((b) => (
          <option key={b.value} value={b.value}>
            {b.label}
          </option>
        ))}
      </FilterSelect>
      <FilterSelect label="Hourly rate" value={params.get('hourlyRate') ?? ''} onChange={(v) => update('hourlyRate', v)}>
        <option value="">Any rate</option>
        {HOURLY_RATES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </FilterSelect>
      <FilterSelect label="Team size" value={params.get('teamSize') ?? ''} onChange={(v) => update('teamSize', v)}>
        <option value="">Any size</option>
        {TEAM_SIZES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </FilterSelect>
      <FilterSelect label="Industry focus" value={params.get('industry') ?? ''} onChange={(v) => update('industry', v)}>
        <option value="">Any industry</option>
        {INDUSTRIES.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </FilterSelect>
      <FilterSelect label="Rating" value={params.get('minRating') ?? ''} onChange={(v) => update('minRating', v)}>
        <option value="">Any rating</option>
        <option value="4.5">4.5 and above</option>
        <option value="4">4.0 and above</option>
      </FilterSelect>
      <label
        className={`flex h-11 min-w-0 cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 text-[15px] whitespace-nowrap transition-colors duration-150 hover:border-ink/40 has-[:focus-visible]:border-accent has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/15 ${params.get('verified') === 'true' ? 'border-accent bg-accent-tint font-medium text-accent' : 'border-line-strong bg-surface text-ink'}`}
      >
        <input
          type="checkbox"
          checked={params.get('verified') === 'true'}
          onChange={(event) => update('verified', event.target.checked ? 'true' : '')}
          className="size-4 shrink-0 accent-[var(--brand)] focus-visible:outline-none"
        />
        Verified only
      </label>
    </>
  );

  return (
    <div aria-busy={pending} className={pending ? 'opacity-80 transition-opacity' : 'transition-opacity'}>
      <div className="flex flex-wrap items-center gap-3">
        {showSearch && (
          <form onSubmit={onSearch} className="flex min-w-0 flex-1 basis-72" role="search">
            <label htmlFor="directory-q" className="sr-only">
              Search companies by name
            </label>
            <input
              id="directory-q"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search by company name or keyword"
              className="h-11 w-full min-w-0 rounded-l-xl border border-r-0 border-line-strong bg-surface px-3.5 text-[15px] outline-none transition-[border-color,box-shadow] focus:border-accent focus:ring-4 focus:ring-accent/15"
            />
            <button type="submit" className="h-11 shrink-0 cursor-pointer rounded-r-xl bg-ink px-4 text-sm font-medium text-paper hover:bg-night-soft">
              Search
            </button>
          </form>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="directory-filter-panel"
          className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-line-strong bg-surface px-4 text-[15px] font-medium text-ink lg:hidden"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filters{active > 0 && ` (${active})`}
        </button>
        <div className="ml-auto flex min-w-0 items-center gap-2">
          <label htmlFor="directory-sort" className="shrink-0 text-sm text-ink-soft">
            Sort by
          </label>
          <span className="relative min-w-0">
            <select
              id="directory-sort"
              value={params.get('sort') ?? 'recommended'}
              onChange={(event) => update('sort', event.target.value === 'recommended' ? '' : event.target.value)}
              className={`${controlLook} w-full max-w-full cursor-pointer appearance-none truncate border-line-strong bg-surface pr-10 pl-3.5 font-medium text-ink`}
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
          </span>
        </div>
      </div>

      <div
        id="directory-filter-panel"
        className={`${open ? 'grid' : 'hidden'} mt-4 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid lg:grid-flow-col lg:grid-cols-none lg:auto-cols-[minmax(0,1fr)]`}
      >
        {selects}
      </div>

      {active > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          <X className="size-4" aria-hidden="true" />
          Clear all filters
        </button>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="relative block min-w-0">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        title={label}
        className={`${controlLook} w-full cursor-pointer appearance-none truncate pr-10 pl-3.5 ${value ? 'border-accent bg-accent-tint font-medium text-accent' : 'border-line-strong bg-surface text-ink'}`}
      >
        {children}
      </select>
      <ChevronDown
        className={`pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 ${value ? 'text-accent' : 'text-ink-soft'}`}
        aria-hidden="true"
      />
    </label>
  );
}
