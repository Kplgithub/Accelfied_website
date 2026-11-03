import { CompanyCard } from '@/components/company/company-card';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { getCompanies, getCountryFacets, type DirectoryQuery } from '@/lib/data';
import { hasActiveFilters } from '@/lib/directory';
import { pluralize } from '@/lib/format';
import { DirectoryFilters } from './directory-filters';
import { Pagination } from './pagination';

export async function DirectoryResults({ query, basePath }: { query: DirectoryQuery; basePath: string }) {
  const [page, countries] = await Promise.all([getCompanies(query), getCountryFacets(query.service)]);
  const filtered = hasActiveFilters(query);

  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'service' || key === 'page' || value === undefined) continue;
      params.set(key, Array.isArray(value) ? value.join(',') : String(value));
    }
    if (target > 1) params.set('page', String(target));
    return `${basePath}${params.size ? `?${params}` : ''}`;
  };

  return (
    <>
      <DirectoryFilters countries={countries} showSearch={!query.service} />
      <p className="mt-6 text-sm text-ink-soft" aria-live="polite">
        {page.total === 0 ? 'No companies match yet' : `${pluralize(page.total, 'company', 'companies')} found`}
      </p>
      {page.items.length > 0 ? (
        <>
          <div className="mt-4 grid gap-5">
            {page.items.map((company) => (
              <CompanyCard key={company.id} company={company} highlightService={query.service} />
            ))}
          </div>
          <Pagination page={page.page} totalPages={page.totalPages} hrefFor={hrefFor} />
        </>
      ) : (
        <div className="mt-4">
          <EmptyState
            title={filtered ? 'Nothing matches these filters' : 'No companies listed here yet'}
            action={<ButtonLink href="/get-listed">List your company</ButtonLink>}
          >
            {filtered
              ? 'Try removing a filter or widening the location.'
              : 'Be the first company in this category. Listing is free and takes a few minutes.'}
          </EmptyState>
        </div>
      )}
    </>
  );
}

export function DirectorySkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="flex gap-3">
        <div className="h-11 flex-1 rounded-xl bg-paper-deep" />
        <div className="h-11 w-40 rounded-xl bg-paper-deep" />
      </div>
      <div className="mt-8 grid gap-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-56 rounded-[var(--radius-card)] bg-surface" />
        ))}
      </div>
    </div>
  );
}
