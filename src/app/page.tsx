import type { Metadata } from 'next';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardList,
  FileSearch,
  Handshake,
  MailCheck,
  MapPin,
  MessageSquareQuote,
  PenLine,
  Scale,
  Search,
  Star,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';
import { PostCard } from '@/components/blog/post-card';
import { CompanyCard } from '@/components/company/company-card';
import { GroupIcon } from '@/components/home/group-icon';
import { HeroTabs } from '@/components/home/hero-tabs';
import { TabbedPanels } from '@/components/home/tabbed-panels';
import { CountUp } from '@/components/motion/count-up';
import { Reveal } from '@/components/motion/reveal';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Stars } from '@/components/ui/stars';
import { countryName } from '@/lib/countries';
import { getCountryFacets, getFeaturedCompanies, getPosts, getRecentReviews, getServiceGroups, getSiteSettings, getStats, getTeamPicks, type RecentReview } from '@/lib/data';
import { formatDate, formatRating } from '@/lib/format';
import { INDUSTRIES } from '@/lib/labels';
import type { CompanySummary, ServiceGroup } from '@/lib/types';

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteSettings();
  return {
    ...(seo.home.title ? { title: { absolute: seo.home.title } } : {}),
    ...(seo.home.description ? { description: seo.home.description } : {}),
    alternates: { canonical: '/' },
  };
}

export default async function HomePage() {
  const [groups, stats, featured, reviews, countries, picks, posts] = await Promise.all([
    getServiceGroups(),
    getStats(),
    getFeaturedCompanies(12),
    getRecentReviews(6),
    getCountryFacets(),
    getTeamPicks(),
    getPosts({ limit: 3 }),
  ]);
  const services = groups.flatMap((group) => group.services);
  const popular = services.filter((service) => service.popular);

  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-night text-paper">
        <div className="grid-lines absolute inset-0" aria-hidden="true" />
        <span className="orb -top-32 -left-24 size-[420px] bg-brand/35" aria-hidden="true" />
        <span className="orb top-1/3 -right-32 size-[460px] bg-accent/40 [animation-delay:-6s]" aria-hidden="true" />
        <Container className="relative grid items-start gap-12 py-14 md:py-20 lg:grid-cols-[1fr_minmax(0,560px)] lg:gap-14 lg:py-24">
          <div className="lg:pt-6">
            <p className="inline-flex animate-rise items-center gap-2 rounded-full bg-white/8 px-3.5 py-1.5 text-sm font-medium text-accent-soft ring-1 ring-white/12">
              <BadgeCheck className="size-4" aria-hidden="true" />
              Every listing and review is checked by our team
            </p>
            <h1
              className="mt-6 animate-rise font-display text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.025em] sm:text-6xl lg:text-[4.2rem]"
              style={{ animationDelay: '80ms' }}
            >
              Hire a company you can <span className="scribble italic">trust</span> with your project.
            </h1>
            <p className="mt-6 max-w-xl animate-rise text-lg leading-relaxed text-paper/72" style={{ animationDelay: '160ms' }}>
              Compare agencies, studios and service firms by verified client reviews, real rates and the work they have done.
              Then send one brief to the ones that fit.
            </p>
            <ul className="mt-8 hidden animate-rise gap-3 text-[15px] text-paper/85 sm:grid sm:grid-cols-2" style={{ animationDelay: '240ms' }}>
              {['Ratings from published reviews only', 'Free for clients', 'Verified companies marked clearly', 'One brief, many quotes'].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4.5 shrink-0 text-accent-soft" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-rise" style={{ animationDelay: '200ms' }}>
            <HeroTabs groups={groups} />
          </div>
        </Container>
      </section>

      {/* 2. Popular searches */}
      {popular.length > 0 && (
        <section aria-label="Popular searches" className="overflow-hidden border-b border-line bg-surface py-5">
          <div className="flex w-max gap-3 marquee">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 gap-3" aria-hidden={copy === 1 || undefined}>
                {popular.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/agencies/${service.slug}`}
                      tabIndex={copy === 1 ? -1 : undefined}
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm whitespace-nowrap text-ink-soft transition-colors hover:border-accent hover:text-accent"
                    >
                      <Search className="size-3.5" aria-hidden="true" />
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </section>
      )}

      {/* 3. Live numbers, straight from the directory */}
      <section aria-label="Accelfied in numbers" className="border-b border-line bg-paper">
        <Container className="grid grid-cols-2 gap-6 py-12 text-center md:grid-cols-4">
          {[
            { value: stats.companies, label: stats.companies === 1 ? 'company listed' : 'companies listed' },
            { value: stats.reviews, label: stats.reviews === 1 ? 'published review' : 'published reviews' },
            { value: services.length, label: 'services covered' },
            { value: groups.length, label: 'service categories' },
          ].map((stat, index) => (
            <Reveal key={stat.label} delay={index * 80}>
              <p className="font-display text-4xl font-semibold text-ink tabular-nums sm:text-5xl">
                <CountUp value={stat.value} />
              </p>
              <p className="mt-1 text-sm text-ink-soft">{stat.label}</p>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* 4. Service directory */}
      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="Browse by service"
            title="Every kind of partner, in one place"
            action={<ArrowLink href="/services">All {services.length} services</ArrowLink>}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group, index) => (
              <Reveal key={group.slug} delay={(index % 3) * 90}>
                <ServiceGroupCard group={group} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. How it works */}
      <section className="grain border-y border-line bg-paper-deep py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="How it works" title="From brief to signed partner in three steps" />
          <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {[
              { icon: ClipboardList, title: 'Tell us what you need', text: 'Answer six quick questions about the service, budget, timeline and project. It takes about two minutes.' },
              { icon: Scale, title: 'Compare the fits', text: 'See matching companies side by side: verified reviews, hourly rates, team size and minimum project size.' },
              { icon: Handshake, title: 'Hire with confidence', text: 'Send your brief, follow every reply in your dashboard and review the company when the work is done.' },
            ].map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 120} className="relative">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-surface text-brand shadow-[var(--shadow-card)]">
                  <step.icon className="size-6" aria-hidden="true" />
                </span>
                <span className="mt-6 block font-display text-sm font-semibold text-accent">Step 0{index + 1}</span>
                <h3 className="mt-1 font-display text-2xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{step.text}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-12">
            <ButtonLink href="/get-matched" size="lg">
              Start your brief <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </Reveal>
        </Container>
      </section>

      {/* 5b. Picked by our team in the admin panel */}
      {picks.length > 0 && (
        <section className="pt-20 lg:pt-28">
          <Container>
            <SectionHeading eyebrow="Featured companies" title="Picked by the Accelfied team" action={<ArrowLink href="/agencies">See all companies</ArrowLink>} />
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {picks.slice(0, 6).map((company, index) => (
                <Reveal key={company.id} delay={(index % 3) * 90} className="h-full">
                  <CompanyCard company={company} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 6. Top rated companies */}
      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="Top rated"
            title="Companies clients keep recommending"
            action={<ArrowLink href="/agencies?sort=rating">See all companies</ArrowLink>}
          />
          <div className="mt-10">
            {featured.length > 0 ? (
              <TabbedPanels label="Top rated companies by category" tabs={companyTabs(featured, groups)} />
            ) : (
              <Reveal className="rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface p-8 text-center sm:p-12">
                <Star className="mx-auto size-8 text-saffron" aria-hidden="true" />
                <h3 className="mt-4 font-display text-2xl font-semibold text-ink">Ratings appear as clients publish reviews</h3>
                <p className="mx-auto mt-2 max-w-md text-ink-soft">
                  We only rank companies on real, verified client reviews. Worked with an agency recently? Your review helps others choose.
                </p>
                <ButtonLink href="/write-a-review" className="mt-6">
                  Write a review
                </ButtonLink>
              </Reveal>
            )}
          </div>
        </Container>
      </section>

      {/* 7. Get matched band */}
      <section className="px-4 sm:px-6">
        <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-brand px-6 py-14 text-white sm:px-12 lg:py-16">
          <span className="orb -top-24 right-10 size-72 bg-white/25" aria-hidden="true" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="text-sm font-semibold tracking-[0.16em] text-white/75 uppercase">Not sure where to start?</p>
              <h2 className="mt-3 font-display text-3xl leading-tight font-semibold sm:text-5xl">Answer six questions. Get a shortlist.</h2>
              <p className="mt-4 max-w-xl text-lg text-white/80">
                Tell us the service, budget and timeline. We show the companies that fit and pass your brief to them when you say so.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <ButtonLink href="/get-matched" size="lg" variant="inverse">
                Get matched <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/agencies" size="lg" className="bg-white/10 ring-1 ring-white/40 hover:bg-white/20">
                Browse on your own
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 8. How reviews are verified */}
      <section className="py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Review process</p>
            <h2 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">
              A rating is only worth the reviews behind it.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Every score on Accelfied is calculated from published client reviews and nothing else. No paid placements in ratings, no
              numbers typed in by hand.
            </p>
            <ArrowLink href="/how-reviews-work" className="mt-6">
              How reviews work
            </ArrowLink>
          </Reveal>
          <ol className="relative space-y-4 before:absolute before:top-6 before:bottom-6 before:left-[27px] before:w-px before:bg-line-strong">
            {[
              { icon: PenLine, title: 'A client writes a review', text: 'Signed-in clients share the brief, the work, the results and scores for quality, schedule and cost.' },
              { icon: FileSearch, title: 'Waiting for review to be published', text: 'Our team checks every review before it goes live. One client can review a company only once.' },
              { icon: BadgeCheck, title: 'Published and marked verified', text: 'Approved reviews appear on the company profile with project budget, timeline and service.' },
              { icon: Star, title: 'The rating updates', text: 'Rankings weigh both the score and how many clients stand behind it, so a single review cannot top the list.' },
            ].map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 100} className="relative flex gap-5 rounded-[var(--radius-card)] border border-line bg-surface p-5">
                <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent ring-4 ring-paper">
                  <step.icon className="size-5.5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* 9. Latest reviews */}
      {reviews.length > 0 && (
        <section className="grain border-y border-line bg-paper-deep py-20 lg:py-28">
          <Container>
            <SectionHeading eyebrow="Latest reviews" title="What clients are saying right now" />
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review, index) => (
                <Reveal key={review.id} delay={(index % 3) * 90} className="h-full">
                  <RecentReviewCard review={review} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 10. Browse by location */}
      {countries.length > 0 && (
        <section className="py-20 lg:py-28">
          <Container>
            <SectionHeading eyebrow="Browse by location" title="Find a partner near you, or anywhere" action={<ArrowLink href="/agencies">All locations</ArrowLink>} />
            <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {countries.slice(0, 12).map((country, index) => (
                <Reveal as="li" key={country.countryCode} delay={(index % 4) * 60}>
                  <Link
                    href={`/agencies?country=${country.countryCode}`}
                    className="lift flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-5 py-4"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <MapPin className="size-4.5 shrink-0 text-accent" aria-hidden="true" />
                      <span className="truncate font-medium text-ink">{countryName(country.countryCode)}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-paper px-2.5 py-0.5 text-sm text-ink-soft tabular-nums">{country.count}</span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* 11. Browse by industry */}
      <section className={`py-20 lg:py-28 ${countries.length > 0 ? 'pt-0 lg:pt-0' : ''}`}>
        <Container>
          <SectionHeading eyebrow="Browse by industry" title="Partners who know your market" />
          <Reveal className="mt-10 flex flex-wrap gap-2.5">
            {INDUSTRIES.filter((industry) => industry !== 'Other').map((industry) => (
              <Link
                key={industry}
                href={`/agencies?industry=${encodeURIComponent(industry)}`}
                className="rounded-full border border-line-strong bg-surface px-4 py-2 text-[15px] text-ink-soft transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                {industry}
              </Link>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* 12. For clients and for companies */}
      <section className="pb-20 lg:pb-28">
        <Container className="grid gap-5 lg:grid-cols-2">
          <Reveal className="h-full">
            <AudienceCard
              tone="dark"
              eyebrow="For clients"
              title="Hire with the full picture"
              points={['Compare verified reviews, rates and team size', 'Send one brief to several companies', 'Track every reply in your dashboard', 'Review the company when the work is done']}
              cta={{ href: '/get-matched', label: 'Find a company' }}
            />
          </Reveal>
          <Reveal delay={120} className="h-full">
            <AudienceCard
              tone="light"
              eyebrow="For companies"
              title="Win work on your reputation"
              points={['Free listing, checked and marked verified', 'Collect reviews from past clients', 'Receive briefs that match your services', 'Show your portfolio and rates']}
              cta={{ href: '/join?as=provider', label: 'List your company' }}
            />
          </Reveal>
        </Container>
      </section>

      {/* 13. What verified means */}
      <section className="grain border-y border-line bg-surface py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="The Verified badge" title="What “Verified” means on Accelfied" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: Building2, title: 'Verified companies', text: 'Companies on Accelfied Verified pass a document check by our team. They carry the badge and are listed above other companies.' },
              { icon: UserCheck, title: 'Verified reviews', text: 'Reviews come from signed-in clients and wait for our team. Only approved reviews are published and counted in ratings.' },
              { icon: MailCheck, title: 'Verified owners', text: 'If someone else listed your company, you claim it with your work email. We confirm the request before handing it over.' },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 100} className="lift rounded-[var(--radius-card)] border border-line bg-paper p-7">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent text-white">
                  <item.icon className="size-5.5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 14. Claim your company */}
      <section className="py-20 lg:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Already listed?</p>
            <h2 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">Claim your company profile</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Found your company on Accelfied but did not list it yourself? Open its profile, choose “Claim this company” and confirm with
              your work email. Once our team verifies you, it is yours to manage.
            </p>
            <ButtonLink href="/agencies" variant="secondary" size="lg" className="mt-8">
              Find your company <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </Reveal>
          <ol className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { title: 'Find your profile', text: 'Search the directory for your company.' },
              { title: 'Confirm with work email', text: 'Use your address on the company domain.' },
              { title: 'We verify, you manage', text: 'The listing moves to your account.' },
            ].map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 110} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand font-display text-lg font-semibold text-white">{index + 1}</span>
                <div>
                  <p className="font-medium text-ink">{step.title}</p>
                  <p className="text-sm text-ink-soft">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* 15. Write a review */}
      <section className="px-4 sm:px-6">
        <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-accent px-6 py-14 text-white sm:px-12 lg:py-16">
          <span className="orb -bottom-28 -left-10 size-80 bg-accent-soft/50" aria-hidden="true" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-5">
              <MessageSquareQuote className="hidden size-12 shrink-0 text-white/80 sm:block" aria-hidden="true" />
              <div>
                <h2 className="font-display text-3xl leading-tight font-semibold sm:text-4xl">Worked with an agency lately?</h2>
                <p className="mt-3 max-w-xl text-lg text-white/80">
                  Your honest review helps the next client choose well, and helps good companies get the credit they earned.
                </p>
              </div>
            </div>
            <ButtonLink href="/write-a-review" size="lg" variant="inverse" className="shrink-0">
              Write a review <PenLine className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Reveal>
      </section>

      {/* 15b. From the blog */}
      {posts.items.length > 0 && (
        <section className="pt-20 lg:pt-28">
          <Container>
            <SectionHeading eyebrow="From the blog" title="Stories and interviews from the people behind the work" action={<ArrowLink href="/blog">All posts</ArrowLink>} />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.items.map((post, index) => (
                <Reveal key={post.slug} delay={index * 90} className="h-full">
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 16. FAQ */}
      <section className="py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Questions</p>
            <h2 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">Good to know</h2>
            <p className="mt-5 text-lg text-ink-soft">The short answers to what people ask us most.</p>
          </Reveal>
          <Reveal className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface">
            {FAQ.map((item) => (
              <details key={item.q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
                  {item.q}
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-paper text-ink-soft transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-ink-soft">{item.a}</p>
              </details>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* 17. Final call to action */}
      <section className="relative overflow-hidden bg-night py-20 text-paper lg:py-28">
        <div className="grid-lines absolute inset-0" aria-hidden="true" />
        <span className="orb -top-20 left-1/4 size-96 bg-accent/35" aria-hidden="true" />
        <span className="orb -bottom-32 right-1/4 size-96 bg-brand/30 [animation-delay:-8s]" aria-hidden="true" />
        <Container className="relative text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl font-display text-4xl leading-tight font-semibold sm:text-6xl">Your next great partner is already here.</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-paper/70">Join free as a client or as a company. It takes less than a minute.</p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/join" size="lg">
                Join Accelfied <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/get-matched" size="lg" variant="inverse">
                Get matched
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

const FAQ = [
  { q: 'Is Accelfied free for clients?', a: 'Yes. Browsing companies, sending briefs and writing reviews are free for clients.' },
  {
    q: 'How do you check reviews?',
    a: 'Reviews come from signed-in accounts and wait for our team before they are published. A client can review each company once, and companies cannot review themselves.',
  },
  {
    q: 'How are companies ranked?',
    a: 'Verified companies are listed first. Within each group, companies are ranked by their published client reviews, weighing both the average score and how many clients stand behind it. Nobody can pay to change a rating.',
  },
  {
    q: 'What happens after I list my company?',
    a: 'You will see “Verifying your details” while our team checks the listing, usually within two working days. Once approved, your free profile goes live. To earn the Verified badge and a place above other companies, join Accelfied Verified.',
  },
  {
    q: 'Someone else listed my company. What can I do?',
    a: 'Open the profile and choose “Claim this company”. Confirm with your work email on the company domain, and our team will move the listing to your account after checking.',
  },
  {
    q: 'What does Accelfied Verified cost?',
    a: '₹599 a month plus GST. It adds the Verified badge, a place above other companies, unlimited reviews, promotion by our team, a blog about your company and a published interview.',
  },
  { q: 'Can I sign in with Google or LinkedIn?', a: 'Yes. You can join or log in with Google, LinkedIn or your work email and a password.' },
];

function companyTabs(companies: CompanySummary[], groups: ServiceGroup[]) {
  const groupOf = new Map(groups.flatMap((group) => group.services.map((service) => [service.slug, group] as const)));
  const grid = (list: CompanySummary[]) => (
    <div className="grid gap-5">
      {list.slice(0, 4).map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
  const tabs = [{ id: 'all', label: 'All categories', content: grid(companies) }];
  for (const group of groups) {
    const inGroup = companies.filter((company) => company.services[0] && groupOf.get(company.services[0].slug)?.slug === group.slug);
    if (inGroup.length) tabs.push({ id: group.slug, label: group.name, content: grid(inGroup) });
  }
  return tabs;
}

function ServiceGroupCard({ group }: { group: ServiceGroup }) {
  return (
    <div className="group lift h-full rounded-[var(--radius-card)] border border-line bg-surface p-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-tint text-accent transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
          <GroupIcon slug={group.slug} className="size-5" />
        </span>
        <h3 className="font-display text-xl font-semibold text-ink">{group.name}</h3>
      </div>
      <ul className="mt-5 space-y-1">
        {group.services.slice(0, 5).map((service) => (
          <li key={service.slug}>
            <Link
              href={`/agencies/${service.slug}`}
              className="flex items-center justify-between rounded-lg py-1.5 text-[15px] text-ink-soft transition-colors hover:text-accent"
            >
              {service.name}
              <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-60" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
      {group.services.length > 5 && (
        <Link href={`/services#${group.slug}`} className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
          +{group.services.length - 5} more
        </Link>
      )}
    </div>
  );
}

function RecentReviewCard({ review }: { review: RecentReview }) {
  const quote = review.content.results || review.content.solution || review.content.challenge;
  return (
    <article className="lift flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold text-ink">{formatRating(review.ratings.overall)}</span>
          <Stars value={review.ratings.overall} />
        </span>
        {review.verified && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
            <BadgeCheck className="size-3.5" aria-hidden="true" /> Verified
          </span>
        )}
      </div>
      <h3 className="mt-4 font-display text-lg leading-snug font-semibold text-ink">{review.project.title}</h3>
      <p className="mt-2 line-clamp-4 flex-1 text-[15px] leading-relaxed text-ink-soft">“{quote}”</p>
      <div className="mt-5 border-t border-line pt-4 text-sm">
        <p className="font-medium text-ink">{review.reviewer.name ?? 'Name withheld'}</p>
        <p className="text-ink-soft">
          {review.reviewer.jobTitle}
          {review.reviewer.companyName && `, ${review.reviewer.companyName}`}
        </p>
        <p className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <Link href={`/profile/${review.company.slug}#reviews`} className="font-medium text-accent hover:underline">
            Review of {review.company.name}
          </Link>
          {review.publishedAt && <span className="text-xs text-ink-faint">{formatDate(review.publishedAt)}</span>}
        </p>
      </div>
    </article>
  );
}

function AudienceCard({
  tone,
  eyebrow,
  title,
  points,
  cta,
}: {
  tone: 'dark' | 'light';
  eyebrow: string;
  title: string;
  points: string[];
  cta: { href: string; label: string };
}) {
  const dark = tone === 'dark';
  return (
    <div className={`grain h-full overflow-hidden rounded-[2rem] p-8 sm:p-12 ${dark ? 'bg-night text-paper' : 'border border-line bg-brand-tint text-ink'}`}>
      <p className={`text-sm font-semibold tracking-[0.16em] uppercase ${dark ? 'text-accent-soft' : 'text-brand'}`}>{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{title}</h2>
      <ul className="mt-6 space-y-3">
        {points.map((point) => (
          <li key={point} className={`flex items-start gap-3 ${dark ? 'text-paper/80' : 'text-ink-soft'}`}>
            <CheckCircle2 className={`mt-0.5 size-5 shrink-0 ${dark ? 'text-accent-soft' : 'text-brand'}`} aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>
      <ButtonLink href={cta.href} size="lg" variant={dark ? 'inverse' : 'primary'} className="mt-8">
        {cta.label} <ArrowRight className="size-4" aria-hidden="true" />
      </ButtonLink>
    </div>
  );
}

function ArrowLink({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-1.5 font-medium text-accent hover:underline ${className}`}>
      {children}
      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">{eyebrow}</p>
        <h2 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">{title}</h2>
      </div>
      {action}
    </Reveal>
  );
}
