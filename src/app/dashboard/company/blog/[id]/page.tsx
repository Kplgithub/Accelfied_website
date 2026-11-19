import { ArrowLeft, CheckCircle2, Clock, ExternalLink, Hourglass, MessageSquareWarning } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { deleteCompanyPost, resubmitCompanyPost, saveCompanyPost, startPostCheckout } from '@/app/company-post-actions';
import { Markdown } from '@/components/blog/markdown';
import { PostCheckout } from '@/components/company-posts/post-checkout';
import { CurrencySwitch } from '@/components/dashboard/currency-switch';
import { CompanyPostForm } from '@/components/company-posts/post-form';
import { DashboardHeader, Panel } from '@/components/dashboard/bits';
import { Button } from '@/components/ui/button';
import { MIN_WORDS, POST_STATUS } from '@/lib/company-posts';
import { getMyCompanyPost, getMyCompanyPosts } from '@/lib/company-posts-data';
import { formatDate } from '@/lib/format';
import { requireUser } from '@/lib/session';
import { formatWhole, readCurrency } from '@/lib/verified-plan';

export const metadata: Metadata = { title: 'Blog post' };

export default async function CompanyPostPage({ params, searchParams }: PageProps<'/dashboard/company/blog/[id]'>) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const here = `/dashboard/company/blog/${id}`;
  const [{ user }, post, overview] = await Promise.all([requireUser(here), getMyCompanyPost(here, id), getMyCompanyPosts(here)]);
  if (!post || !overview.company) notFound();
  // An API from before rupee prices only knows dollars.
  const currency = overview.prices ? readCurrency(query.currency) : 'USD';
  const chosen = overview.prices?.[currency] ?? overview.price;
  const price = formatWhole(chosen.total, chosen.currency);
  const editable = post.status === 'draft' || post.status === 'rejected';
  const live = overview.company.status === 'published';

  return (
    <>
      <Link href="/dashboard/company/blog" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" /> Your posts
      </Link>
      <DashboardHeader
        eyebrow={overview.company.name}
        title={post.title}
        action={<span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${POST_STATUS[post.status].className}`}>{POST_STATUS[post.status].label}</span>}
      />

      {post.status === 'draft' && (
        <Banner tone="brand" icon={<Clock className="size-5" aria-hidden="true" />} title={`Send it to our team for ${price}`}>
          <p>
            Pay once and our team publishes your post on the Accelfied blog and your profile within {overview.reviewHours} hours. {price} includes GST, and you get an
            invoice in Billing.
          </p>
          <div className="mt-4">
            {!live ? (
              <p className="font-medium">Your listing goes live after our team approves it. You can send a post right after that.</p>
            ) : !overview.enabled ? (
              <p className="font-medium">Online payment is being set up. Your draft is saved and you can send it soon.</p>
            ) : post.words < MIN_WORDS ? (
              <p className="font-medium">Write at least {MIN_WORDS} words before sending. You have {post.words} now.</p>
            ) : (
              <>
                {overview.prices && <CurrencySwitch value={currency} href={here} className="mb-4" />}
                <PostCheckout
                key={currency}
                postId={post.id}
                label={`Pay ${price} and send`}
                description={`Blog post: ${post.title.slice(0, 60)}`}
                name={`${user.firstName} ${user.lastName}`}
                email={user.email}
                start={startPostCheckout.bind(null, post.id, currency)}
              />
              </>
            )}
          </div>
        </Banner>
      )}

      {post.status === 'pending' && (
        <Banner tone="saffron" icon={<Hourglass className="size-5" aria-hidden="true" />} title={`Paid. Your post will be live within ${overview.reviewHours} hours.`}>
          <p>
            Our team is reading it now. It goes live on the blog by <strong>{post.liveBy ? formatDate(post.liveBy) : 'soon'}</strong> at the latest. If something needs
            fixing, we send it back with a note and you can change it at no extra cost.
          </p>
        </Banner>
      )}

      {post.status === 'published' && post.blogSlug && (
        <Banner tone="accent" icon={<CheckCircle2 className="size-5" aria-hidden="true" />} title="Your post is live">
          <p>It is on the Accelfied blog and on your company profile.</p>
          <Link href={`/blog/${post.blogSlug}`} className="mt-3 inline-flex items-center gap-1 font-medium text-accent hover:underline">
            Read it on the blog <ExternalLink className="size-3.5" aria-hidden="true" />
          </Link>
        </Banner>
      )}

      {post.status === 'rejected' && (
        <Banner tone="danger" icon={<MessageSquareWarning className="size-5" aria-hidden="true" />} title="Our team asked for changes">
          <p className="whitespace-pre-line">{post.reviewNote}</p>
          <p className="mt-2">Fix the post below, save it, then send it again. You already paid, so there is nothing more to pay.</p>
          <form action={resubmitCompanyPost.bind(null, post.id)} className="mt-4">
            <Button type="submit" size="md">
              Send it again
            </Button>
          </form>
        </Banner>
      )}

      {editable ? (
        <Panel title="Edit your post" className="mt-6">
          <CompanyPostForm post={post} save={saveCompanyPost.bind(null, post.id)} />
        </Panel>
      ) : (
        <Panel className="mt-6">
          {post.excerpt && <p className="mb-6 text-lg text-ink-soft">{post.excerpt}</p>}
          {post.coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- uploaded pictures live on our own /uploads path
            <img src={post.coverUrl} alt="" className="mb-6 aspect-[2/1] w-full rounded-2xl object-cover" />
          )}
          <Markdown source={post.body} className="prose-post" />
        </Panel>
      )}

      {post.status === 'draft' && (
        <details className="group mt-6 text-sm">
          <summary className="cursor-pointer list-none font-medium text-ink-soft underline-offset-4 hover:text-danger hover:underline">Delete this draft</summary>
          <form action={deleteCompanyPost.bind(null, post.id)} className="mt-3 max-w-sm rounded-xl border border-line bg-paper p-4">
            <p className="text-ink-soft">The draft is removed for good. Nothing has been paid for it.</p>
            <Button type="submit" variant="secondary" size="sm" className="mt-3">
              Yes, delete it
            </Button>
          </form>
        </details>
      )}
    </>
  );
}

const TONES = {
  brand: 'border-brand/25 bg-brand/5 text-ink',
  saffron: 'border-saffron/30 bg-saffron-tint text-saffron-ink',
  accent: 'border-accent/25 bg-accent-tint text-ink',
  danger: 'border-danger/30 bg-danger-tint text-ink',
} as const;

function Banner({ tone, icon, title, children }: { tone: keyof typeof TONES; icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className={`rounded-[var(--radius-card)] border p-5 sm:p-6 ${TONES[tone]}`}>
      <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
        {icon} {title}
      </h2>
      <div className="mt-2 text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}
