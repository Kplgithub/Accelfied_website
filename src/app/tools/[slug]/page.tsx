import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CostCalculator } from '@/components/landing/cost-calculator';
import { DataTable, FaqList, LandingHero, MoreGuides, QuoteCta, Sections, ServiceLinks } from '@/components/landing/landing-parts';
import { Container } from '@/components/ui/container';
import { CALCULATORS, getCalculator } from '@/lib/landing/calculators';
import { landingMetadata } from '@/lib/landing/metadata';

/** Not linked from the site menus (kapil, 2026-11-18); listed in /sitemap.xml for search engines. */
export function generateStaticParams() {
  return CALCULATORS.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps<'/tools/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  return landingMetadata(getCalculator(slug), `/tools/${slug}`);
}

export default function CalculatorPage({ params }: PageProps<'/tools/[slug]'>) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <Calculator params={params} />
    </Suspense>
  );
}

async function Calculator({ params }: Pick<PageProps<'/tools/[slug]'>, 'params'>) {
  const { slug } = await params;
  const page = getCalculator(slug);
  if (!page) notFound();
  return (
    <>
      <LandingHero page={page} path={`/tools/${page.slug}`} />
      <Container className="py-10 lg:py-14">
        <CostCalculator
          unit={page.unit}
          typesLabel={page.typesLabel}
          types={page.types}
          addonsLabel={page.addonsLabel}
          addons={page.addons}
          modifiers={page.modifiers}
          note={page.resultNote}
        />
        {page.tables.map((table) => (
          <DataTable key={table.caption} table={table} />
        ))}
        <Sections sections={page.sections} />
        <FaqList faqs={page.faqs} />
        <ServiceLinks services={page.services} heading="Compare companies and their rates" />
        <QuoteCta service={page.services[0]} text="Share your budget and requirements once. Companies that match your project get in touch with itemised quotes." />
        <MoreGuides kind="tools" current={page.slug} />
      </Container>
    </>
  );
}
