import { ArrowUpRight, Check, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { UpgradeStrip } from '@/components/dashboard/upgrade-strip';
import { DashboardHeader, Panel, StatusPill } from '@/components/dashboard/bits';
import { CompanyProfileForm } from '@/components/dashboard/company-profile-form';
import { companySteps, OnboardingSteps } from '@/components/dashboard/onboarding-steps';
import { AwardsForm } from '@/components/dashboard/sections/awards-form';
import { BasicsForm } from '@/components/dashboard/sections/basics-form';
import { ClientFocusForm } from '@/components/dashboard/sections/client-focus-form';
import { IndustriesForm } from '@/components/dashboard/sections/industries-form';
import { LocationsForm } from '@/components/dashboard/sections/locations-form';
import { ServicesForm } from '@/components/dashboard/sections/services-form';
import { ButtonLink } from '@/components/ui/button';
import { getMyCompany, getMyCompanyDetails } from '@/lib/account-data';
import { getServiceGroups } from '@/lib/data';
import { formatDate } from '@/lib/format';
import { profileSections, type SectionKey } from '@/lib/profile-health';

export const metadata: Metadata = { title: 'Edit profile' };

const HERE = '/dashboard/company';

const STATUS_TEXT = {
  pending: 'Verifying your details. Our team checks every new listing, usually within two working days, and emails you when your profile is live.',
  published: 'Your profile is live. Clients can find you, send briefs and review your work.',
  rejected: 'We could not approve this listing. Reply to our email so we can help you fix it.',
  suspended: 'Your profile is paused and hidden from clients. Contact support to restore it.',
} as const;

const INTRO: Partial<Record<SectionKey, string>> = {
  company: 'Help clients understand what you do. Profiles with a logo, tagline and full description get more views.',
  basics: 'Your team size, rate and minimum project size decide which searches you show up in.',
  services: 'Split your work across your services. Each one adds you to that service’s directory pages.',
  industries: 'The industries you know best. Clients in those industries see you first.',
  clients: 'The size of companies you usually work with, and clients who agreed to be named.',
  locations: 'Every office you add puts you on that city’s page.',
  social: 'Clients check your social pages before they get in touch.',
  awards: 'Awards, rankings and certifications your company has earned.',
};

export default async function EditProfilePage({ searchParams }: PageProps<'/dashboard/company'>) {
  const requested = (await searchParams).section;
  const company = await getMyCompany(HERE);
  if (!company) {
    return (
      <>
        <DashboardHeader eyebrow="My company" title="List your company" intro="A few short steps between you and your first client review." />
        <Panel>
          <OnboardingSteps steps={companySteps(null)} />
        </Panel>
      </>
    );
  }

  const header = (
    <DashboardHeader
      eyebrow="Edit profile"
      title={company.name}
      intro={`Listed since ${formatDate(company.createdAt)}`}
      action={
        company.status === 'published' ? (
          <ButtonLink href={`/profile/${company.slug}`} variant="secondary" size="sm">
            View public profile
          </ButtonLink>
        ) : undefined
      }
    />
  );
  const upgrade = <UpgradeStrip company={company} />;
  const status = (
    <div className="mb-8 flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
      <StatusPill status={company.status} kind="company" />
      <p className="text-[15px] text-ink-soft">{STATUS_TEXT[company.status]}</p>
    </div>
  );
  if (company.status === 'rejected') return (<>{header}{status}</>);

  const [data, groups] = await Promise.all([getMyCompanyDetails(HERE), getServiceGroups()]);
  if (!data) return (<>{header}{upgrade}{status}</>);
  const { details } = data;
  const sections = profileSections(company, details);
  const inline = sections.filter((section) => section.href.startsWith(`${HERE}?`));
  const active = inline.find((section) => section.key === requested) ?? inline[0]!;
  const doneCount = sections.filter((section) => section.done).length;

  return (
    <>
      {header}
      {upgrade}
      {company.status !== 'published' && status}
      <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-32 xl:self-start">
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between gap-2 px-2 pb-3">
              <p className="font-display text-lg font-semibold text-ink">Sections</p>
              {company.status === 'published' && (
                <Link href={`/profile/${company.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                  Preview <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Link>
              )}
            </div>
            <p className="px-2 pb-3 text-sm text-ink-soft tabular-nums">
              {doneCount} of {sections.length} complete
            </p>
            <div className="mx-2 mb-3 h-1.5 overflow-hidden rounded-full bg-paper-deep">
              <div className="h-full rounded-full bg-gradient-to-r from-accent to-success transition-[width] duration-700" style={{ width: `${(doneCount / sections.length) * 100}%` }} />
            </div>
            <nav aria-label="Profile sections">
              <ul className="space-y-0.5">
                {sections.map((section) => {
                  const current = section.key === active.key;
                  return (
                    <li key={section.key}>
                      <Link
                        href={section.href}
                        aria-current={current ? 'page' : undefined}
                        className={`group flex items-center gap-3 rounded-xl px-2 py-2 text-[15px] transition-colors ${current ? 'bg-accent-tint font-medium text-ink' : 'text-ink-soft hover:bg-ink/5 hover:text-ink'}`}
                      >
                        <span
                          className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${section.done ? 'border-success bg-success text-white' : 'border-line-strong bg-surface'}`}
                          aria-label={section.done ? 'Complete' : 'Not complete'}
                        >
                          {section.done && <Check className="size-3" strokeWidth={3} aria-hidden="true" />}
                        </span>
                        <span className="min-w-0 flex-1 truncate">{section.title}</span>
                        <ChevronRight className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </aside>
        <Panel key={active.key} className="animate-rise">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-semibold text-ink">{active.title}</h2>
            {INTRO[active.key] && <p className="mt-1.5 max-w-2xl text-ink-soft">{INTRO[active.key]}</p>}
          </div>
          {active.key === 'company' && <CompanyProfileForm company={company} parts={['info', 'contact']} />}
          {active.key === 'basics' && <BasicsForm company={company} />}
          {active.key === 'services' && <ServicesForm company={company} groups={groups} />}
          {active.key === 'industries' && <IndustriesForm industries={company.industries} />}
          {active.key === 'clients' && (
            <div className="space-y-10">
              <ClientFocusForm focus={details.clientFocus} />
              <CompanyProfileForm company={company} parts={['clients']} />
            </div>
          )}
          {active.key === 'locations' && <LocationsForm company={company} />}
          {active.key === 'social' && <CompanyProfileForm company={company} parts={['social']} />}
          {active.key === 'awards' && <AwardsForm awards={details.awards} />}
        </Panel>
      </div>
    </>
  );
}
