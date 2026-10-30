import { ArrowLeft, BadgeCheck, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Markdown } from '@/components/blog/markdown';
import { KIND_LABEL, PostCard } from '@/components/blog/post-card';
import { CompanyLogo } from '@/components/company/company-logo';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { getPost, getPosts, getSitemapPosts } from '@/lib/data';
import { formatDay } from '@/lib/format';
import { SITE_URL } from '@/lib/site';

const SHELL_SLUG = '__shell__';

export async function generateStaticParams() {
  const posts = await getSitemapPosts();
  const top = posts.slice(0, 100).map((post) => ({ slug: post.slug }));
  return top.length ? top : [{ slug: SHELL_SLUG }];
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return { title: 'Post not found', robots: { index: false } };
  return {
    title: post.seoTitle ? { absolute: post.seoTitle } : post.title,
    description: (post.seoDescription || post.excerpt).slice(0, 300) || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: 'article', publishedTime: post.publishedAt, modifiedTime: post.updatedAt, images: post.coverUrl ? [post.coverUrl] : undefined },
  };
}

export default function PostPage({ params }: PageProps<'/blog/[slug]'>) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <PostView params={params} />
    </Suspense>
  );
}

async function PostView({ params }: Pick<PageProps<'/blog/[slug]'>, 'params'>) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const more = (await getPosts({ limit: 4 })).items.filter((item) => item.slug !== post.slug).slice(0, 3);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.coverUrl || undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Organization', name: post.authorName },
    publisher: { '@type': 'Organization', name: 'Accelfied', url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    ...(post.company ? { about: { '@type': 'Organization', name: post.company.name, url: `${SITE_URL}/profile/${post.company.slug}` } } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <article>
        <header className="grain border-b border-line">
          <Container className="max-w-4xl py-12 lg:py-16">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
              <ArrowLeft className="size-4" aria-hidden="true" /> All posts
            </Link>
            <p className="mt-6 text-sm font-semibold tracking-[0.16em] text-brand uppercase">{KIND_LABEL[post.kind]}</p>
            <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">{post.title}</h1>
            {post.excerpt && <p className="mt-5 text-xl leading-relaxed text-ink-soft">{post.excerpt}</p>}
            <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-faint">
              <span className="font-medium text-ink-soft">{post.authorName}</span>
              <time dateTime={post.publishedAt}>{formatDay(post.publishedAt)}</time>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden="true" /> {post.readMinutes} min read
              </span>
            </p>
          </Container>
        </header>
        {post.coverUrl && (
          <Container className="max-w-5xl pt-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverUrl} alt="" className="aspect-[2/1] w-full rounded-[var(--radius-card)] object-cover" />
          </Container>
        )}
        <Container className="grid max-w-5xl gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:py-16">
          <div className="min-w-0">
            {post.interviewee.name && (
              <p className="mb-8 rounded-2xl border border-line bg-surface px-5 py-4 text-[15px] text-ink-soft">
                In conversation with <span className="font-semibold text-ink">{post.interviewee.name}</span>
                {post.interviewee.role ? `, ${post.interviewee.role}` : ''}.
              </p>
            )}
            <Markdown source={post.body} className="prose-post" />
            {post.tags.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-2" aria-label="Tags">
                {post.tags.map((tag) => (
                  <li key={tag} className="rounded-full bg-paper-deep px-3 py-1 text-sm text-ink-soft">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {post.company && (
            <aside className="h-fit rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] lg:sticky lg:top-32">
              <p className="text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase">Featured company</p>
              <div className="mt-3 flex items-center gap-3">
                <CompanyLogo name={post.company.name} logoUrl={post.company.logoUrl} size={48} />
                <p className="min-w-0 font-display text-lg leading-snug font-semibold text-ink">
                  {post.company.name}
                  {post.company.verified && <BadgeCheck className="ml-1.5 inline size-4.5 align-[-3px] text-accent" aria-label="Verified" />}
                </p>
              </div>
              <ButtonLink href={`/profile/${post.company.slug}`} variant="secondary" size="sm" className="mt-4 w-full">
                See reviews and rates
              </ButtonLink>
            </aside>
          )}
        </Container>
      </article>
      {more.length > 0 && (
        <section className="grain border-t border-line bg-paper-deep py-16">
          <Container>
            <h2 className="font-display text-3xl font-semibold text-ink">Keep reading</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((item) => (
                <PostCard key={item.slug} post={item} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
