import Link from 'next/link';
import { formatDate } from '@/lib/format';
import type { AuthoredReview, OwnedReview } from '@/lib/types';
import { Stars } from '../ui/stars';
import { StatusPill } from './bits';

/** Compact review row for dashboards, with its moderation status. */
export function MyReviewCard({ review }: { review: OwnedReview | AuthoredReview }) {
  const company = 'company' in review ? review.company : null;
  return (
    <article className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-ink">{review.project.title}</p>
          <p className="text-sm text-ink-soft">
            {company ? (
              company.published ? (
                <Link href={`/profile/${company.slug}`} className="font-medium text-accent underline-offset-4 hover:underline">
                  {company.name}
                </Link>
              ) : (
                company.name
              )
            ) : (
              <>
                {review.reviewer.name ?? 'Name withheld'}, {review.reviewer.jobTitle}
                {review.reviewer.companyName && ` at ${review.reviewer.companyName}`}
              </>
            )}
            {' · '}
            {review.project.serviceName}
          </p>
        </div>
        <StatusPill status={review.status} kind="review" />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Stars value={review.ratings.overall} />
        <span className="text-sm font-medium text-ink">{review.ratings.overall.toFixed(1)}</span>
      </div>
      <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-ink-soft">{review.content.results}</p>
      <p className="mt-3 text-[13px] text-ink-faint">
        Submitted {formatDate(review.submittedAt)}
        {review.publishedAt && ` · Published ${formatDate(review.publishedAt)}`}
      </p>
    </article>
  );
}
