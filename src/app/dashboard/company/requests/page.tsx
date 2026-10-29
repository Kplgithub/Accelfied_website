import type { Metadata } from 'next';
import { DashboardHeader } from '@/components/dashboard/bits';
import { LeadCard } from '@/components/dashboard/lead-card';
import { NoCompany } from '@/components/dashboard/no-company';
import { Pagination } from '@/components/directory/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { getMyCompany, getMyCompanyLeads } from '@/lib/account-data';
import { pageParam } from '@/lib/page-param';

export const metadata: Metadata = { title: 'Project requests' };

const HERE = '/dashboard/company/requests';

export default async function CompanyRequestsPage({ searchParams }: PageProps<'/dashboard/company/requests'>) {
  const company = await getMyCompany(HERE);
  if (!company || company.status === 'rejected') return <NoCompany />;
  const leads = await getMyCompanyLeads(HERE, pageParam((await searchParams).page));
  return (
    <>
      <DashboardHeader eyebrow={company.name} title="Project requests" intro="Briefs clients sent to you from your profile. Reply to them by email or phone." />
      {leads.items.length ? (
        <div className="space-y-4">
          {leads.items.map((lead) => (
            <LeadCard key={lead.id} lead={lead} view="company" />
          ))}
          <Pagination page={leads.page} totalPages={leads.totalPages} hrefFor={(p) => `${HERE}?page=${p}`} />
        </div>
      ) : (
        <EmptyState title="No requests yet">
          {company.status === 'published'
            ? 'When a client sends you a brief from your profile, it appears here and in your inbox.'
            : 'Requests can start once your profile is live.'}
        </EmptyState>
      )}
    </>
  );
}
