import type { Metadata } from 'next';
import { Suspense } from 'react';
import { QuoteForm } from '@/components/forms/quote-form';
import { Container } from '@/components/ui/container';
import { SignInPrompt } from '@/components/auth/sign-in-prompt';
import { getCompany, getServiceGroups } from '@/lib/data';
import { getCurrentUser } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Get a Quote',
  description: 'Describe your project once and hear back from agencies that fit your budget and timeline.',
  alternates: { canonical: '/get-a-quote' },
  robots: { index: false, follow: true },
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
  const [groups, company, user] = await Promise.all([
    getServiceGroups(),
    typeof slug === 'string' && slug ? getCompany(slug) : Promise.resolve(null),
    getCurrentUser(),
  ]);
  return (
    <>
      <header className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Get a quote</p>
        <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">
          {company ? `Tell ${company.name} about your project` : 'Tell us about your project'}
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          {company
            ? `Your brief goes straight to ${company.name}. They reply in your Accelfied messages, and we email you when they do.`
            : 'Write your brief once. We pass it to companies that fit your service, budget and timeline, and their replies land in your inbox here.'}
        </p>
      </header>
      {user ? (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-10">
          <QuoteForm
            groups={groups}
            company={company ? { slug: company.slug, name: company.name, services: company.services } : undefined}
            account={{ name: `${user.firstName} ${user.lastName}`, email: user.email }}
          />
        </div>
      ) : (
        <SignInPrompt
          title="Log in to send your brief"
          text="With a free account you can follow every reply and quote in one place."
          returnTo={company ? `/get-a-quote?company=${company.slug}` : '/get-a-quote'}
        />
      )}
    </>
  );
}
