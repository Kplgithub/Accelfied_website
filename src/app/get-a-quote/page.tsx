import type { Metadata } from 'next';
import { Suspense } from 'react';
import { QuoteForm } from '@/components/forms/quote-form';
import { Container } from '@/components/ui/container';
import { getCompany, getServiceGroups } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Get a quote',
  description: 'Describe your project once and hear back from companies that fit your budget and timeline.',
  alternates: { canonical: '/get-a-quote' },
};

export default function GetAQuotePage({ searchParams }: PageProps<'/get-a-quote'>) {
  return (
    <Container className="max-w-5xl py-12 lg:py-16">
      <Suspense fallback={<div className="h-[640px] animate-pulse rounded-[var(--radius-card)] bg-surface" />}>
        <QuoteContent searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

async function QuoteContent({ searchParams }: Pick<PageProps<'/get-a-quote'>, 'searchParams'>) {
  const { company: slug } = await searchParams;
  const [groups, company] = await Promise.all([
    getServiceGroups(),
    typeof slug === 'string' && slug ? getCompany(slug) : Promise.resolve(null),
  ]);
  return (
    <>
      <header className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.16em] text-saffron-ink uppercase">Get a quote</p>
        <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">
          {company ? `Tell ${company.name} about your project` : 'Tell us about your project'}
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          {company
            ? `Your brief goes straight to ${company.name}. They will reply to you by email.`
            : 'Share your brief once. We will match it with companies that fit your budget, timeline and service.'}
        </p>
      </header>
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-10">
        <QuoteForm
          groups={groups}
          company={company ? { slug: company.slug, name: company.name, services: company.services } : undefined}
        />
      </div>
    </>
  );
}
