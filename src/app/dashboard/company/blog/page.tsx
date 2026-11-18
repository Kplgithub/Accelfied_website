import { CreditCard, PenLine, Rocket, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DashboardHeader, Panel } from '@/components/dashboard/bits';
import { NoCompany } from '@/components/dashboard/no-company';
import { ButtonLink } from '@/components/ui/button';
import { POST_STATUS, type CompanyPost } from '@/lib/company-posts';
import { getMyCompanyPosts } from '@/lib/company-posts-data';
import { formatDate, formatDay } from '@/lib/format';
import { formatMoney } from '@/lib/verified-plan';

export const metadata: Metadata = { title: 'Write a blog' };

const HERE = '/dashboard/company/blog';

export default async function CompanyBlogPage() {
  const data = await getMyCompanyPosts(HERE);
  if (!data.company) {
    return (
      <>
        <DashboardHeader eyebrow="My company" title="Write a blog" />
        <NoCompany />
      </>
    );
  }
  const price = formatMoney(data.price.total, data.price.currency);

  return (
    <>
      <DashboardHeader
        eyebrow={data.company.name}
        title="Write a blog"
        intro={`Share what your team knows with clients across India on the Accelfied blog. Each post costs ${price}, GST included, and goes live within ${data.reviewHours} hours of payment.`}
        action={
          <ButtonLink href={`${HERE}/new`} size="lg">
            <PenLine className="size-4" aria-hidden="true" /> Write a new post
          </ButtonLink>
        }
      />

      <ol className="mb-6 grid gap-3 sm:grid-cols-3">
        <Step icon={<PenLine className="size-5" aria-hidden="true" />} title="1. Write" text="Write your post here and save it as a draft. Edit it as often as you like." />
        <Step icon={<CreditCard className="size-5" aria-hidden="true" />} title={`2. Pay ${price}`} text="One payment per post by Razorpay. You get a GST invoice in Billing." />
        <Step icon={<Rocket className="size-5" aria-hidden="true" />} title={`3. Live in ${data.reviewHours} hours`} text="Our team reads it and publishes it on the blog and on your profile." />
      </ol>

      <Panel title="Your posts">
        {data.posts.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-ink-soft">You have not written a post yet. Guides, case studies and cost breakdowns from your own projects do best.</p>
            <Link href={`${HERE}/new`} className="mt-3 inline-block font-medium text-accent hover:underline">
              Write your first post
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {data.posts.map((post) => (
              <li key={post.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <Link href={`${HERE}/${post.id}`} className="font-medium text-ink hover:text-accent hover:underline">
                    {post.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-ink-soft">{statusLine(post)}</p>
                </div>
                <span className={`inline-flex shrink-0 items-center self-start rounded-full px-2.5 py-1 text-xs font-medium sm:self-center ${POST_STATUS[post.status].className}`}>
                  {POST_STATUS[post.status].label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <p className="mt-6 flex items-start gap-2 text-sm text-ink-faint">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Every post is read by our team before it goes live. Posts must be your own writing and useful to buyers; plain adverts are sent back with a note so you can fix them, at no extra cost.
      </p>
    </>
  );
}

function statusLine(post: CompanyPost): string {
  switch (post.status) {
    case 'draft':
      return `Saved ${formatDay(post.updatedAt)}. Pay to send it to our team.`;
    case 'pending':
      return post.liveBy ? `Live by ${formatDate(post.liveBy)} at the latest.` : 'With our team.';
    case 'published':
      return post.decidedAt ? `Live since ${formatDay(post.decidedAt)}.` : 'Live on the blog.';
    case 'rejected':
      return 'Our team asked for changes. Open it to see the note.';
  }
}

function Step({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <li className="rounded-2xl border border-line bg-surface p-5">
      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">{icon}</span>
      <p className="mt-3 font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-soft">{text}</p>
    </li>
  );
}
