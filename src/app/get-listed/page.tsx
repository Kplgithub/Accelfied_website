import { BadgeCheck, MessageSquareQuote, Search } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SignInPrompt } from '@/components/auth/sign-in-prompt';
import { ListingForm } from '@/components/forms/listing-form';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { getMyCompany } from '@/lib/account-data';
import { getServiceGroups } from '@/lib/data';
import { getCurrentUser } from '@/lib/session';

export const metadata: Metadata = {
  title: 'List your company',
  description: 'Create a free Accelfied profile, collect reviews from past clients and get found by people ready to hire.',
  alternates: { canonical: '/get-listed' },
};

export default function GetListedPage() {
  return (
    <>
      <section className="grain border-b border-line">
        <Container className="grid gap-10 py-14 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:py-20">
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">For companies</p>
            <h1 className="mt-3 font-display text-5xl leading-[1.05] font-semibold tracking-tight text-ink sm:text-6xl">
              Let your <span className="scribble italic">clients</span> do the selling.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-soft">
              A free profile puts your work, rates and real client reviews in front of buyers comparing partners right now.
            </p>
          </div>
          <ul className="grid gap-4">
            {[
              { icon: Search, title: 'Get found', text: 'Appear in every service and location you actually cover.' },
              { icon: MessageSquareQuote, title: 'Collect reviews', text: 'Invite past clients to share detailed, verified feedback.' },
              { icon: BadgeCheck, title: 'Win on trust', text: 'Your rating comes only from real clients, so it means something.' },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
                <Icon className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <p className="font-medium text-ink">{title}</p>
                  <p className="text-sm text-ink-soft">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <Container className="max-w-5xl py-12 lg:py-16">
        <Suspense fallback={<div className="h-[640px] animate-pulse rounded-[var(--radius-card)] bg-surface" />}>
          <ListingContent />
        </Suspense>
      </Container>
    </>
  );
}

async function ListingContent() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <SignInPrompt
        title="Create an account to list your company"
        text="Your account manages the listing: edit the profile, see project requests and invite clients to review you."
        returnTo="/get-listed"
        joinAs="provider"
      />
    );
  }

  const [groups, existing] = await Promise.all([getServiceGroups(), getMyCompany('/get-listed')]);
  if (existing && existing.status !== 'rejected') {
    return (
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 text-center shadow-[var(--shadow-card)] sm:p-12">
        <h2 className="font-display text-3xl font-semibold text-ink">You already manage {existing.name}</h2>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">Each account manages one company. Update its profile from your dashboard.</p>
        <div className="mt-8">
          <ButtonLink href="/dashboard/company">Open company dashboard</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-10">
      <ListingForm groups={groups} account={{ email: user.email }} />
    </div>
  );
}
