import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { KIND_LABEL, PostCard } from '@/components/blog/post-card';
import { Pagination } from '@/components/directory/pagination';
import { Reveal } from '@/components/motion/reveal';
import { Container } from '@/components/ui/container';
import { EmptyState } from '@/components/ui/empty-state';
import { getPosts, getSiteSettings } from '@/lib/data';
import { pageParam, pagedCanonical } from '@/lib/page-param';
import type { PostKind } from '@/lib/types';
import { PostGridSkeleton } from '@/components/skeleton/public';

const KINDS: Array<{ value: PostKind | ''; label: string }> = [
  { value: '', label: 'Everything' },
  { value: 'interview', label: 'Interviews' },
  { value: 'company-feature', label: 'Company stories' },
  { value: 'article', label: 'Guides' },
];

export async function generateMetadata({ searchParams }: PageProps<'/blog'>): Promise<Metadata> {
  const [{ seo }, { canonical, suffix }] = await Promise.all([getSiteSettings(), pagedCanonical('/blog', searchParams)]);
  const title = seo.blog.title || 'Blog: Agency Cost Guides and Hiring Tips for India';
  return {
    title: seo.blog.title ? { absolute: `${title}${suffix}` } : `${title}${suffix}`,
    description: seo.blog.description || 'Real costs, hiring checklists and top company lists for Indian cities, plus stories and interviews from the agencies listed on Accelfied.',
    alternates: { canonical },
  };
}

export default function BlogPage({ searchParams }: PageProps<'/blog'>) {
  return (
    <>
      <section className="grain border-b border-line">
        <Container className="pt-14 lg:pt-20">
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Accelfied blog</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl leading-tight font-semibold tracking-tight text-ink sm:text-6xl">Hire smarter, pay what the work is worth</h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">What a website or app really costs in India, how to vet an agency before you sign, and the people building good companies in cities across the country.</p>
        </Container>
        <Suspense fallback={<Container className="h-[3.75rem] pb-14 lg:pb-20" />}>
          <KindNav searchParams={searchParams} />
        </Suspense>
      </section>
      <Container className="py-12 lg:py-16">
        <Suspense fallback={<PostsSkeleton />}>
          <PostList searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function readKind(searchParams: PageProps<'/blog'>['searchParams']) {
  const params = await searchParams;
  return { kind: KINDS.find((item) => item.value && item.value === params.type)?.value || undefined, page: pageParam(params.page) };
}

async function KindNav({ searchParams }: Pick<PageProps<'/blog'>, 'searchParams'>) {
  const { kind } = await readKind(searchParams);
  return (
    <Container className="pb-14 lg:pb-20">
      <nav aria-label="Post types" className="mt-8 flex flex-wrap gap-2">
        {KINDS.map((item) => {
          const active = (item.value || undefined) === kind;
          return (
            <Link
              key={item.label}
              href={item.value ? `/blog?type=${item.value}` : '/blog'}
              aria-current={active ? 'page' : undefined}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${active ? 'border-ink bg-ink text-white' : 'border-line-strong bg-surface text-ink-soft hover:border-accent hover:text-accent'}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </Container>
  );
}

async function PostList({ searchParams }: Pick<PageProps<'/blog'>, 'searchParams'>) {
  const { kind, page } = await readKind(searchParams);
  const posts = await getPosts({ kind, page });
  const href = (target: number) => {
    const query = new URLSearchParams();
    if (kind) query.set('type', kind);
    if (target > 1) query.set('page', String(target));
    return `/blog${query.size ? `?${query}` : ''}`;
  };

  return (
    <>
      {posts.items.length === 0 ? (
        <EmptyState title={kind ? `No ${KIND_LABEL[kind].toLowerCase()} posts yet` : 'No posts yet'}>Our team is writing the first ones. Check back soon.</EmptyState>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.items.map((post, index) => (
            <Reveal key={post.slug} delay={(index % 3) * 80} className="h-full">
              <PostCard post={post} priority={index < 3} />
            </Reveal>
          ))}
        </div>
      )}
      <Pagination page={posts.page} totalPages={posts.totalPages} hrefFor={href} />
    </>
  );
}

function PostsSkeleton() {
  return <PostGridSkeleton />;
}
