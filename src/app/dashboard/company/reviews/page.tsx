import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { MessageSquareQuote, Send, Star } from 'lucide-react';
import Link from 'next/link';
import { remindReviewer } from '@/app/dashboard-actions';
import { UpgradeStrip } from '@/components/dashboard/upgrade-strip';
import { MyReviewCard } from '@/components/dashboard/my-review-card';
import { NoCompany } from '@/components/dashboard/no-company';
import { Pagination } from '@/components/directory/pagination';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { getMyCompany, getMyCompanyReviews, getMyReviewInvites } from '@/lib/account-data';
import { formatDate } from '@/lib/format';
import type { ReviewInvite } from '@/lib/types';
import { pageParam } from '@/lib/page-param';

export const metadata: Metadata = { title: 'Client reviews' };

const HERE = '/dashboard/company/reviews';
const REQUEST = '/dashboard/company/reviews/request';

type Tab = 'reviews' | 'requests';

export default async function CompanyReviewsPage({ searchParams }: PageProps<'/dashboard/company/reviews'>) {
  const company = await getMyCompany(HERE);
  if (!company || company.status === 'rejected') return <NoCompany />;
  const query = await searchParams;
  const tab: Tab = query.tab === 'requests' ? 'requests' : 'reviews';
  const page = pageParam(query.page);
  const live = company.status === 'published';
  const [reviews, invites] = await Promise.all([
    getMyCompanyReviews(HERE, tab === 'reviews' ? page : 1),
    live ? getMyReviewInvites(HERE, tab === 'requests' ? page : 1) : Promise.resolve(null),
  ]);
  // The list holds published reviews and ones our team is still checking; the published count is the real rating count.
  const published = company.rating.count;
  const inProgress = Math.max(0, reviews.total - published);
  const requestButton = (
    <ButtonLink href={REQUEST} className="gap-2">
      <Send className="size-4" aria-hidden="true" />
      Request a client review
    </ButtonLink>
  );

  return (
    <>
      <UpgradeStrip company={company} />
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Client reviews</p>
          <h1 className="mt-2 font-display text-3xl leading-tight font-semibold tracking-tight break-words text-ink sm:text-4xl">Welcome, {company.name}</h1>
          <p className="mt-2 max-w-2xl text-ink-soft">Reviews from your clients. Our team checks each one before it counts towards your rating.</p>
        </div>
        {live && <div className="shrink-0">{requestButton}</div>}
      </header>

      <section aria-label="Review summary" className="mb-8 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-card)]">
        <dl className="grid grid-cols-3 divide-x divide-line">
          <Summary label="Reviews" value={published} note="Published on your profile" />
          <Summary label="In progress" value={inProgress} note="Being checked by our team" />
          <Summary
            label="Average rating"
            value={
              published > 0 ? (
                <span className="inline-flex items-center gap-1.5">
                  {company.rating.average.toFixed(1)}
                  <Star className="size-5 fill-saffron text-saffron" aria-hidden="true" />
                </span>
              ) : (
                '–'
              )
            }
            note={published > 0 ? `From ${published} ${published === 1 ? 'review' : 'reviews'}` : 'No published reviews yet'}
          />
        </dl>
        <nav aria-label="Reviews" className="flex gap-1 border-t border-line px-3 sm:px-5">
          <TabLink href={HERE} active={tab === 'reviews'} label="All reviews" count={reviews.total} />
          <TabLink href={`${HERE}?tab=requests`} active={tab === 'requests'} label="Review requests" count={invites?.total ?? 0} />
        </nav>
      </section>

      {tab === 'reviews' ? (
        reviews.items.length ? (
          <div className="space-y-4">
            {reviews.items.map((review) => (
              <MyReviewCard key={review.id} review={review} />
            ))}
            <Pagination page={reviews.page} totalPages={reviews.totalPages} hrefFor={(p) => `${HERE}?page=${p}`} />
          </div>
        ) : (
          <EmptyState title="No reviews yet" action={live ? requestButton : undefined}>
            {live
              ? 'Your first review usually comes from a client you know well. Send them a request, it takes them about ten minutes.'
              : 'You can request reviews as soon as your profile is live.'}
          </EmptyState>
        )
      ) : invites && invites.items.length ? (
        <div className="space-y-4">
          <InviteList invites={invites.items} />
          <Pagination page={invites.page} totalPages={invites.totalPages} hrefFor={(p) => `${HERE}?tab=requests&page=${p}`} />
        </div>
      ) : (
        <EmptyState title="No review requests yet" action={live ? requestButton : undefined}>
          {live ? 'Requests you send to clients show here, with who has written their review.' : 'You can request reviews as soon as your profile is live.'}
        </EmptyState>
      )}
    </>
  );
}

function Summary({ label, value, note }: { label: string; value: ReactNode; note: string }) {
  return (
    <div className="min-w-0 px-3 py-4 sm:px-6 sm:py-5">
      <dt className="text-[13px] text-ink-soft sm:text-sm">{label}</dt>
      <dd className="mt-1 font-display text-2xl font-semibold text-ink tabular-nums sm:text-3xl">{value}</dd>
      <dd className="mt-0.5 hidden text-[13px] text-ink-faint sm:block">{note}</dd>
    </div>
  );
}

function TabLink({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`relative inline-flex items-center gap-2 px-3 py-3.5 text-[15px] font-medium transition-colors ${
        active ? 'text-ink after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand' : 'text-ink-soft hover:text-ink'
      }`}
    >
      {label}
      <span className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${active ? 'bg-brand-tint text-brand' : 'bg-paper-deep text-ink-soft'}`}>{count}</span>
    </Link>
  );
}

function InviteList({ invites }: { invites: ReviewInvite[] }) {
  const now = new Date().toISOString();
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-card)]">
      {invites.map((invite) => {
        const canRemind = invite.status === 'sent' && invite.canResendAt !== null && invite.canResendAt <= now;
        return (
          <li key={invite.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent">
                <MessageSquareQuote className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{invite.name}</p>
                <p className="truncate text-[13px] text-ink-soft">
                  {invite.email} · last sent {formatDate(invite.sentAt)}
                  {invite.sendCount > 1 && ` · ${invite.sendCount} emails`}
                </p>
              </div>
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
              <span className="rounded-full bg-saffron-tint px-2.5 py-1 text-xs font-medium text-saffron-ink">
                {invite.canResendAt ? `Waiting · reminder from ${formatDate(invite.canResendAt)}` : 'Waiting for their review'}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
