import { Building2, Calendar, DollarSign, ExternalLink, Globe, MapPin, PenLine, Timer, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PostCard } from '@/components/blog/post-card';
import { CompanyLogo } from '@/components/company/company-logo';
import { RatingInline } from '@/components/company/rating-inline';
import { RatingSummary } from '@/components/company/rating-summary';
import { ReviewCard } from '@/components/company/review-card';
import { Pagination } from '@/components/directory/pagination';
import { VerifiedBadge } from '@/components/ui/badge';
import { ButtonLink, buttonClass } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { EmptyState } from '@/components/ui/empty-state';
import { countryName } from '@/lib/countries';
import { getCompany, getCompanyReviews, getPosts, getSitemapCompanies } from '@/lib/data';
import { hostname } from '@/lib/format';
import { hourlyRateLabel, minProjectLabel, teamSizeLabel } from '@/lib/labels';
import { SITE_URL } from '@/lib/site';
import type { CompanyProfile } from '@/lib/types';

/** Placeholder so the route can be validated at build time before any company is published. */
const SHELL_SLUG = '__shell__';

export async function generateStaticParams() {
  const companies = await getSitemapCompanies();
  const top = companies.slice(0, 200).map((company) => ({ slug: company.slug }));
  return top.length ? top : [{ slug: SHELL_SLUG }];
}

export async function generateMetadata({ params }: PageProps<'/profile/[slug]'>): Promise<Metadata> {
  const company = await getCompany((await params).slug);
  if (!company) return { title: 'Company not found', robots: { index: false } };
  const rating = company.rating.count > 0 ? ` Rated ${company.rating.average.toFixed(1)}/5 from ${company.rating.count} client reviews.` : '';
  return {
    title: `${company.name} reviews, rates and services`,
    description: `${company.tagline || company.name}.${rating}`.slice(0, 300),
    alternates: { canonical: `/profile/${company.slug}` },
    openGraph: company.logoUrl ? { images: [company.logoUrl] } : undefined,
  };
}

export default function ProfilePage({ params, searchParams }: PageProps<'/profile/[slug]'>) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <Profile params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Profile({ params, searchParams }: PageProps<'/profile/[slug]'>) {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        // Structured data for search engines. Aggregate rating is only emitted when real reviews exist.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(company)).replace(/</g, '\\u003c') }}
      />
      <ProfileHeader company={company} />
      <Container className="grid gap-12 py-12 lg:grid-cols-[1fr_320px] lg:gap-14">
        <div className="min-w-0 space-y-16">
          <Overview company={company} />
          {company.portfolio.length > 0 && <Portfolio company={company} />}
          <section id="reviews" className="scroll-mt-28 lg:scroll-mt-36">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-semibold text-ink">Client reviews</h2>
              <Link href={`/write-a-review?company=${company.slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
                <PenLine className="size-4" aria-hidden="true" />
                Worked with {company.name}? Write a review
              </Link>
            </div>
            {company.rating.count > 0 ? (
              <div className="mt-6 space-y-6">
                <RatingSummary rating={company.rating} />
                <Suspense fallback={<div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-surface" />}>
                  <ReviewList slug={company.slug} searchParams={searchParams} />
                </Suspense>
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState
                  title="No reviews yet"
                  action={<ButtonLink href={`/write-a-review?company=${company.slug}`}>Write the first review</ButtonLink>}
                >
                  When past clients of {company.name} share their experience, it will appear here after a quick check by our team.
                </EmptyState>
              </div>
            )}
          </section>
          <Suspense fallback={null}>
            <CompanyPosts slug={company.slug} name={company.name} />
          </Suspense>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          <QuoteCard company={company} />
          <ClaimCard company={company} />
        </aside>
      </Container>
    </>
  );
}

function ProfileHeader({ company }: { company: CompanyProfile }) {
  return (
    <section className="grain border-b border-line">
      <Container className="py-10 lg:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
          <Link href="/agencies" className="hover:text-accent">
            Companies
          </Link>
          {company.services[0] && (
            <>
              <span className="mx-2 text-line-strong">/</span>
              <Link href={`/agencies/${company.services[0].slug}`} className="hover:text-accent">
                {company.services[0].name}
              </Link>
            </>
          )}
        </nav>
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <CompanyLogo name={company.name} logoUrl={company.logoUrl} size={88} />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{company.name}</h1>
                {company.verified && <VerifiedBadge />}
              </div>
              {company.tagline && <p className="mt-2 max-w-2xl text-lg text-ink-soft">{company.tagline}</p>}
              <div className="mt-3">
                <a href="#reviews">
                  <RatingInline average={company.rating.average} count={company.rating.count} />
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={company.website} target="_blank" rel="noopener nofollow" className={buttonClass('secondary')}>
              <Globe className="size-4" aria-hidden="true" />
              Visit website
            </a>
            <ButtonLink href={`/get-a-quote?company=${company.slug}`}>Get a quote</ButtonLink>
          </div>
        </div>
        <nav aria-label="Profile sections" className="mt-8 flex gap-1 overflow-x-auto border-t border-line pt-4 text-[15px]">
          {[
            { href: '#overview', label: 'Overview' },
            { href: '#services', label: 'Services' },
            ...(company.portfolio.length ? [{ href: '#portfolio', label: 'Portfolio' }] : []),
            { href: '#reviews', label: 'Reviews' },
          ].map((item) => (
            <a key={item.href} href={item.href} className="rounded-full px-4 py-2 whitespace-nowrap text-ink-soft hover:bg-ink/5 hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>
      </Container>
    </section>
  );
}

function Overview({ company }: { company: CompanyProfile }) {
  const facts = [
    { icon: DollarSign, label: 'Min. project size', value: minProjectLabel(company.minProjectSize) },
    { icon: Timer, label: 'Hourly rate', value: hourlyRateLabel(company.hourlyRate) },
    { icon: Users, label: 'Team size', value: teamSizeLabel(company.teamSize) },
    ...(company.foundedYear ? [{ icon: Calendar, label: 'Founded', value: String(company.foundedYear) }] : []),
  ];
  return (
    <>
      <section id="overview" className="scroll-mt-28 lg:scroll-mt-36">
        <h2 className="font-display text-3xl font-semibold text-ink">Overview</h2>
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl border border-line bg-surface p-4">
              <dt className="flex items-center gap-1.5 text-xs text-ink-faint">
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </dt>
              <dd className="mt-1 font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 max-w-3xl space-y-4 text-[17px] leading-relaxed whitespace-pre-line text-ink-soft">{company.description}</div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-ink">Locations</h3>
            <ul className="mt-3 space-y-2 text-[15px] text-ink-soft">
              {company.locations.map((location) => (
                <li key={`${location.city}-${location.countryCode}`} className="flex items-center gap-2">
                  <MapPin className="size-4 text-accent" aria-hidden="true" />
                  {location.city}
                  {location.region ? `, ${location.region}` : ''}, {countryName(location.countryCode)}
                </li>
              ))}
            </ul>
          </div>
          {company.industries.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-ink">Industry focus</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {company.industries.map((industry) => (
                  <li key={industry} className="rounded-full bg-paper-deep px-3 py-1 text-sm text-ink-soft">
                    {industry}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section id="services" className="scroll-mt-28 lg:scroll-mt-36">
        <h2 className="font-display text-3xl font-semibold text-ink">Service focus</h2>
        <ul className="mt-6 space-y-4">
          {company.services.map((service) => (
            <li key={service.slug}>
              <div className="flex items-baseline justify-between gap-4">
                <Link href={`/agencies/${service.slug}`} className="font-medium text-ink hover:text-accent">
                  {service.name}
                </Link>
                <span className="tabular-nums text-ink-soft">{service.percent}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper-deep">
                <div className="h-full rounded-full bg-brand" style={{ width: `${service.percent}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function Portfolio({ company }: { company: CompanyProfile }) {
  return (
    <section id="portfolio" className="scroll-mt-28 lg:scroll-mt-36">
      <h2 className="font-display text-3xl font-semibold text-ink">Portfolio</h2>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2">
        {company.portfolio.map((item) => (
          <li key={item.id} className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
            {item.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.imageUrl} alt="" loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover" />
            )}
            <div className="p-5">
              <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
              {item.description && <p className="mt-2 line-clamp-3 text-[15px] text-ink-soft">{item.description}</p>}
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener nofollow" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                  View project <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function QuoteCard({ company }: { company: CompanyProfile }) {
  return (
    <div className="grain overflow-hidden rounded-[var(--radius-card)] bg-night p-6 text-paper">
      <h2 className="font-display text-2xl font-semibold">Talk to {company.name}</h2>
      <p className="mt-2 text-[15px] text-paper/70">
        Share your project once. {company.name} gets your brief and replies directly.
      </p>
      <ButtonLink href={`/get-a-quote?company=${company.slug}`} className="mt-6 w-full">
        Get a quote
      </ButtonLink>
      <p className="mt-4 text-center text-sm text-paper/60">
        <a href={company.website} target="_blank" rel="noopener nofollow" className="hover:text-white">
          {hostname(company.website)}
        </a>
      </p>
    </div>
  );
}

function ClaimCard({ company }: { company: CompanyProfile }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface p-5">
      <p className="flex items-center gap-2 font-medium text-ink">
        <Building2 className="size-4 text-accent" aria-hidden="true" />
        Is this your company?
      </p>
      <p className="mt-1.5 text-sm text-ink-soft">Claim it with your work email at {hostname(company.website)}. Our team verifies every claim.</p>
      <Link href={`/claim/${company.slug}`} className="mt-3 inline-flex text-sm font-medium text-accent underline-offset-4 hover:underline">
        Claim this company
      </Link>
    </div>
  );
}

async function ReviewList({ slug, searchParams }: { slug: string; searchParams: PageProps<'/profile/[slug]'>['searchParams'] }) {
  const raw = await searchParams;
  const pageParam = Number.parseInt(String(raw.page ?? '1'), 10);
  const page = Number.isFinite(pageParam) && pageParam >= 1 && pageParam <= 500 ? pageParam : 1;
  const reviews = await getCompanyReviews(slug, { page });
  return (
    <>
      <div className="space-y-6">
        {reviews.items.map((review) => (
          <ReviewCard key={review.id} review={review} reportFrom={`/profile/${slug}#reviews`} />
        ))}
      </div>
      <Pagination
        page={reviews.page}
        totalPages={reviews.totalPages}
        hrefFor={(target) => `/profile/${slug}${target > 1 ? `?page=${target}` : ''}#reviews`}
      />
    </>
  );
}

/** Blog posts and interviews that feature this company. Hidden when there are none. */
async function CompanyPosts({ slug, name }: { slug: string; name: string }) {
  const posts = await getPosts({ company: slug, limit: 4 });
  if (!posts.items.length) return null;
  return (
    <section id="featured-in" className="scroll-mt-28 lg:scroll-mt-36">
      <h2 className="font-display text-3xl font-semibold text-ink">{name} on the Accelfied blog</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {posts.items.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}

function ProfileSkeleton() {
  return (
    <div aria-hidden="true">
      <section className="grain border-b border-line">
        <Container className="flex items-center gap-5 py-14">
          <div className="size-22 animate-pulse rounded-2xl bg-paper-deep" />
          <div className="flex-1 space-y-3">
            <div className="h-10 w-1/2 animate-pulse rounded-lg bg-paper-deep" />
            <div className="h-5 w-1/3 animate-pulse rounded bg-paper-deep" />
          </div>
        </Container>
      </section>
      <Container className="py-12">
        <div className="h-72 animate-pulse rounded-[var(--radius-card)] bg-surface" />
      </Container>
    </div>
  );
}

function jsonLd(company: CompanyProfile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: company.website,
    logo: company.logoUrl || undefined,
    description: company.tagline || undefined,
    foundingDate: company.foundedYear ? String(company.foundedYear) : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: company.headquarters.city,
      addressCountry: company.headquarters.countryCode,
    },
    mainEntityOfPage: `${SITE_URL}/profile/${company.slug}`,
    ...(company.rating.count > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: company.rating.average,
            reviewCount: company.rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}
