import { ArrowRight, FileText, Search } from 'lucide-react';
import { ClientProgress, type ClientStep } from '@/components/dashboard/client-progress';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { DashboardHeader, Panel, StatTile, StatusPill } from '@/components/dashboard/bits';
import { VerifyEmailBanner } from '@/components/dashboard/verify-email-banner';
import { ClaimCodeForm } from '@/components/auth/code-forms';
import { LeadCard } from '@/components/dashboard/lead-card';
import { companySteps, OnboardingSteps } from '@/components/dashboard/onboarding-steps';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { getMyClaims, getMyCompany, getMyCompanyAnalytics, getMyCompanyDetails, getMyCompanyLeads, getMyConversations, getMyLeads, getMyReviews, getMyBriefs, getMyShortlist } from '@/lib/account-data';
import { CompanyHome } from '@/components/dashboard/company-home';
import { profileHealth } from '@/lib/profile-health';
import { formatDate, formatRating } from '@/lib/format';
import { requireUser } from '@/lib/session';
import { getMyCertifications, getMyWorkspace } from '@/lib/vendor-tools';
import { testOtpEnabled } from '@/lib/test-otp';
import type { Account, CompanyClaim, OwnedCompany } from '@/lib/types';

export const metadata: Metadata = { title: 'Overview' };

const HERE = '/dashboard';

export default async function DashboardPage() {
  const { user } = await requireUser(HERE);
  const company = await getMyCompany(HERE);
  const claims = await getMyClaims(HERE);
  // Test mode: confirmation codes are typed here, since no email arrives.
  const codeEntry = (!user.emailVerified || claims.some((claim) => claim.status === 'unconfirmed')) && (await testOtpEnabled());
  return (
    <>
      {!user.emailVerified && <VerifyEmailBanner email={user.email} codeEntry={codeEntry} />}
      {user.accountType === 'provider' || company ? <CompanyOverview user={user} company={company} /> : <ClientOverview user={user} />}
      {claims.length > 0 && <ClaimsPanel claims={claims} codeEntry={codeEntry} />}
    </>
  );
}

function ClaimsPanel({ claims, codeEntry }: { claims: CompanyClaim[]; codeEntry: boolean }) {
  return (
    <Panel title="Company claims" className="mt-8">
      <ul className="divide-y divide-line">
        {claims.map((claim) => (
          <li key={claim.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="font-medium text-ink">
                {claim.company ? (
                  <Link href={`/profile/${claim.company.slug}`} className="hover:text-accent">
                    {claim.company.name}
                  </Link>
                ) : (
                  'Company no longer listed'
                )}
              </p>
              <p className="text-sm text-ink-soft">
                Sent {formatDate(claim.createdAt)} from {claim.workEmail}
                {claim.status === 'rejected' && claim.reviewNote ? `. ${claim.reviewNote}` : ''}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {codeEntry && claim.status === 'unconfirmed' && <ClaimCodeForm claimId={claim.id} />}
              <StatusPill status={claim.status} kind="claim" />
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

async function CompanyOverview({ user, company }: { user: Account; company: OwnedCompany | null }) {
  const active = company && company.status !== 'rejected';
  const [leads, data, analytics, workspace, certifications] = active
    ? await Promise.all([
        getMyCompanyLeads(HERE),
        getMyCompanyDetails(HERE).catch(() => null),
        company.status === 'published' ? getMyCompanyAnalytics(HERE, 90).catch(() => null) : Promise.resolve(null),
        getMyWorkspace(HERE).catch(() => null),
        getMyCertifications(HERE).catch(() => null),
      ])
    : [null, null, null, null, null];
  const steps = companySteps(company);
  const setupDone = steps.every((step) => step.done);
  const health = company && data ? profileHealth(company, data.details) : null;
  return (
    <>
      <DashboardHeader
        eyebrow={company ? company.name : 'Company account'}
        title={`Welcome back, ${user.firstName}`}
        intro={
          company ? (
            <span className="inline-flex flex-wrap items-center gap-2">
              <StatusPill status={company.status} kind="company" />
              Here is how your listing is doing.
            </span>
          ) : (
            'A few steps and your company will be ready for clients.'
          )
        }
        action={
          company?.status === 'published' ? (
            <ButtonLink href={`/profile/${company.slug}`} variant="secondary" size="sm">
              View public profile
            </ButtonLink>
          ) : undefined
        }
      />
      {company && !health && (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatTile label="Listing" value={<StatusPill status={company.status} kind="company" />} />
          <StatTile
            label="Client rating"
            value={company.rating.count > 0 ? formatRating(company.rating.average) : '–'}
            note={company.rating.count > 0 ? `From ${company.rating.count} published ${company.rating.count === 1 ? 'review' : 'reviews'}` : 'No published reviews yet'}
          />
          <StatTile label="Project requests" value={leads?.total ?? 0} note="Sent to you directly" />
        </div>
      )}
      {!setupDone && company?.status !== 'published' && (
        <Panel title="Set up your listing" className="mb-8">
          <OnboardingSteps steps={steps} />
        </Panel>
      )}
      {company && health && data && (
        <div className="mb-8">
          <CompanyHome
            company={company}
            health={health}
            analytics={analytics}
            hasPackages={data.details.packages.some((item) => item.status === 'published')}
            skippedTasks={workspace?.skippedTasks ?? []}
            certifications={certifications}
          />
        </div>
      )}
      {leads && (
        <Panel title="Latest project requests">
          {leads.items.length ? (
            <div className="space-y-4">
              {leads.items.slice(0, 3).map((lead) => (
                <LeadCard key={lead.id} lead={lead} view="company" />
              ))}
              {leads.total > 3 && (
                <Link href="/dashboard/company/requests" className="inline-block text-sm font-medium text-accent underline-offset-4 hover:underline">
                  See all {leads.total} requests
                </Link>
              )}
            </div>
          ) : (
            <p className="text-ink-soft">No requests yet. Clients can send you a brief from your profile once it is live.</p>
          )}
        </Panel>
      )}
    </>
  );
}

async function ClientOverview({ user }: { user: Account }) {
  const [leads, reviews, briefs, shortlist, conversations] = await Promise.all([
    getMyLeads(HERE),
    getMyReviews(HERE),
    getMyBriefs(HERE).catch(() => []),
    getMyShortlist(HERE).catch(() => null),
    getMyConversations(HERE, 'client').catch(() => null),
  ]);
  const steps: ClientStep[] = [
    { title: 'Start your project by writing a brief', done: briefs.length > 0, href: '/project-brief', cta: 'Start' },
    { title: 'Add companies to your shortlist', done: (shortlist?.total ?? 0) > 0, href: '/agencies', cta: 'Browse' },
    { title: 'Send your brief to companies', done: briefs.some((brief) => brief.status === 'sent') || leads.total > 0, href: briefs[0] ? `/dashboard/briefs/${briefs[0].id}#more` : '/project-brief', cta: 'Send' },
    { title: 'Talk to companies in Messages', done: (conversations?.total ?? 0) > 0, href: '/dashboard/messages', cta: 'Open' },
    { title: 'Review the company you worked with', done: reviews.total > 0, href: '/write-a-review', cta: 'Write' },
  ];
  return (
    <>
      <DashboardHeader eyebrow="Your account" title={`Welcome back, ${user.firstName}`} intro="Find, compare and hire the right company, all in one place." />
      <section className="relative mb-8 overflow-hidden rounded-[var(--radius-card)] bg-night p-6 text-paper shadow-[var(--shadow-lift)] sm:p-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-full md:w-3/5" aria-hidden="true">
          <Image src="/images/pages/client.webp" alt="" fill sizes="(min-width: 768px) 480px, 100vw" className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-night/40 via-night/70 to-night" />
        </div>
        <div className="pointer-events-none absolute -right-16 -bottom-24 size-72 rounded-full bg-accent/30 blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-accent-soft uppercase">Get started</p>
            <h2 className="mt-2 font-display text-3xl leading-tight font-semibold">Let’s find the right team for your project</h2>
          </div>
          <ul className="space-y-3">
            {[
              { href: '/project-brief', icon: FileText, title: 'Tell us what you need, get quotes', text: 'Seven quick questions. We write the brief for you.' },
              { href: '/agencies', icon: Search, title: 'Browse companies yourself', text: 'Compare by reviews, price and city.' },
            ].map(({ href, icon: Icon, title, text }) => (
              <li key={href}>
                <Link href={href} className="group flex items-center gap-4 rounded-2xl bg-white/8 p-4 ring-1 ring-white/10 transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-white/14">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Icon className="size-5 text-accent-soft" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{title}</span>
                    <span className="block text-sm text-paper/65">{text}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="mb-8">
        <ClientProgress steps={steps} />
      </div>
      <Panel title="My projects" className="mb-8">
        {briefs.length ? (
          <ul className="divide-y divide-line">
            {briefs.slice(0, 3).map((brief) => (
              <li key={brief.id}>
                <Link href={`/dashboard/briefs/${brief.id}`} className="group flex items-center justify-between gap-4 py-3">
                  <span>
                    <span className="block font-medium text-ink group-hover:text-accent">{brief.serviceName}</span>
                    <span className="block text-sm text-ink-soft">
                      {formatDate(brief.createdAt)}
                      {brief.sentCount > 0 ? ` · sent to ${brief.sentCount}` : ' · draft'}
                    </span>
                  </span>
                  <StatusPill status={brief.status} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Build a project brief in minutes" action={<ButtonLink href="/project-brief">Start a project</ButtonLink>}>
            Describe what you need once. We write a clear brief and send it to companies that fit.
          </EmptyState>
        )}
      </Panel>
      {leads.items.length > 0 && (
        <Panel title="Quotes sent">
          <div className="space-y-4">
            {leads.items.slice(0, 3).map((lead) => (
              <LeadCard key={lead.id} lead={lead} view="client" />
            ))}
            {leads.total > 3 && (
              <Link href="/dashboard/requests" className="inline-block text-sm font-medium text-accent underline-offset-4 hover:underline">
                See all {leads.total}
              </Link>
            )}
          </div>
        </Panel>
      )}
    </>
  );
}
