import type { Metadata } from 'next';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardList,
  Handshake,
  MailCheck,
  MessageSquareQuote,
  PenLine,
  Scale,
  Search,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';
import { PostCard } from '@/components/blog/post-card';
import { CompanyCard } from '@/components/company/company-card';
import { ClientLogos } from '@/components/home/client-logos';
import { HeroTabs } from '@/components/home/hero-tabs';
import { IndustryGrid } from '@/components/home/industry-grid';
import { LocationExplorer } from '@/components/home/location-explorer';
import { ReviewProcess } from '@/components/home/review-process';
import { ServiceDirectory } from '@/components/home/service-directory';
import { TopRatedShowcase } from '@/components/home/top-rated-showcase';
import { Reveal } from '@/components/motion/reveal';
import { ButtonLink } from '@/components/ui/button';
import { JsonLd } from '@/components/seo/json-ld';
import { Container } from '@/components/ui/container';
import { Stars } from '@/components/ui/stars';
import { getPosts, getRecentReviews, getServiceGroups, getSiteSettings, getTeamPicks, type RecentReview } from '@/lib/data';
import { formatDate, formatRating } from '@/lib/format';
import { getHomeShowcase } from '@/lib/home-showcase';
import { SITE_URL } from '@/lib/site';
import { formatPrice, VERIFIED_PLAN } from '@/lib/verified-plan';

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteSettings();
  return {
    ...(seo.home.title ? { title: { absolute: seo.home.title } } : {}),
    ...(seo.home.description ? { description: seo.home.description } : {}),
    alternates: { canonical: '/' },
  };
}

/** Tells search engines who runs the site and how to search it (sitelinks search box). */
const SITE_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Accelfied',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Accelfied',
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/agencies?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  },
];

export default async function HomePage() {
  const [groups, reviews, picks, posts, showcase] = await Promise.all([
    getServiceGroups(),
    getRecentReviews(6),
    getTeamPicks(),
    getPosts({ limit: 3 }),
    getHomeShowcase(),
  ]);
  const services = groups.flatMap((group) => group.services);
  const popular = services.filter((service) => service.popular);

  return (
    <>
      <JsonLd data={SITE_LD} />
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-night text-paper">
        <div className="grid-lines absolute inset-0" aria-hidden="true" />
        <span className="orb -top-32 -left-24 size-[420px] bg-brand/35" aria-hidden="true" />
        <span className="orb top-1/3 -right-32 size-[460px] bg-accent/40 [animation-delay:-6s]" aria-hidden="true" />
        {/* Sized so the whole hero, shortlist card included, fits a 1366×768 laptop screen under the header. */}
        <Container className="relative grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1fr_minmax(0,540px)] lg:gap-14 lg:py-12 xl:py-14">
          <div>
            <p className="inline-flex animate-rise items-center gap-2 rounded-full bg-white/8 px-3.5 py-1.5 text-sm font-medium text-accent-soft ring-1 ring-white/12">
              <BadgeCheck className="size-4" aria-hidden="true" />
              A real person reads every listing and review before it goes live
            </p>
            <h1
              className="mt-5 animate-rise font-display text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.025em] sm:text-6xl lg:text-[3.5rem] xl:text-[3.9rem]"
              style={{ animationDelay: '80ms' }}
            >
              Find an agency in India that actually <span className="scribble italic">delivers</span>.
            </h1>
            <p className="mt-5 max-w-xl animate-rise text-lg leading-relaxed text-paper/72" style={{ animationDelay: '160ms' }}>
              Compare software developers, app builders, designers and marketing agencies from Jaipur to Bengaluru on what their past clients
              say, what they charge and what they have shipped. Then send one brief to the few that fit.
            </p>
            <ul className="mt-7 hidden animate-rise gap-x-6 gap-y-3 text-[15px] text-paper/85 sm:grid sm:grid-cols-2" style={{ animationDelay: '240ms' }}>
              {['Ratings built only from approved reviews', 'Always free for businesses hiring', 'Checked companies clearly marked', 'One brief, replies from several firms'].map((item) => (
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

      {/* 3. Client logos, uploaded by our team in the admin panel; hidden until there is one. */}
      <ClientLogos heading={showcase.clientLogos.heading} logos={showcase.clientLogos.logos} />

      {/* 4. Service directory */}
      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="Browse by service"
            title="Software, design, marketing and everything in between"
            action={<ArrowLink href="/services">All {services.length} services</ArrowLink>}
          />
          <ServiceDirectory groups={groups} />
        </Container>
      </section>

      {/* 4b. Top rated by category, chosen in the admin panel */}
      <TopRatedShowcase heading={showcase.topRated.heading} categories={showcase.topRated.categories} />

      {/* 5. How it works */}
      <section className="grain border-y border-line bg-paper-deep py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="From a rough idea to a signed partner"
            action={
              <ButtonLink href="/get-matched" size="lg">
                Start your brief <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            }
          />
          <ol className="relative mt-14 grid gap-5 md:grid-cols-3">
            {[
              { icon: ClipboardList, title: 'Say what you need', meta: 'About 2 minutes', text: 'Six short questions on the service, your budget, the timeline and what you are building. No sales call.' },
              { icon: Scale, title: 'Line them up', meta: 'Side by side', text: 'See the companies that fit side by side: approved client reviews, hourly rates, team size and the smallest project each one takes.' },
              { icon: Handshake, title: 'Pick and get going', meta: 'One inbox', text: 'Send your brief, keep every reply in one inbox, and leave an honest review once the work is done.' },
            ].map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 120} className="relative h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface p-7 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:p-8">
                  <span className="pointer-events-none absolute top-5 right-6 font-display text-6xl leading-none font-semibold text-line select-none" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <span className="relative flex size-14 items-center justify-center rounded-2xl bg-brand text-white shadow-[0_14px_30px_-12px_rgb(199_54_47/0.8)] transition-transform duration-300 group-hover:-rotate-6">
                    <step.icon className="size-6" aria-hidden="true" />
                  </span>
                  <p className="relative mt-7 text-xs font-semibold tracking-[0.16em] text-accent uppercase">
                    Step {index + 1} · {step.meta}
                  </p>
                  <h3 className="relative mt-2 font-display text-2xl font-semibold text-ink">{step.title}</h3>
                  <p className="relative mt-3 leading-relaxed text-ink-soft">{step.text}</p>
                </div>
                {index < 2 && (
                  <span className="absolute top-1/2 -right-[14px] z-10 hidden size-7 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface text-ink-faint md:flex" aria-hidden="true">
                    <ArrowRight className="size-3.5" />
                  </span>
                )}
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* 5b. Picked by our team in the admin panel */}
      {picks.length > 0 && (
        <section className="pt-20 lg:pt-28">
          <Container>
            <SectionHeading eyebrow="Featured companies" title="Handpicked by our team" action={<ArrowLink href="/agencies">See all companies</ArrowLink>} />
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

      {/* 7. Get matched band */}
      <section className="px-4 py-20 sm:px-6 lg:py-28">
        <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-brand px-6 py-14 text-white sm:px-12 lg:py-16">
          <span className="orb -top-24 right-10 size-72 bg-white/25" aria-hidden="true" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="text-sm font-semibold tracking-[0.16em] text-white/75 uppercase">Not sure where to start?</p>
              <h2 className="mt-3 font-display text-3xl leading-tight font-semibold sm:text-5xl">Six questions. A shortlist in two minutes.</h2>
              <p className="mt-4 max-w-xl text-lg text-white/80">
                Tell us the service, budget and timeline. We line up the companies that fit, and your brief goes to them only when you say so.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <ButtonLink href="/get-matched" size="lg" variant="inverse">
                Get my shortlist <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/agencies" size="lg" className="bg-white/10 ring-1 ring-white/40 hover:bg-white/20">
                Browse on your own
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 8. How reviews are verified */}
      <ReviewProcess />

      {/* 9. Latest reviews */}
      {reviews.length > 0 && (
        <section className="grain border-y border-line bg-paper-deep py-20 lg:py-28">
          <Container>
            <SectionHeading eyebrow="Latest reviews" title="Straight from the people who hired them" />
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

      {/* 10. Cities, states and countries with live listings */}
      <LocationExplorer />

      {/* 11. Browse by industry */}
      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="Browse by industry"
            title="Teams that already know your industry"
            action={<ArrowLink href="/agencies">All companies</ArrowLink>}
          />
          <IndustryGrid />
        </Container>
      </section>

      {/* 12. For clients and for companies */}
      <section className="pb-20 lg:pb-28">
        <Container className="grid gap-5 lg:grid-cols-2">
          <Reveal className="h-full">
            <AudienceCard
              tone="dark"
              eyebrow="For clients"
              title="Hire knowing what you are getting"
              points={['See approved reviews, rates and team size before you call', 'Send one brief to several companies at once', 'Keep every reply and quote in one dashboard', 'Rate the company once the work is done']}
              cta={{ href: '/get-matched', label: 'Find a company' }}
            />
          </Reveal>
          <Reveal delay={120} className="h-full">
            <AudienceCard
              tone="light"
              eyebrow="For companies"
              title="Let your past work bring the next client"
              points={['A free profile, checked by our team', 'Reviews from clients you have already delivered for', 'Briefs that match the services you offer', 'Your portfolio, rates and team in one place']}
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
              { icon: Building2, title: 'Verified companies', text: 'These firms sent us their GST or registration papers and our team checked them. They carry the badge and sit above unchecked listings.' },
              { icon: UserCheck, title: 'Verified reviews', text: 'Reviews come from signed-in clients and wait in a queue for our team. Only approved ones are shown and counted in a rating.' },
              { icon: MailCheck, title: 'Verified owners', text: 'If someone else listed your company, you claim it with your work email. We confirm you before the listing changes hands.' },
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
              Spotted your company here but never listed it? Open the profile, choose “Claim this company” and confirm with your work email.
              Once our team has checked, the listing is yours to run.
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
                  Five minutes from you saves the next business from a bad hire, and gives a good team the credit it worked for.
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
            <SectionHeading eyebrow="From the blog" title="Cost guides, hiring tips and founder stories" action={<ArrowLink href="/blog">All posts</ArrowLink>} />
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
            <p className="mt-5 text-lg text-ink-soft">Quick answers to what businesses and agencies ask us most.</p>
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
            <h2 className="mx-auto max-w-3xl font-display text-4xl leading-tight font-semibold sm:text-6xl">The team for your next project is a search away.</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-paper/70">Join free, whether you are hiring or getting hired. Sign-up takes under a minute.</p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/join" size="lg">
                Join Accelfied <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/get-matched" size="lg" variant="inverse">
                Get a free shortlist
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

const FAQ = [
  { q: 'Is Accelfied free for businesses that want to hire?', a: 'Yes, completely. Searching, comparing, sending briefs and writing reviews cost nothing.' },
  {
    q: 'Which cities and states in India do you cover?',
    a: 'All of them. Any company in India can list for free, and every city and state with listed companies gets its own page, such as web development in Jaipur or SEO in Pune.',
  },
  {
    q: 'How much does it cost to hire an agency in India?',
    a: 'It depends on the work, the size of the team and the city. Each profile shows the company’s hourly rate band and the smallest project it takes, and our free calculators give a rough budget for websites, apps, software, online stores and marketing.',
  },
  {
    q: 'How do you check reviews?',
    a: 'Reviews come from signed-in accounts and wait for our team before they go live. A client can review each company once, and companies cannot review themselves.',
  },
  {
    q: 'How are companies ranked?',
    a: 'Verified companies come first. Within each group, companies are ranked by their approved client reviews, weighing both the average score and how many clients stand behind it. Nobody can pay to change a rating.',
  },
  {
    q: 'What happens after I list my company?',
    a: 'You will see “Verifying your details” while our team checks the listing, usually within two working days. Once approved, your free profile goes live. To earn the Verified badge and a place above other companies, join the Verified plan.',
  },
  {
    q: 'Someone else listed my company. What can I do?',
    a: 'Open the profile and choose “Claim this company”. Confirm with your work email on the company domain, and our team will move the listing to your account after checking.',
  },
  {
    q: 'What does the Verified plan cost?',
    a: `${formatPrice(VERIFIED_PLAN.monthly)} a month or ${formatPrice(VERIFIED_PLAN.yearly)} a year by autopay, GST included. It adds the Verified badge, a place above other companies, unlimited reviews, promotion by our team, a blog about your company and a published interview.`,
  },
  { q: 'Can I sign in with Google or LinkedIn?', a: 'Yes. You can join or log in with Google, LinkedIn or your work email and a password.' },
];

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
