import { ArrowRight, ArrowUpRight, Eye, ShieldCheck, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { CompanyCard } from '@/components/company/company-card';
import { GroupIcon } from '@/components/home/group-icon';
import { HeroSearch } from '@/components/home/hero-search';
import { JourneyIllustration } from '@/components/home/journey-illustration';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { getFeaturedCompanies, getServiceGroups, getStats } from '@/lib/data';
import { formatCount } from '@/lib/format';

export default async function HomePage() {
  const [groups, stats, featured] = await Promise.all([getServiceGroups(), getStats(), getFeaturedCompanies()]);
  const popular = groups.flatMap((group) => group.services.filter((service) => service.popular)).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="grain overflow-hidden border-b border-line">
        <Container className="grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <p className="animate-rise text-sm font-semibold tracking-[0.16em] text-brand uppercase">
              Agencies, studios &amp; service firms
            </p>
            <h1
              className="mt-4 animate-rise font-display text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.025em] text-ink sm:text-6xl lg:text-[4.4rem]"
              style={{ animationDelay: '80ms' }}
            >
              Hire the partner your project <span className="scribble italic">deserves</span>.
            </h1>
            <p
              className="mt-6 max-w-xl animate-rise text-lg leading-relaxed text-ink-soft"
              style={{ animationDelay: '160ms' }}
            >
              Compare companies by what their clients say, what they charge and the projects they take on. Then ask
              the right ones for a quote.
            </p>
            <div className="mt-9 max-w-3xl animate-rise" style={{ animationDelay: '240ms' }}>
              <HeroSearch groups={groups} />
            </div>
            {popular.length > 0 && (
              <div className="mt-6 flex animate-rise flex-wrap items-center gap-2" style={{ animationDelay: '320ms' }}>
                <span className="mr-1 text-sm text-ink-faint">Popular:</span>
                {popular.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/agencies/${service.slug}`}
                    className="rounded-full border border-line-strong bg-surface/70 px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent"
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="hidden lg:block">
            <JourneyIllustration />
          </div>
        </Container>
      </section>

      {/* Real numbers only, and only once there is something to show. */}
      {stats.companies > 0 && (
        <section aria-label="Directory size" className="border-b border-line bg-surface">
          <Container className="flex flex-wrap items-center justify-center gap-x-12 gap-y-3 py-6 text-center">
            <Stat value={stats.companies} label={stats.companies === 1 ? 'company listed' : 'companies listed'} />
            <Stat value={stats.reviews} label={stats.reviews === 1 ? 'published client review' : 'published client reviews'} />
          </Container>
        </section>
      )}

      {/* Browse by category */}
      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="Browse"
            title="Every kind of partner, in one place"
            action={
              <Link href="/services" className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline">
                All services <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            }
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <div
                key={group.slug}
                className="group rounded-[var(--radius-card)] border border-line bg-surface p-6 transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-tint text-accent transition-colors duration-300 group-hover:bg-brand group-hover:text-paper">
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
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="grain border-y border-line bg-paper-deep py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="How it works" title="From brief to signed partner, without the guesswork" />
          <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {[
              {
                title: 'Browse',
                text: 'Filter companies by service, location, budget and hourly rate. Every profile shows what the company actually focuses on.',
              },
              {
                title: 'Compare',
                text: 'Read detailed reviews from past clients: the brief, the work, the results and how the team handled it.',
              },
              {
                title: 'Decide',
                text: 'Shortlist the best fits and send one brief to get quotes. You stay in control of who contacts you.',
              },
            ].map((step, index) => (
              <li key={step.title} className="relative border-t-2 border-ink pt-6">
                <span className="font-display text-sm font-semibold text-brand">0{index + 1}</span>
                <h3 className="mt-2 font-display text-3xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {featured.length > 0 && (
        <section className="py-20 lg:py-28">
          <Container>
            <SectionHeading
              eyebrow="Highly rated"
              title="Companies clients keep recommending"
              action={
                <Link href="/agencies?sort=rating" className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline">
                  See all <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              }
            />
            <div className="mt-12 grid gap-5">
              {featured.slice(0, 4).map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Trust */}
      <section className="py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Why trust these reviews</p>
            <h2 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">
              A rating is only worth the reviews behind it.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Every score on Accelfied is calculated from published client reviews and nothing else. No paid placements
              in ratings, no numbers typed in by hand.
            </p>
            <Link href="/how-reviews-work" className="mt-6 inline-flex items-center gap-1.5 font-medium text-accent hover:underline">
              How reviews work <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: UserCheck, title: 'Real clients only', text: 'Each review is checked by our team before it goes live.' },
              { icon: ShieldCheck, title: 'One voice per client', text: 'A client can review a company once, so no one can stack the score.' },
              { icon: Eye, title: 'Full project context', text: 'Budget, timeline and service sit next to every review.' },
              { icon: ArrowUpRight, title: 'Ranked on merit', text: 'Ordering weighs both the rating and how many clients stand behind it.' },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
                <Icon className="size-6 text-accent" aria-hidden="true" />
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Dual call to action */}
      <section className="pb-20 lg:pb-28">
        <Container className="grid gap-5 lg:grid-cols-2">
          <div className="grain overflow-hidden rounded-[2rem] bg-night p-8 text-paper sm:p-12">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Have a project in mind?</h2>
            <p className="mt-3 max-w-md text-paper/70">
              Tell us what you need once. We will put your brief in front of companies that fit your budget and timeline.
            </p>
            <ButtonLink href="/get-a-quote" size="lg" className="mt-8">
              Get a quote <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <div className="grain overflow-hidden rounded-[2rem] border border-line bg-saffron-tint p-8 sm:p-12">
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Run an agency?</h2>
            <p className="mt-3 max-w-md text-ink-soft">
              List your company for free, invite past clients to review you, and get found by people ready to hire.
            </p>
            <ButtonLink href="/get-listed" size="lg" className="mt-8">
              Get listed <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <p className="text-ink-soft">
      <span className="mr-2 font-display text-2xl font-semibold text-ink">{formatCount(value)}</span>
      {label}
    </p>
  );
}

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">{eyebrow}</p>
        <h2 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
