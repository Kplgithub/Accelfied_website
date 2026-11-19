import { ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { CompanyLogo } from '@/components/company/company-logo';
import { Reveal } from '@/components/motion/reveal';
import { Container } from '@/components/ui/container';
import { SealIcon } from '@/components/ui/seal-icon';
import { Stars } from '@/components/ui/stars';
import { formatRating, pluralize } from '@/lib/format';
import type { ShowcaseCategory } from '@/lib/home-showcase';
import type { CompanySummary } from '@/lib/types';
import { ShowcaseTabs } from './showcase-tabs';

/**
 * "Top rated by category": tabs and companies chosen by our team in the admin panel (or picked
 * automatically from the best-rated companies). Every score and count is from approved reviews.
 */
export function TopRatedShowcase({ heading, categories }: { heading: string; categories: ShowcaseCategory[] }) {
  if (!categories.length) return null;
  const tabs = categories.map((category) => ({
    id: category.service,
    label: category.name,
    content: <CategoryPanel category={category} />,
  }));

  return (
    <section className="relative overflow-hidden border-y border-line bg-surface py-20 lg:py-28" aria-labelledby="top-rated-heading">
      <div className="dot-field absolute inset-x-0 top-0 h-72" aria-hidden="true" />
      <Container className="relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Top rated</p>
          <h2 id="top-rated-heading" className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink text-balance sm:text-5xl">
            {heading || 'The best-reviewed companies in every category'}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-soft">
            Scores come only from client reviews our team has read and approved. Pick a category to see who leads it right now.
          </p>
        </Reveal>
        <Reveal className="mt-10">
          <ShowcaseTabs label="Top rated companies by category" tabs={tabs} />
        </Reveal>
      </Container>
    </section>
  );
}

function CategoryPanel({ category }: { category: ShowcaseCategory }) {
  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {category.companies.map((company, index) => (
          <li key={company.id} className="animate-rise" style={{ animationDelay: `${index * 60}ms` }}>
            <ShowcaseCard company={company} service={category.service} />
          </li>
        ))}
      </ul>
      <div className="mt-10 text-center">
        <Link
          href={`/agencies/${category.service}`}
          className="group inline-flex h-12 items-center gap-2 rounded-full bg-night px-7 text-[15px] font-medium text-paper shadow-[0_14px_30px_-14px_rgb(23_49_59/0.8)] transition-colors hover:bg-night-soft"
        >
          See all {category.name} companies
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function ShowcaseCard({ company, service }: { company: CompanySummary; service: string }) {
  const focus = company.services.find((line) => line.slug === service) ?? company.services[0];
  const rated = company.rating.count > 0;
  return (
    <article className="showcase-card group relative h-full overflow-hidden rounded-[1.35rem] border border-line bg-surface p-5 shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-[var(--shadow-lift)] sm:p-6">
      <div className="flex items-start gap-4">
        <CompanyLogo name={company.name} logoUrl={company.logoUrl} size={60} />
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 font-display text-xl leading-snug font-semibold text-ink">
            <Link href={`/profile/${company.slug}`} className="truncate after:absolute after:inset-0">
              {company.name}
            </Link>
            {company.verified && (
              <span title={company.premier ? 'Premier Verified' : 'Verified'} className="shrink-0">
                <SealIcon premier={company.premier} className="size-[18px]" />
                <span className="sr-only">{company.premier ? 'Premier Verified' : 'Verified'}</span>
              </span>
            )}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-ink-soft">
            <MapPin className="size-3.5 shrink-0 text-accent" aria-hidden="true" />
            <span className="truncate">
              {company.headquarters.city}
              {focus && <> · {focus.name}</>}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-5 flex items-end justify-between gap-3 border-t border-dashed border-line-strong/70 pt-4">
        {rated ? (
          <>
            <span className="flex items-center gap-2" aria-label={`Rated ${formatRating(company.rating.average)} out of 5`}>
              <span className="font-display text-[1.6rem] leading-none font-semibold text-ink tabular-nums">{formatRating(company.rating.average)}</span>
              <Stars value={company.rating.average} size={15} />
            </span>
            <span className="text-sm font-medium text-ink-soft tabular-nums">{pluralize(company.rating.count, 'review')}</span>
          </>
        ) : (
          <span className="text-sm text-ink-faint">New listing, no reviews yet</span>
        )}
      </div>
    </article>
  );
}
