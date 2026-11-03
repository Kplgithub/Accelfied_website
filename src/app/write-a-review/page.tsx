import { Search } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { CompanyLogo } from '@/components/company/company-logo';
import { ReviewForm } from '@/components/forms/review-form';
import { Container } from '@/components/ui/container';
import { EmptyState } from '@/components/ui/empty-state';
import { getCompanies, getCompany, getServiceGroups } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Write a review',
  description: 'Share your experience working with an agency or service company. Every review is checked before it is published.',
  alternates: { canonical: '/write-a-review' },
};

export default function WriteAReviewPage({ searchParams }: PageProps<'/write-a-review'>) {
  return (
    <Container className="max-w-5xl py-12 lg:py-16">
      <Suspense fallback={<div className="h-[640px] animate-pulse rounded-[var(--radius-card)] bg-surface" />}>
        <ReviewContent searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

async function ReviewContent({ searchParams }: Pick<PageProps<'/write-a-review'>, 'searchParams'>) {
  const params = await searchParams;
  const slug = typeof params.company === 'string' ? params.company : '';
  const company = slug ? await getCompany(slug) : null;

  if (!company) {
    const find = typeof params.find === 'string' ? params.find.trim().slice(0, 100) : '';
    return <CompanyPicker find={find} />;
  }

  const groups = await getServiceGroups();
  return (
    <>
      <header className="mb-10 flex items-center gap-5">
        <CompanyLogo name={company.name} logoUrl={company.logoUrl} size={72} />
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-saffron-ink uppercase">Write a review</p>
          <h1 className="mt-2 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">
            How was working with {company.name}?
          </h1>
        </div>
      </header>
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-10">
        <ReviewForm
          company={{ slug: company.slug, name: company.name, services: company.services.map(({ slug, name }) => ({ slug, name })) }}
          groups={groups}
        />
      </div>
    </>
  );
}

async function CompanyPicker({ find }: { find: string }) {
  const results = find.length >= 2 ? await getCompanies({ q: find, page: 1 }) : null;
  return (
    <>
      <header className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.16em] text-saffron-ink uppercase">Write a review</p>
        <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">
          Which company did you work with?
        </h1>
        <p className="mt-4 text-lg text-ink-soft">Your review helps the next client choose well. It takes about five minutes.</p>
      </header>
      <form method="get" role="search" className="flex max-w-2xl">
        <label htmlFor="find" className="sr-only">
          Company name
        </label>
        <input
          id="find"
          name="find"
          defaultValue={find}
          minLength={2}
          placeholder="Type the company name"
          className="h-13 w-full rounded-l-2xl border border-r-0 border-line-strong bg-surface px-4 text-[16px] outline-none focus:border-brand"
        />
        <button type="submit" className="inline-flex h-13 cursor-pointer items-center gap-2 rounded-r-2xl bg-brand px-6 font-medium text-white hover:bg-brand-strong">
          <Search className="size-4" aria-hidden="true" />
          Find
        </button>
      </form>
      {results && (
        <div className="mt-8 max-w-2xl">
          {results.items.length ? (
            <ul className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
              {results.items.map((company) => (
                <li key={company.id}>
                  <Link href={`/write-a-review?company=${company.slug}`} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-paper">
                    <CompanyLogo name={company.name} logoUrl={company.logoUrl} size={44} />
                    <span className="flex-1">
                      <span className="block font-medium text-ink">{company.name}</span>
                      <span className="text-sm text-ink-soft">
                        {company.headquarters.city}, {company.headquarters.country}
                      </span>
                    </span>
                    <span className="text-sm font-medium text-brand">Review</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="We could not find that company">
              Only companies listed on Accelfied can be reviewed. Ask them to list their company, then come back.
            </EmptyState>
          )}
        </div>
      )}
    </>
  );
}
