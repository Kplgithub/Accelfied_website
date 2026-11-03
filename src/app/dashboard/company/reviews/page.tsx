import type { Metadata } from 'next';
import { DashboardHeader, Panel } from '@/components/dashboard/bits';
import { CopyLink } from '@/components/dashboard/copy-link';
import { MyReviewCard } from '@/components/dashboard/my-review-card';
import { NoCompany } from '@/components/dashboard/no-company';
import { Pagination } from '@/components/directory/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { getMyCompany, getMyCompanyReviews } from '@/lib/account-data';
import { pageParam } from '@/lib/page-param';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = { title: 'Client reviews' };

const HERE = '/dashboard/company/reviews';

export default async function CompanyReviewsPage({ searchParams }: PageProps<'/dashboard/company/reviews'>) {
  const company = await getMyCompany(HERE);
  if (!company || company.status === 'rejected') return <NoCompany />;
  const reviews = await getMyCompanyReviews(HERE, pageParam((await searchParams).page));
  const live = company.status === 'published';
  return (
    <>
      <DashboardHeader eyebrow={company.name} title="Client reviews" intro="Reviews about your company. Our team checks each one before it counts towards your rating." />
      <Panel title="Ask past clients for a review" className="mb-8">
        {live ? (
          <>
            <p className="mb-4 text-ink-soft">Send this link to clients you have worked with. It opens the review form for {company.name}.</p>
            <CopyLink url={`${SITE_URL}/write-a-review?company=${company.slug}`} />
          </>
        ) : (
          <p className="text-ink-soft">Your review link appears here as soon as your profile is live.</p>
        )}
      </Panel>
      {reviews.items.length ? (
        <div className="space-y-4">
          {reviews.items.map((review) => (
            <MyReviewCard key={review.id} review={review} />
          ))}
          <Pagination page={reviews.page} totalPages={reviews.totalPages} hrefFor={(p) => `${HERE}?page=${p}`} />
        </div>
      ) : (
        <EmptyState title="No reviews yet">Your first review usually comes from a client you already know well. Start there.</EmptyState>
      )}
    </>
  );
}
