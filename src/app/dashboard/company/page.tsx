import type { Metadata } from 'next';
import { DashboardHeader, Panel, StatusPill } from '@/components/dashboard/bits';
import { CompanyProfileForm } from '@/components/dashboard/company-profile-form';
import { companySteps, OnboardingSteps } from '@/components/dashboard/onboarding-steps';
import { ButtonLink } from '@/components/ui/button';
import { getMyCompany } from '@/lib/account-data';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = { title: 'Company profile' };

const STATUS_TEXT = {
  pending: 'Verifying your details. Our team checks every new listing, usually within two working days, and emails you when your profile is live.',
  published: 'Your profile is live. Clients can find you, send briefs and review your work.',
  rejected: 'We could not approve this listing. Reply to our email so we can help you fix it.',
  suspended: 'Your profile is paused and hidden from clients. Contact support to restore it.',
} as const;

export default async function CompanyProfilePage() {
  const company = await getMyCompany('/dashboard/company');
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

  return (
    <>
      <DashboardHeader
        eyebrow="My company"
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
      <div className="mb-8 flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
        <StatusPill status={company.status} kind="company" />
        <p className="text-[15px] text-ink-soft">{STATUS_TEXT[company.status]}</p>
      </div>
      {company.status === 'rejected' ? null : (
        <Panel>
          <CompanyProfileForm company={company} />
        </Panel>
      )}
    </>
  );
}
