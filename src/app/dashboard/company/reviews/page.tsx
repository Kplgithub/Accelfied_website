import type { Metadata } from 'next';
import { remindReviewer } from '@/app/dashboard-actions';
import { UpgradeStrip } from '@/components/dashboard/upgrade-strip';
import { DashboardHeader, Panel } from '@/components/dashboard/bits';
import { CopyLink } from '@/components/dashboard/copy-link';
import { MyReviewCard } from '@/components/dashboard/my-review-card';
import { ReviewInviteForm } from '@/components/dashboard/review-invites';
import { NoCompany } from '@/components/dashboard/no-company';
import { Pagination } from '@/components/directory/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { getMyCompany, getMyCompanyReviews, getMyReviewInvites } from '@/lib/account-data';
import { formatDate } from '@/lib/format';
import type { ReviewInvite } from '@/lib/types';
import { pageParam } from '@/lib/page-param';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = { title: 'Client reviews' };

const HERE = '/dashboard/company/reviews';

export default async function CompanyReviewsPage({ searchParams }: PageProps<'/dashboard/company/reviews'>) {
  const company = await getMyCompany(HERE);
  if (!company || company.status === 'rejected') return <NoCompany />;
  const live = company.status === 'published';
  const [reviews, invites] = await Promise.all([
    getMyCompanyReviews(HERE, pageParam((await searchParams).page)),
    live ? getMyReviewInvites(HERE) : Promise.resolve(null),
  ]);
  return (
    <>
      <DashboardHeader eyebrow={company.name} title="Client reviews" intro="Reviews about your company. Our team checks each one before it counts towards your rating." />
      <UpgradeStrip company={company} />
      <Panel title="Ask past clients for a review" className="mb-8">
        {live ? (
          <>
            <p className="mb-5 text-ink-soft">We email your client a link to the review form, and remind you who has not written yet.</p>
            <ReviewInviteForm companyName={company.name} />
            {invites && invites.items.length > 0 && <InviteList invites={invites.items} />}
            <div className="mt-8 border-t border-line pt-6">
              <p className="mb-4 text-ink-soft">Or share this link yourself. It opens the review form for {company.name}.</p>
              <CopyLink url={`${SITE_URL}/write-a-review?company=${company.slug}`} />
            </div>
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

function InviteList({ invites }: { invites: ReviewInvite[] }) {
  return (
    <div className="mt-8">
      <h3 className="mb-3 text-sm font-semibold text-ink">Invites sent</h3>
      <ul className="divide-y divide-line rounded-2xl border border-line">
        {invites.map((invite) => {
          const canRemind = invite.status === 'sent' && invite.canResendAt !== null && invite.canResendAt <= new Date().toISOString();
          return (
            <li key={invite.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{invite.name}</p>
                <p className="truncate text-[13px] text-ink-soft">
                  {invite.email} · last sent {formatDate(invite.sentAt)}
                  {invite.sendCount > 1 && ` · ${invite.sendCount} emails`}
                </p>
              </div>
              {invite.status === 'reviewed' ? (
                <span className="rounded-full bg-accent-tint px-2.5 py-1 text-xs font-medium text-accent">Reviewed</span>
              ) : canRemind ? (
                <form action={remindReviewer}>
                  <input type="hidden" name="name" value={invite.name} />
                  <input type="hidden" name="email" value={invite.email} />
                  <button type="submit" className="cursor-pointer text-sm font-medium text-accent underline-offset-4 hover:underline">
                    Send a reminder
                  </button>
                </form>
              ) : (
                <span className="text-[13px] text-ink-faint">
                  {invite.canResendAt ? `Reminder possible from ${formatDate(invite.canResendAt)}` : 'Waiting for their review'}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
