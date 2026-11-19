'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Select } from '@/components/ui/field';

/** Picks one page to see its numbers alone. Works without scripts too (the form submits). */
export function PageFilter({ days, page, options }: { days: number; page: string; options: Array<{ value: string; label: string }> }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <form action="/dashboard/company/analytics" className="w-full min-w-0 sm:w-64" aria-busy={pending}>
      <input type="hidden" name="days" value={days} />
      <label htmlFor="page-filter" className="sr-only">
        Page
      </label>
      <Select
        id="page-filter"
        name="page"
        defaultValue={page}
        className="h-10"
        onChange={(event) => {
          const query = new URLSearchParams({ days: String(days) });
          if (event.target.value) query.set('page', event.target.value);
          startTransition(() => router.push(`/dashboard/company/analytics?${query}`));
        }}
      >
        <option value="">All pages</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {page && !options.some((option) => option.value === page) && <option value={page}>{page}</option>}
      </Select>
      <noscript>
        <button type="submit">Show</button>
      </noscript>
    </form>
  );
}
