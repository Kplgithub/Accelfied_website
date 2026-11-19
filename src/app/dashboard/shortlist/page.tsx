import type { Metadata } from 'next';
import { CompanyCard } from '@/components/company/company-card';
import { DashboardHeader } from '@/components/dashboard/bits';
import { Pagination } from '@/components/directory/pagination';
import { ButtonLink } from '@/components/ui/button';
import { ShortlistHowItWorks } from '@/components/vendor/buyer-empty';
import { getMyShortlist } from '@/lib/account-data';
import { pluralize } from '@/lib/format';
import { pageParam } from '@/lib/page-param';

export const metadata: Metadata = { title: 'Shortlist' };

export default async function ShortlistPage({ searchParams }: PageProps<'/dashboard/shortlist'>) {
  const page = pageParam((await searchParams).page);
  const list = await getMyShortlist('/dashboard/shortlist', page);
  return (
    <>
      <DashboardHeader
        eyebrow="Hiring"
        title="Shortlist"
        intro={
          list.total
            ? `${pluralize(list.total, 'company', 'companies')} saved. Compare them here, then message or send a brief to the ones you like.`
            : 'Companies you save while browsing land here, so you can compare them later.'
        }
        action={<ButtonLink href="/agencies" size="sm" variant="secondary">Browse companies</ButtonLink>}
      />
      {list.items.length ? (
        <>
          <div className="grid gap-5">
            {list.items.map((item) => (
              <CompanyCard key={item.company.id} company={item.company} />
            ))}
          </div>
          <Pagination page={list.page} totalPages={list.totalPages} hrefFor={(p) => `/dashboard/shortlist?page=${p}`} />
        </>
      ) : (
<ShortlistHowItWorks />
      )}
    </>
  );
}
