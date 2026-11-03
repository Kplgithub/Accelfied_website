import type { Metadata } from 'next';
import { DashboardHeader } from '@/components/dashboard/bits';
import { MyReviewCard } from '@/components/dashboard/my-review-card';
import { Pagination } from '@/components/directory/pagination';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { getMyReviews } from '@/lib/account-data';
import { pageParam } from '@/lib/page-param';

export const metadata: Metadata = { title: 'My reviews' };

export default async function MyReviewsPage({ searchParams }: PageProps<'/dashboard/reviews'>) {
  const page = pageParam((await searchParams).page);
  const reviews = await getMyReviews('/dashboard/reviews', page);
  return (
    <>
      <DashboardHeader
        eyebrow="Hiring"
        title="My reviews"
        intro="Reviews you have written. Each one is checked by our team before it goes live."
        action={<ButtonLink href="/write-a-review" size="sm">Write a review</ButtonLink>}
      />
      {reviews.items.length ? (
        <div className="space-y-4">
          {reviews.items.map((review) => (
            <MyReviewCard key={review.id} review={review} />
          ))}
          <Pagination page={reviews.page} totalPages={reviews.totalPages} hrefFor={(p) => `/dashboard/reviews?page=${p}`} />
        </div>
      ) : (
        <EmptyState title="No reviews yet" action={<ButtonLink href="/write-a-review">Review a company</ButtonLink>}>
          Worked with a listed company? Your review helps the next client choose well.
        </EmptyState>
      )}
    </>
  );
}
