import { FileText, PenLine, Search } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DashboardHeader, Panel, StatTile, StatusPill } from '@/components/dashboard/bits';
import { LeadCard } from '@/components/dashboard/lead-card';
import { companySteps, OnboardingSteps } from '@/components/dashboard/onboarding-steps';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { getMyCompany, getMyCompanyLeads, getMyLeads, getMyReviews } from '@/lib/account-data';
import { formatRating } from '@/lib/format';
import { requireUser } from '@/lib/session';
import type { Account, OwnedCompany } from '@/lib/types';

export const metadata: Metadata = { title: 'Overview' };

const HERE = '/dashboard';

export default async function DashboardPage() {
  const { user } = await requireUser(HERE);
  const company = await getMyCompany(HERE);
  if (user.accountType === 'provider' || company) return <CompanyOverview user={user} company={company} />;
  return <ClientOverview user={user} />;
}

async function CompanyOverview({ user, company }: { user: Account; company: OwnedCompany | null }) {
  const leads = company && company.status !== 'rejected' ? await getMyCompanyLeads(HERE) : null;
  const steps = companySteps(company);
  const setupDone = steps.every((step) => step.done);
  return (
    <>
      <DashboardHeader
        eyebrow={company ? company.name : 'Company account'}
        title={`Hello, ${user.firstName}`}
        intro={company ? 'Here is how your listing is doing.' : 'A few steps and your company will be ready for clients.'}
        action={
          company?.status === 'published' ? (
            <ButtonLink href={`/profile/${company.slug}`} variant="secondary" size="sm">
              View public profile
            </ButtonLink>
          ) : undefined
        }
      />
      {company && (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatTile label="Listing" value={<StatusPill status={company.status} />} />
          <StatTile
            label="Client rating"
            value={company.rating.count > 0 ? formatRating(company.rating.average) : '–'}
            note={company.rating.count > 0 ? `From ${company.rating.count} published ${company.rating.count === 1 ? 'review' : 'reviews'}` : 'No published reviews yet'}
          />
          <StatTile label="Project requests" value={leads?.total ?? 0} note="Sent to you directly" />
        </div>
      )}
      {!setupDone && (
        <Panel title="Set up your listing" className="mb-8">
          <OnboardingSteps steps={steps} />
        </Panel>
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
  const [leads, reviews] = await Promise.all([getMyLeads(HERE), getMyReviews(HERE)]);
  const actions = [
    { href: '/agencies', icon: Search, title: 'Find a company', text: 'Compare by rating, rate and location.' },
    { href: '/get-a-quote', icon: FileText, title: 'Send a brief', text: 'Describe your project once.' },
    { href: '/write-a-review', icon: PenLine, title: 'Write a review', text: 'Help the next client choose.' },
  ];
  return (
    <>
      <DashboardHeader eyebrow="Your account" title={`Hello, ${user.firstName}`} intro="Everything you have sent and shared on Accelfied, in one place." />
      <ul className="mb-8 grid gap-4 sm:grid-cols-3">
        {actions.map(({ href, icon: Icon, title, text }) => (
          <li key={href}>
            <Link href={href} className="group block h-full rounded-2xl border border-line bg-surface p-5 transition-[border-color,box-shadow] hover:border-accent hover:shadow-[var(--shadow-card)]">
              <Icon className="size-5 text-accent" aria-hidden="true" />
              <p className="mt-3 font-medium text-ink">{title}</p>
              <p className="text-sm text-ink-soft">{text}</p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatTile label="Briefs sent" value={leads.total} />
        <StatTile label="Reviews written" value={reviews.total} />
      </div>
      <Panel title="Recent briefs">
        {leads.items.length ? (
          <div className="space-y-4">
            {leads.items.slice(0, 3).map((lead) => (
              <LeadCard key={lead.id} lead={lead} view="client" />
            ))}
            {leads.total > 3 && (
              <Link href="/dashboard/requests" className="inline-block text-sm font-medium text-accent underline-offset-4 hover:underline">
                See all {leads.total} briefs
              </Link>
            )}
          </div>
        ) : (
          <EmptyState title="No briefs yet" action={<ButtonLink href="/get-a-quote">Send your first brief</ButtonLink>}>
            Tell companies what you need and compare their replies.
          </EmptyState>
        )}
      </Panel>
    </>
  );
}
