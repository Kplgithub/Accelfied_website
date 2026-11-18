import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CompanyCard } from '@/components/company/company-card';
import { Bullets, DataTable, FaqList, LandingHero, MoreGuides, QuoteCta, Sections, ServiceLinks } from '@/components/landing/landing-parts';
import { Container } from '@/components/ui/container';
import { getCompanies } from '@/lib/data';
import { pluralize } from '@/lib/format';
import { INDUSTRY_PAGES, getIndustryPage } from '@/lib/landing/industries';
import { landingMetadata } from '@/lib/landing/metadata';
import type { IndustryPage } from '@/lib/landing/types';

/** Not linked from the site menus (kapil, 2026-11-18); listed in /sitemap.xml for search engines. */
export function generateStaticParams() {
  return INDUSTRY_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps<'/industries/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  return landingMetadata(getIndustryPage(slug), `/industries/${slug}`);
}

export default function IndustryLandingPage({ params }: PageProps<'/industries/[slug]'>) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <Industry params={params} />
    </Suspense>
  );
}

async function Industry({ params }: Pick<PageProps<'/industries/[slug]'>, 'params'>) {
  const { slug } = await params;
  const page = getIndustryPage(slug);
  if (!page) notFound();
  return (
    <>
      <LandingHero page={page} path={`/industries/${page.slug}`} />
      <Container className="py-10 lg:py-14">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-surface" />}>
          <Companies page={page} />
        </Suspense>
        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">What {page.short} software companies build</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {page.builds.map((item) => (
              <li key={item.title} className="rounded-[var(--radius-card)] bg-surface p-5 ring-1 ring-line">
                <h3 className="font-semibold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>
        <Sections sections={[page.compliance]} />
        <DataTable table={page.costs} />
        <Sections sections={page.sections} />
        <section className="mt-14 max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Questions to ask before you hire</h2>
          <Bullets items={page.questions} />
        </section>
        <FaqList faqs={page.faqs} />
        <ServiceLinks services={page.services} heading={`Services ${page.short} businesses hire for`} />
        <QuoteCta service={page.services[0]} text={`Tell us what you are building. Companies with ${page.short} experience that match your budget get in touch with quotes.`} />
        <MoreGuides kind="industries" current={page.slug} />
      </Container>
    </>
  );
}

/** Real companies in India that list this industry on their profile, highest rated first. */
async function Companies({ page }: { page: IndustryPage }) {
  const result = await getCompanies({ industry: page.industry, country: 'IN', sort: 'rating' });
  const all = `/agencies?industry=${encodeURIComponent(page.industry)}&country=IN`;
  return (
    <section>
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Companies in India with {page.short} experience</h2>
      {result.items.length ? (
        <>
          <p className="mt-2 text-ink-soft">
            {pluralize(result.total, 'company', 'companies')} on Accelfied {result.total === 1 ? 'lists' : 'list'} {page.short} among the industries they serve. Ratings come only from published client reviews.
          </p>
          <div className="mt-6 space-y-4">
            {result.items.map((company) => (
              <CompanyCard key={company.id} company={company} highlightService={page.services[0]} />
            ))}
          </div>
          {result.total > result.items.length && (
            <Link href={all} className="mt-6 inline-block font-medium text-accent hover:underline">
              See all {pluralize(result.total, 'company', 'companies')}
            </Link>
          )}
        </>
      ) : (
        <p className="mt-3 max-w-3xl rounded-[var(--radius-card)] bg-surface p-5 text-ink-soft ring-1 ring-line">
          No company on Accelfied lists {page.short} as an industry yet. Use the guide below to plan your project, or{' '}
          <Link href="/get-listed" className="font-medium text-accent hover:underline">
            list your company
          </Link>{' '}
          if you build {page.short} software.
        </p>
      )}
    </section>
  );
}
