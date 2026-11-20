import { Award, BadgeCheck, Building2, Calendar, DollarSign, ExternalLink, Globe, MapPin, MessageSquare, PenLine, Pin, Star, Timer, Users } from 'lucide-react';
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
import { AwardIcon } from '@/components/ui/seal-icon';
import { awardHref, awardTitle } from '@/lib/badges/catalog';
import { ButtonLink, buttonClass } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { EmptyState } from '@/components/ui/empty-state';
import { countryName } from '@/lib/countries';
import { getCompany, getCompanyAwards, getCompanyDetails, getCompanyReviews, getPosts, getSitemapCompanies } from '@/lib/data';
import { formatRating, hostname, pluralize } from '@/lib/format';
import { budgetLabel, hourlyRateLabel, minProjectLabel, teamSizeLabel } from '@/lib/labels';
import { JsonLd, breadcrumbLd } from '@/components/seo/json-ld';
import { MAX_DESCRIPTION, OG_DEFAULTS } from '@/lib/seo-text';
import { SITE_URL } from '@/lib/site';
import type { CompanyProfile, PublicCompanyDetails, Review, TopAward } from '@/lib/types';
import { getCompanyExtras } from '@/lib/vendor-tools';
import { Donut } from '@/components/charts/donut';
import { PackagesSection } from '@/components/company/packages-section';
import { Reveal } from '@/components/motion/reveal';
import { PersonAvatar } from '@/components/company/person-avatar';
import { SaveButton } from '@/components/company/save-button';
import { ProfileView } from '@/components/tracking/profile-view';
import { WebsiteLink } from '@/components/tracking/website-link';
import { SocialLinks } from '@/components/ui/social-icon';
import { OwnerTools } from '@/components/company/owner-tools';
import { SimilarCompanies } from '@/components/company/similar-companies';
import { ProfilePageSkeleton } from '@/components/skeleton/public';
import { SkeletonRows } from '@/components/skeleton/skeleton';

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
  return {
    title: `${company.name} reviews, rates and services`,
    description: profileDescription(company),
    alternates: { canonical: `/profile/${company.slug}` },
    openGraph: { ...OG_DEFAULTS, type: 'profile', url: `/profile/${company.slug}` },
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
  const [details, awards, extras] = await Promise.all([getCompanyDetails(slug), getCompanyAwards(slug), getCompanyExtras(slug)]);

  return (
    <>
      <Suspense fallback={null}>
        <ProfileLd company={company} />
      </Suspense>
      <ProfileView slug={company.slug} />
      <Suspense fallback={null}>
        <OwnerTools slug={company.slug} />
      </Suspense>
      <ProfileHeader company={company} details={details} awards={awards} />
      <Container className="grid gap-12 py-12 lg:grid-cols-[1fr_320px] lg:gap-14">
        <div className="min-w-0 space-y-16">
          <Overview company={company} details={details} />
          <Pricing company={company} details={details} />
          {company.portfolio.length > 0 && <Portfolio company={company} />}
          {details && details.awards.length > 0 && <Awards details={details} />}
          {(company.team.length > 0 || extras.story) && <Team company={company} story={extras.story} />}
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
                <Suspense fallback={<SkeletonRows rows={3} />}>
                  <ReviewList slug={company.slug} searchParams={searchParams} featured={extras.featuredReview} />
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
          {extras.certifications.length > 0 && <CertifiedCard name={company.name} items={extras.certifications} />}
          {company.claimed !== true && <ClaimCard company={company} />}
          <Suspense fallback={null}>
            <SimilarCompanies slug={company.slug} service={[...company.services].sort((a, b) => b.percent - a.percent)[0]} />
          </Suspense>
        </aside>
      </Container>
      <MobileQuoteBar company={company} />
    </>
  );
}

/** On phones the sidebar sits at the very end, so the two main actions stay pinned to the bottom. */
function MobileQuoteBar({ company }: { company: CompanyProfile }) {
  return (
    <>
      <div className="h-20 lg:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_30px_-18px_rgb(23_49_59/0.45)] backdrop-blur lg:hidden print:hidden">
        <div className="mx-auto flex max-w-xl gap-2">
          <Link
            href={`/dashboard/messages/new?company=${company.slug}`}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line-strong text-sm font-medium text-ink transition-colors hover:border-ink"
          >
            <MessageSquare className="size-4" aria-hidden="true" />
            Message
          </Link>
          <Link
            href={`/get-a-quote?company=${company.slug}`}
            className="inline-flex h-11 flex-[1.4] items-center justify-center rounded-full bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-strong"
          >
            Get a quote
          </Link>
        </div>
      </div>
    </>
  );
}

function ProfileHeader({ company, details, awards }: { company: CompanyProfile; details: PublicCompanyDetails | null; awards: TopAward[] }) {
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
                {company.verified && <VerifiedBadge premier={company.premier} />}
              </div>
              {company.tagline && <p className="mt-2 max-w-2xl text-lg text-ink-soft">{company.tagline}</p>}
              <div className="mt-3">
                <a href="#reviews">
                  <RatingInline average={company.rating.average} count={company.rating.count} />
                </a>
              </div>
              {awards.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Awards earned on Accelfied">
                  {awards.slice(0, 4).map((award) => (
                    <li key={`${award.service}-${award.scope}-${award.city}`}>
                      <Link
                        href={awardHref(award)}
                        title={`Ranked #${award.rank} by client reviews`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface py-1 pr-3 pl-1.5 text-[13px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
                      >
                        <AwardIcon className="size-5" />
                        {awardTitle(award)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <SaveButton slug={company.slug} name={company.name} variant="button" />
            <WebsiteLink slug={company.slug} href={company.website} className={buttonClass('secondary')}>
              <Globe className="size-4" aria-hidden="true" />
              Visit website
            </WebsiteLink>
            <ButtonLink href={`/get-a-quote?company=${company.slug}`}>Get a quote</ButtonLink>
          </div>
        </div>
        <nav aria-label="Profile sections" className="mt-8 flex gap-1 overflow-x-auto border-t border-line pt-4 text-[15px]">
          {[
            { href: '#overview', label: 'Overview' },
            { href: '#services', label: 'Services' },
            { href: '#pricing', label: details?.packages.length ? 'Pricing & packages' : 'Pricing' },
            ...(company.portfolio.length ? [{ href: '#portfolio', label: 'Portfolio' }] : []),
            ...(details?.awards.length ? [{ href: '#awards', label: 'Awards' }] : []),
            ...(company.team.length ? [{ href: '#team', label: 'Team' }] : []),
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

function Overview({ company, details }: { company: CompanyProfile; details: PublicCompanyDetails | null }) {
  const facts = [
    // Price facts live in "Pricing at a glance" just below, so they are not repeated here.
    { icon: Users, label: 'Team size', value: teamSizeLabel(company.teamSize) },
    ...(company.foundedYear ? [{ icon: Calendar, label: 'Founded', value: String(company.foundedYear) }] : []),
    ...(company.headquarters?.city ? [{ icon: MapPin, label: 'Headquarters', value: company.headquarters.city }] : []),
    { icon: Star, label: 'Client reviews', value: company.rating.count > 0 ? pluralize(company.rating.count, 'review') : 'No reviews yet' },
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
        {Object.values(company.socials).some(Boolean) && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-ink">Find {company.name} online</h3>
            <div className="mt-3">
              <SocialLinks socials={company.socials} companyName={company.name} />
            </div>
          </div>
        )}
      </section>

      <section id="services" className="scroll-mt-28 lg:scroll-mt-36">
        <h2 className="font-display text-3xl font-semibold text-ink">Where their work goes</h2>
        <div className="mt-6 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Reveal>
            <Donut caption="Service lines" slices={company.services.map((service) => ({ label: service.name, value: service.percent }))} size={150} />
            <ul className="mt-5 flex flex-wrap gap-2">
              {company.services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/agencies/${service.slug}`} className="inline-block rounded-full border border-line px-3 py-1 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
          {details && details.clientFocus.small + details.clientFocus.midmarket + details.clientFocus.enterprise === 100 && (
            <Reveal delay={100}>
              <Donut
                caption="Client size"
                size={150}
                slices={[
                  { label: 'Small business', value: details.clientFocus.small },
                  { label: 'Mid-market', value: details.clientFocus.midmarket },
                  { label: 'Enterprise', value: details.clientFocus.enterprise },
                ]}
              />
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}

function Pricing({ company, details }: { company: CompanyProfile; details: PublicCompanyDetails | null }) {
  const common = details?.pricing.mostCommonBudget ? details.pricing.reviewBudgets.find((row) => row.budget === details.pricing.mostCommonBudget) : undefined;
  const tiles = [
    { icon: DollarSign, label: 'Min. project size', value: minProjectLabel(company.minProjectSize), note: 'Set by the company' },
    { icon: Timer, label: 'Avg. hourly rate', value: hourlyRateLabel(company.hourlyRate), note: 'Set by the company' },
    ...(company.rating.count > 0
      ? [{ icon: Star, label: 'Rating for cost', value: `${formatRating(company.rating.cost)} / 5`, note: `From ${pluralize(company.rating.count, 'review')}` }]
      : []),
    ...(common
      ? [{ icon: Building2, label: 'Most common project size', value: budgetLabel(common.budget), note: `Named in ${pluralize(common.count, 'review')}` }]
      : []),
  ];
  return (
    <section id="pricing" className="scroll-mt-28 lg:scroll-mt-36">
      <h2 className="font-display text-3xl font-semibold text-ink">Pricing at a glance</h2>
      <dl className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(({ icon: Icon, label, value, note }, index) => (
          <Reveal key={label} delay={index * 70} className="rounded-2xl border border-line bg-surface p-4">
            <dt className="flex items-center gap-1.5 text-xs text-ink-faint">
              <Icon className="size-3.5" aria-hidden="true" />
              {label}
            </dt>
            <dd className="mt-1 font-display text-xl font-semibold text-ink">{value}</dd>
            <dd className="text-xs text-ink-faint">{note}</dd>
          </Reveal>
        ))}
      </dl>
      {details && details.packages.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 font-display text-2xl font-semibold text-ink">Packages</h3>
          <PackagesSection packages={details.packages} companySlug={company.slug} />
        </div>
      )}
    </section>
  );
}

function Awards({ details }: { details: PublicCompanyDetails }) {
  return (
    <section id="awards" className="scroll-mt-28 lg:scroll-mt-36">
      <h2 className="font-display text-3xl font-semibold text-ink">Awards and recognition</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {details.awards.map((award, index) => (
          <Reveal as="li" key={award.id} delay={index * 60} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-saffron-tint text-saffron-ink">
              <Award className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-medium text-ink">{award.title}</p>
              <p className="text-sm text-ink-soft">
                {award.year ?? ''}
                {award.url && (
                  <a href={award.url} target="_blank" rel="noopener noreferrer nofollow" className="ml-2 inline-flex items-center gap-1 text-accent hover:underline">
                    See award <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                )}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
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

function Team({ company, story }: { company: CompanyProfile; story: string }) {
  return (
    <section id="team" className="scroll-mt-28 lg:scroll-mt-36">
      <h2 className="font-display text-3xl font-semibold text-ink">About the team</h2>
      {story && (
        <div className="mt-5 space-y-4 rounded-[var(--radius-card)] border-l-4 border-accent bg-surface p-6 text-[17px] leading-relaxed text-ink-soft shadow-[var(--shadow-card)]">
          <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">Our story</p>
          {story.split(/\n{2,}/).map((paragraph, index) => (
            <p key={index} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>
      )}
      {company.team.length > 0 && <p className="mt-6 text-ink-soft">The people you would work with at {company.name}.</p>}
      {company.team.length > 0 && <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {company.team.map((member) => (
          <li key={member.id} className="flex flex-col items-center rounded-2xl border border-line bg-surface p-5 text-center">
            <PersonAvatar name={member.name} photoUrl={member.photoUrl} size={88} />
            <p className="mt-3 font-medium text-ink">{member.name}</p>
            {member.role && <p className="text-sm text-ink-soft">{member.role}</p>}
            {member.linkedinUrl && (
              <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer nofollow" className="mt-2 text-[13px] font-medium text-accent hover:underline">
                LinkedIn
              </a>
            )}
          </li>
        ))}
      </ul>}
    </section>
  );
}

/** Service certifications this company has earned from its published reviews. */
function CertifiedCard({ name, items }: { name: string; items: Array<{ slug: string; name: string }> }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
      <h2 className="flex items-center gap-2 font-semibold text-ink">
        <Award className="size-5 text-brand" aria-hidden="true" />
        Certified services
      </h2>
      <p className="mt-1 text-sm text-ink-soft">{name} has 3+ published client reviews rated 4.0 or higher in the last two years in each of these.</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={`/agencies/${item.slug}`} className="inline-flex items-center gap-1.5 rounded-full bg-accent-tint px-3 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent/15">
              <BadgeCheck className="size-4" aria-hidden="true" />
              {item.name}
            </Link>
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
      <Link
        href={`/dashboard/messages/new?company=${company.slug}`}
        className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-paper/25 text-[15px] font-medium text-paper transition-colors hover:border-paper/60"
      >
        <MessageSquare className="size-4" aria-hidden="true" />
        Send a message
      </Link>
      <p className="mt-4 text-center text-sm text-paper/60">
        <WebsiteLink slug={company.slug} href={company.website} className="hover:text-white">
          {hostname(company.website)}
        </WebsiteLink>
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

async function ReviewList({ slug, searchParams, featured }: { slug: string; searchParams: PageProps<'/profile/[slug]'>['searchParams']; featured: Review | null }) {
  const raw = await searchParams;
  const pageParam = Number.parseInt(String(raw.page ?? '1'), 10);
  const page = Number.isFinite(pageParam) && pageParam >= 1 && pageParam <= 500 ? pageParam : 1;
  const reviews = await getCompanyReviews(slug, { page });
  return (
    <>
      <div className="space-y-6">
        {featured && page === 1 && (
          <div className="relative rounded-[calc(var(--radius-card)+6px)] bg-gradient-to-br from-accent/25 via-accent-tint to-transparent p-1.5">
            <p className="absolute -top-3 left-5 z-10 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              <Pin className="size-3" aria-hidden="true" />
              Featured review
            </p>
            <ReviewCard review={featured} reportFrom={`/profile/${slug}#reviews`} />
          </div>
        )}
        {reviews.items
          .filter((review) => !(featured && page === 1 && review.id === featured.id))
          .map((review) => (
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
  return <ProfilePageSkeleton />;
}

/**
 * Structured data for search engines: the company, its rating and its latest
 * reviews. Rating and reviews are only emitted when real published reviews exist.
 */
async function ProfileLd({ company }: { company: CompanyProfile }) {
  const reviews = company.rating.count > 0 ? (await getCompanyReviews(company.slug)).items : [];
  const profileUrl = `${SITE_URL}/profile/${company.slug}`;
  const crumbs = [{ name: 'Companies', url: `${SITE_URL}/agencies` }];
  if (company.services[0]) crumbs.push({ name: company.services[0].name, url: `${SITE_URL}/agencies/${company.services[0].slug}` });
  crumbs.push({ name: company.name, url: profileUrl });
  return <JsonLd data={[organizationLd(company, reviews), breadcrumbLd(crumbs)]} />;
}

function organizationLd(company: CompanyProfile, reviews: Review[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/profile/${company.slug}#company`,
    name: company.name,
    url: company.website,
    logo: company.logoUrl || undefined,
    description: company.description || company.tagline || undefined,
    foundingDate: company.foundedYear ? String(company.foundedYear) : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: company.headquarters.city,
      addressRegion: company.headquarters.region || undefined,
      addressCountry: company.headquarters.countryCode,
    },
    mainEntityOfPage: `${SITE_URL}/profile/${company.slug}`,
    knowsAbout: company.services.map((service) => service.name),
    ...(company.rating.count > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: company.rating.average,
            reviewCount: company.rating.count,
            bestRating: 5,
            worstRating: 1,
          },
          review: reviews.map((review) => ({
            '@type': 'Review',
            name: review.project.title,
            reviewBody: review.content.results || review.content.solution || undefined,
            datePublished: review.publishedAt ?? undefined,
            author: review.reviewer.name
              ? { '@type': 'Person', name: review.reviewer.name, jobTitle: review.reviewer.jobTitle || undefined }
              : review.reviewer.companyName
                ? { '@type': 'Organization', name: review.reviewer.companyName }
                : { '@type': 'Person', name: 'Anonymous' },
            reviewRating: { '@type': 'Rating', ratingValue: review.ratings.overall, bestRating: 5, worstRating: 1 },
          })),
        }
      : {}),
  };
}

/**
 * Search snippet built from real listing data: what the company does, its rating only when published reviews
 * exist, and where it is. Parts are dropped from the end until it fits in a search result.
 */
function profileDescription(company: CompanyProfile): string {
  const tagline = company.tagline.trim().replace(/[.!\s]+$/, '');
  const lead = tagline ? `${company.name}: ${tagline}.` : `${company.name}.`;
  const place = [company.headquarters.city, countryName(company.headquarters.countryCode)].filter(Boolean).join(', ');
  const services = company.services.slice(0, 2).map((service) => service.name).join(' and ');
  const parts = [
    lead,
    company.rating.count > 0 ? `Rated ${formatRating(company.rating.average)}/5 from ${pluralize(company.rating.count, 'client review')}.` : '',
    services && place ? `${services} company in ${place}.` : '',
    'See client reviews, rates and portfolio.',
  ].filter(Boolean);
  let text = parts.join(' ');
  while (text.length > MAX_DESCRIPTION && parts.length > 1) {
    parts.pop();
    text = parts.join(' ');
  }
  return text.length > MAX_DESCRIPTION ? `${text.slice(0, MAX_DESCRIPTION - 1).trimEnd()}…` : text;
}
