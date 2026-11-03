'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition, type FormEvent } from 'react';
import { BUDGETS, HOURLY_RATES, INDUSTRIES, SORTS, TEAM_SIZES } from '@/lib/labels';
import type { CountryFacet } from '@/lib/types';

const FILTER_KEYS = ['country', 'budget', 'hourlyRate', 'teamSize', 'industry', 'minRating', 'verified', 'q'] as const;

export function DirectoryFilters({ countries, showSearch }: { countries: CountryFacet[]; showSearch: boolean }) {
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
    startTransition(() => router.push(`${pathname}${next.size ? `?${next}` : ''}`, { scroll: false }));
  }

  function clearAll() {
    const next = new URLSearchParams(params.toString());
    FILTER_KEYS.forEach((key) => next.delete(key));
    next.delete('page');
    setQ('');
    startTransition(() => router.push(`${pathname}${next.size ? `?${next}` : ''}`, { scroll: false }));
  }

  function onSearch(event: FormEvent) {
    event.preventDefault();
    update('q', q.trim().length >= 2 ? q.trim() : '');
  }

  const active = FILTER_KEYS.filter((key) => params.get(key)).length;

  const selects = (
    <>
      <FilterSelect label="Location" value={params.get('country') ?? ''} onChange={(v) => update('country', v)}>
        <option value="">Any location</option>
        {countries.map((c) => (
          <option key={c.countryCode} value={c.countryCode}>
            {c.country} ({c.count})
          </option>
        ))}
      </FilterSelect>
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
      <label className="flex h-11 cursor-pointer items-center gap-2.5 rounded-xl border border-line-strong bg-surface px-3.5 text-[15px] text-ink">
        <input
          type="checkbox"
          checked={params.get('verified') === 'true'}
          onChange={(event) => update('verified', event.target.checked ? 'true' : '')}
          className="size-4 accent-[var(--brand)]"
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
              className="h-11 w-full rounded-l-xl border border-r-0 border-line-strong bg-surface px-3.5 text-[15px] outline-none focus:border-brand"
            />
            <button type="submit" className="h-11 cursor-pointer rounded-r-xl bg-ink px-4 text-sm font-medium text-paper hover:bg-night-soft">
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
        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="directory-sort" className="text-sm text-ink-soft">
            Sort by
          </label>
          <select
            id="directory-sort"
            value={params.get('sort') ?? 'recommended'}
            onChange={(event) => update('sort', event.target.value === 'recommended' ? '' : event.target.value)}
            className="h-11 cursor-pointer rounded-xl border border-line-strong bg-surface px-3 text-[15px] text-ink"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        id="directory-filter-panel"
        className={`${open ? 'grid' : 'hidden'} mt-4 gap-3 sm:grid-cols-2 lg:grid lg:grid-cols-4 xl:grid-cols-7`}
      >
        {selects}
      </div>

      {active > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-brand hover:underline"
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
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className={`h-11 w-full cursor-pointer rounded-xl border bg-surface px-3 text-[15px] ${value ? 'border-brand text-brand' : 'border-line-strong text-ink'}`}
      >
        {children}
      </select>
    </label>
  );
}
