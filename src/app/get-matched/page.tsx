import { ArrowRight, Pencil } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { SignInPrompt } from '@/components/auth/sign-in-prompt';
import { CompanyCard } from '@/components/company/company-card';
import { QuoteForm } from '@/components/forms/quote-form';
import { GetMatchedWizard } from '@/components/home/get-matched-wizard';
import { Reveal } from '@/components/motion/reveal';
import { Container } from '@/components/ui/container';
import { matchedHref } from '@/lib/brief';
import { countryName } from '@/lib/countries';
import { getCompanies, getService, getServiceGroups } from '@/lib/data';
import { BUDGETS, budgetLabel, TIMELINES, timelineLabel } from '@/lib/labels';
import { getCurrentUser } from '@/lib/session';
import { FormSkeleton } from '@/components/skeleton/public';

export const metadata: Metadata = {
  title: 'Get a Free Shortlist of Agencies in India',
  description: 'Answer six short questions about your project and see the software, design and marketing companies in India that fit your budget, timeline and city.',
  alternates: { canonical: '/get-matched' },
};

const COUNTRY = /^[A-Z]{2}$/;
const one = (value: string | string[] | undefined) => (typeof value === 'string' ? value : '');

export default function GetMatchedPage({ searchParams }: PageProps<'/get-matched'>) {
  return (
    <Container className="max-w-5xl py-12 lg:py-16">
      <Suspense fallback={<FormSkeleton className="min-h-[640px]" />}>
        <MatchedContent searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

async function MatchedContent({ searchParams }: Pick<PageProps<'/get-matched'>, 'searchParams'>) {
  const params = await searchParams;
  const groups = await getServiceGroups();
  const service = await getService(one(params.service));
  const country = COUNTRY.test(one(params.country)) ? one(params.country) : '';
  const budget = BUDGETS.some((item) => item.value === one(params.budget)) ? one(params.budget) : '';
  const timeline = TIMELINES.some((item) => item.value === one(params.timeline)) ? one(params.timeline) : '';
  const brief = one(params.brief).slice(0, 1500);

  // No usable brief yet: start the questions here.
  if (!service) {
    return (
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Free shortlist</p>
          <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">
            Six short questions, then your shortlist
          </h1>
          <p className="mt-4 text-lg text-ink-soft">Tell us what you need. We line up the companies that fit, and your brief goes to them only when you are ready.</p>
        </header>
        <GetMatchedWizard groups={groups} tone="light" />
      </div>
    );
  }

  const [user, exact] = await Promise.all([
    getCurrentUser(),
    getCompanies({ service: service.slug, country: country || undefined, sort: 'recommended' }),
  ]);
  // Widen to every location when nobody matches in the chosen country.
  const widened = exact.total === 0 && country ? await getCompanies({ service: service.slug, sort: 'recommended' }) : null;
  const results = widened ?? exact;
  const location = country ? countryName(country) : 'Anywhere in the world';
  const returnTo = matchedHref({ service: service.slug, country, budget, timeline, brief });

  return (
    <>
      <header className="max-w-3xl">
        <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Your matches</p>
        <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">
          {service.name} companies for your project
        </h1>
      </header>

      <Reveal className="mt-8">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface p-4 text-sm shadow-[var(--shadow-card)]">
          {[service.name, location, budget && budgetLabel(budget), timeline && timelineLabel(timeline)].filter(Boolean).map((item) => (
            <span key={item} className="rounded-full bg-accent-tint px-3 py-1 font-medium text-accent-strong">
              {item}
            </span>
          ))}
          <Link href="/get-matched" className="ml-auto inline-flex items-center gap-1.5 font-medium text-accent hover:underline">
            <Pencil className="size-3.5" aria-hidden="true" /> Start over
          </Link>
        </div>
      </Reveal>

      <section aria-labelledby="matches-heading" className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="matches-heading" className="font-display text-2xl font-semibold text-ink">
            {results.total === 0
              ? 'No listed companies offer this service yet'
              : `${results.total} ${results.total === 1 ? 'company offers' : 'companies offer'} ${service.name.toLowerCase()}${widened ? '' : country ? ` in ${location}` : ''}`}
          </h2>
          {results.total > 0 && (
            <Link
              href={`/agencies/${service.slug}${!widened && country ? `?country=${country}` : ''}`}
              className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline"
            >
              See all <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </div>
        {widened && widened.total > 0 && (
          <p className="mt-2 text-ink-soft">None are listed in {location} yet, so here are the best fits from other locations.</p>
        )}
        {results.total === 0 && (
          <p className="mt-2 text-ink-soft">Send your brief anyway. We will share it with companies as they join and review it with you.</p>
        )}
        <div className="mt-6 grid gap-5">
          {results.items.slice(0, 5).map((company, index) => (
            <Reveal key={company.id} delay={index * 70}>
              <CompanyCard company={company} highlightService={service.slug} />
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="send-heading" className="mt-16">
        <h2 id="send-heading" className="font-display text-3xl font-semibold text-ink">
          Send your brief
        </h2>
        <p className="mt-2 max-w-2xl text-ink-soft">
          We share it with companies that fit. They reply to your account email, and you can follow every reply in your dashboard.
        </p>
        <div className="mt-6">
          {user ? (
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-10">
              <QuoteForm
                groups={groups}
                account={{ name: `${user.firstName} ${user.lastName}`, email: user.email }}
                initial={{ serviceSlug: service.slug, budget, timeline, preferredLocation: location, description: brief }}
              />
            </div>
          ) : (
            <SignInPrompt
              title="Log in to send your brief"
              text="Your answers are saved. Log in or create a free account and you will come straight back here."
              returnTo={returnTo}
            />
          )}
        </div>
      </section>
    </>
  );
}
