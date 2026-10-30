import { BadgeCheck, Clock } from 'lucide-react';
import Link from 'next/link';
import { formatDay } from '@/lib/format';
import type { PostCard as Post, PostKind } from '@/lib/types';

export const KIND_LABEL: Record<PostKind, string> = { article: 'Guide', 'company-feature': 'Company story', interview: 'Interview' };

/** A post in a list. The cover image is optional; without one the card leads with the type and title. */
export function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  return (
    <article className="lift group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
      {post.coverUrl ? (
        // Covers come from any https host, so a plain <img> is used (see CompanyLogo).
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverUrl} alt="" loading={priority ? 'eager' : 'lazy'} decoding="async" className="aspect-[16/9] w-full object-cover" />
      ) : (
        <div className="grain relative aspect-[16/9] overflow-hidden bg-night" aria-hidden="true">
          <span className="orb -top-10 -right-10 size-48 bg-accent/60" />
          <span className="orb -bottom-16 -left-10 size-40 bg-brand/50" />
          <p className="absolute inset-x-6 bottom-5 line-clamp-2 font-display text-2xl leading-tight font-semibold text-paper">{post.interviewee.name || post.company?.name || 'Accelfied'}</p>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold tracking-[0.12em] text-brand uppercase">
          {KIND_LABEL[post.kind]}
          {post.company && (
            <span className="inline-flex items-center gap-1 tracking-normal text-ink-soft normal-case">
              {post.company.name}
              {post.company.verified && <BadgeCheck className="size-3.5 text-accent" aria-label="Verified" />}
            </span>
          )}
        </p>
        <h3 className="mt-2 font-display text-xl leading-snug font-semibold text-ink">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 group-hover:text-accent">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-ink-soft">{post.excerpt}</p>}
        <p className="mt-auto flex items-center gap-3 pt-5 text-sm text-ink-faint">
          <time dateTime={post.publishedAt}>{formatDay(post.publishedAt)}</time>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" /> {post.readMinutes} min read
          </span>
        </p>
      </div>
    </article>
  );
}
