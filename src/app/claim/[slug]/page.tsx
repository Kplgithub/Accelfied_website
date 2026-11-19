import { BadgeCheck, Building2, MailCheck, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { SignInPrompt } from '@/components/auth/sign-in-prompt';
import { CompanyLogo } from '@/components/company/company-logo';
import { ClaimForm } from '@/components/forms/claim-form';
import { Container } from '@/components/ui/container';
import { getCompany } from '@/lib/data';
import { hostname } from '@/lib/format';
import { getCurrentUser } from '@/lib/session';
import { FormSkeleton } from '@/components/skeleton/public';

export const metadata: Metadata = {
  title: 'Claim a company',
  description: 'Work at a company listed on Accelfied? Claim the listing with your work email and manage it yourself.',
  robots: { index: false },
};

export default function ClaimPage({ params }: PageProps<'/claim/[slug]'>) {
  return (
    <Container className="max-w-5xl py-12 lg:py-16">
      <Suspense fallback={<FormSkeleton className="min-h-[640px]" />}>
        <ClaimContent params={params} />
      </Suspense>
    </Container>
  );
}

async function ClaimContent({ params }: Pick<PageProps<'/claim/[slug]'>, 'params'>) {
  const { slug } = await params;
  const [company, user] = await Promise.all([getCompany(slug), getCurrentUser()]);
  if (!company) notFound();
  const domain = hostname(company.website);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
      <div className="min-w-0">
        <header className="mb-8">
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Claim this company</p>
          <div className="mt-4 flex items-center gap-4">
            <CompanyLogo name={company.name} logoUrl={company.logoUrl} size={56} />
            <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-4xl">Do you work at {company.name}?</h1>
          </div>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            Someone else may have listed your company. Claim it with your work email and, once our team verifies you, the listing moves
            to your account.
          </p>
        </header>
        {user ? (
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-10">
            <ClaimForm company={{ slug: company.slug, name: company.name, domain }} account={{ name: `${user.firstName} ${user.lastName}`, email: user.email }} />
          </div>
        ) : (
          <SignInPrompt
            title="Log in to claim this company"
            text="Use a company account so you can manage the listing once it is yours."
            returnTo={`/claim/${company.slug}`}
            joinAs="provider"
          />
        )}
      </div>
      <aside className="space-y-4 lg:pt-36">
        {[
          { icon: MailCheck, title: 'Work email', text: `Your address at ${domain} shows us you work there.` },
          { icon: ShieldCheck, title: 'Checked by our team', text: 'Every claim is verified by a person before anything changes.' },
          { icon: Building2, title: 'Listing moves to you', text: 'Edit the profile, add work and answer project requests.' },
          { icon: BadgeCheck, title: 'Reviews stay', text: 'Published client reviews stay on the profile.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-3 rounded-2xl border border-line bg-surface p-4">
            <Icon className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <p className="font-medium text-ink">{title}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{text}</p>
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}
