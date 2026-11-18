import type { Metadata } from 'next';
import { DashboardHeader } from '@/components/dashboard/bits';
import { LeadCard } from '@/components/dashboard/lead-card';
import { Pagination } from '@/components/directory/pagination';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { getMyLeads } from '@/lib/account-data';
import { pageParam } from '@/lib/page-param';

export const metadata: Metadata = { title: 'My briefs' };

export default async function MyBriefsPage({ searchParams }: PageProps<'/dashboard/requests'>) {
  const page = pageParam((await searchParams).page);
  const leads = await getMyLeads('/dashboard/requests', page);
  return (
    <>
      <DashboardHeader
        eyebrow="Hiring"
        title="My briefs"
        intro="Every project brief you have sent. Companies reply in Messages, and we email you when they do."
        action={<ButtonLink href="/get-a-quote" size="sm">New brief</ButtonLink>}
      />
      {leads.items.length ? (
        <div className="space-y-4">
          {leads.items.map((lead) => (
            <LeadCard key={lead.id} lead={lead} view="client" />
          ))}
          <Pagination page={leads.page} totalPages={leads.totalPages} hrefFor={(p) => `/dashboard/requests?page=${p}`} />
        </div>
      ) : (
        <EmptyState title="No briefs yet" action={<ButtonLink href="/get-a-quote">Send your first brief</ButtonLink>}>
          Describe your project once and hear back from companies that fit.
        </EmptyState>
      )}
    </>
  );
}
