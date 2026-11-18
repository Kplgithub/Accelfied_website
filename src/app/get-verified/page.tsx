import {
  ArrowRight,
  BadgeCheck,
  Check,
  FileCheck2,
  Megaphone,
  Mic,
  Sparkles,
  Newspaper,
  ShieldCheck,
  Star,
  TrendingUp,
  Trophy,
  Wallet,
  X,
} from 'lucide-react';
import type { Metadata } from 'next';
import { Reveal } from '@/components/motion/reveal';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { withSeo } from '@/lib/seo';
import { formatPrice, PLAN_COMPARISON, SPONSORED_PLACE, VERIFIED_PLAN, YEARLY_SAVING } from '@/lib/verified-plan';

export async function generateMetadata(): Promise<Metadata> {
  return withSeo('getVerified', {
    title: 'Get Verified',
    description: `Accelfied Verified: the Verified badge, a place above other companies, unlimited reviews and promotion by our team, for ${formatPrice(VERIFIED_PLAN.monthly)} a month or ${formatPrice(VERIFIED_PLAN.yearly)} a year.`,
    alternates: { canonical: '/get-verified' },
  });
}

const START = '/dashboard/company/verified';
const PRICE = formatPrice(VERIFIED_PLAN.monthly);
const YEARLY = formatPrice(VERIFIED_PLAN.yearly);
const SAVING = formatPrice(YEARLY_SAVING);
const SPONSOR_PRICE = formatPrice(SPONSORED_PLACE.monthly);

export default function GetVerifiedPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night text-paper">
        <div className="grid-lines absolute inset-0" aria-hidden="true" />
        <span className="orb -top-24 -left-24 size-[380px] bg-brand/35" aria-hidden="true" />
        <span className="orb -right-24 bottom-0 size-[420px] bg-accent/40 [animation-delay:-6s]" aria-hidden="true" />
        <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <p className="inline-flex animate-rise items-center gap-2 rounded-full bg-white/8 px-3.5 py-1.5 text-sm font-medium text-accent-soft ring-1 ring-white/12">
              <BadgeCheck className="size-4" aria-hidden="true" /> {VERIFIED_PLAN.name}
            </p>
            <h1
              className="mt-6 animate-rise font-display text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.02em] sm:text-6xl"
              style={{ animationDelay: '80ms' }}
            >
              Get checked once. <span className="scribble italic">Win</span> trust every day.
            </h1>
            <p className="mt-6 max-w-xl animate-rise text-lg leading-relaxed text-paper/72" style={{ animationDelay: '160ms' }}>
              Businesses want proof before they hand over a project. With Accelfied Verified, our team checks your company papers, adds the Verified badge to
              your profile, places you above unchecked listings and puts your name in front of more buyers.
            </p>
            <div className="mt-9 flex animate-rise flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: '240ms' }}>
              <ButtonLink href={START} size="lg">
                Verify your business <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <p className="text-paper/70">
                <span className="font-display text-2xl font-semibold text-paper">{PRICE}</span> / month, GST included
                <span className="block text-sm">
                  or {YEARLY} / year (save {SAVING}). Autopay, cancel anytime
                </span>
              </p>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md animate-rise" style={{ animationDelay: '200ms' }} aria-hidden="true">
            <div className="float-y rounded-[1.75rem] bg-surface p-6 text-ink shadow-[0_30px_80px_-30px_rgb(0_0_0/0.55)]">
              <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-accent-tint font-display text-xl font-semibold text-accent">Y</span>
                <div>
                  <p className="flex items-center gap-2 font-display text-xl font-semibold">
                    Your company
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-tint px-2 py-0.5 text-xs font-medium text-brand">
                      <BadgeCheck className="size-3.5" /> Verified
                    </span>
                  </p>
                  <p className="mt-1 flex gap-0.5 text-saffron">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} className="size-4 fill-current" />
                    ))}
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-2.5">
                <span className="block h-2.5 w-full rounded-full bg-line" />
                <span className="block h-2.5 w-4/5 rounded-full bg-line" />
                <span className="block h-2.5 w-3/5 rounded-full bg-line" />
              </div>
              <div className="mt-6 flex gap-2">
                <span className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white">Get a quote</span>
                <span className="rounded-full px-4 py-2 text-sm font-medium ring-1 ring-line-strong">Visit website</span>
              </div>
            </div>
            <div className="absolute -top-5 -right-3 flex items-center gap-2 rounded-2xl bg-surface px-4 py-3 text-sm font-medium text-ink shadow-[var(--shadow-lift)] sm:-right-8">
              <Trophy className="size-4 text-saffron" /> Listed first
            </div>
            <div className="absolute -bottom-5 -left-3 flex items-center gap-2 rounded-2xl bg-surface px-4 py-3 text-sm font-medium text-ink shadow-[var(--shadow-lift)] sm:-left-8">
              <Megaphone className="size-4 text-accent" /> Promoted by our team
            </div>
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-20 lg:py-24">
        <Container className="grid gap-5 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'Proof, not promises', text: 'Show serious buyers that an independent team has looked at your registration and GST papers.' },
            { icon: Trophy, title: 'Stand apart in your city', text: 'The badge separates you from the agencies down the road that nobody has checked.' },
            { icon: TrendingUp, title: 'Be seen first', text: 'Verified companies sit above the rest on every service, city and state page they appear on.' },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 100} className="lift rounded-[var(--radius-card)] border border-line bg-surface p-7">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent-tint text-accent">
                <item.icon className="size-5.5" aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-semibold text-ink">{item.title}</h2>
              <p className="mt-2 leading-relaxed text-ink-soft">{item.text}</p>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Comparison */}
      <section className="grain border-y border-line bg-paper-deep py-20 lg:py-28" aria-labelledby="compare-heading">
        <Container className="max-w-5xl">
          <Reveal className="text-center">
            <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Plans</p>
            <h2 id="compare-heading" className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Free profile vs Accelfied Verified
            </h2>
          </Reveal>
          <Reveal className="mt-12 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-card)]">
            <table className="w-full table-fixed text-left text-[15px]">
              <caption className="sr-only">What each plan includes</caption>
              <colgroup>
                <col />
                <col className="w-[27%] sm:w-[22%]" />
                <col className="w-[30%] sm:w-[24%]" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" className="p-4 align-bottom sm:p-6">
                    <span className="sr-only">Feature</span>
                  </th>
                  <th scope="col" className="border-l border-line bg-paper p-4 text-center align-top sm:p-6">
                    <span className="block font-display text-lg font-semibold text-ink sm:text-xl">Free</span>
                    <span className="mt-1 block text-sm font-normal text-ink-soft">{formatPrice(0)}</span>
                  </th>
                  <th scope="col" className="bg-night p-4 text-center align-top text-paper sm:p-6">
                    <span className="flex items-center justify-center gap-1.5 font-display text-lg font-semibold sm:text-xl">
                      Verified <BadgeCheck className="size-5 text-accent-soft" aria-hidden="true" />
                    </span>
                    <span className="mt-1 block text-sm font-normal text-paper/75">
                      {PRICE}/mo or {YEARLY}/yr
                    </span>
                  </th>
                </tr>
              </thead>
              {PLAN_COMPARISON.map((group) => (
                <tbody key={group.title}>
                  <tr>
                    <th colSpan={3} scope="colgroup" className="border-t border-line bg-accent-tint/60 px-4 py-3 text-sm font-semibold text-accent-strong sm:px-6">
                      {group.title}
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.label} className="border-t border-line">
                      <th scope="row" className="px-4 py-3.5 font-normal text-ink sm:px-6">
                        {row.label}
                      </th>
                      <td className="border-l border-line bg-paper/60 px-2 py-3.5 text-center">
                        <PlanCell value={row.free} />
                      </td>
                      <td className="bg-accent-tint/30 px-2 py-3.5 text-center">
                        <PlanCell value={row.verified} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
            <div className="flex flex-col items-center justify-between gap-4 border-t border-line bg-surface p-6 sm:flex-row">
              <p className="text-ink-soft">
                <span className="font-display text-2xl font-semibold text-ink">{PRICE}</span> per month, or {YEARLY} per year (save {SAVING}), paid by autopay. GST
                included.
              </p>
              <ButtonLink href={START}>
                Verify your business <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Growth support */}
      <section className="py-20 lg:py-28">
        <Container>
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">More than a badge</p>
            <h2 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">Our team works to grow your company</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: Megaphone, title: 'We boost your company', text: 'Our team promotes Verified companies across Accelfied, so more clients see your profile.' },
              { icon: Newspaper, title: 'Blogs that name you', text: 'We write blog posts that feature your company by name, linked to your profile.' },
              { icon: Mic, title: 'Your personal interview', text: 'We interview you about your company and your work, and publish it on Accelfied.' },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 100} className="lift rounded-[var(--radius-card)] border border-line bg-brand-tint p-7">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand text-white">
                  <item.icon className="size-5.5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Sponsored places */}
      <section id="sponsored" className="scroll-mt-24 pb-20 lg:pb-28" aria-labelledby="sponsored-heading">
        <Container>
          <Reveal className="grid items-center gap-10 overflow-hidden rounded-[2rem] border border-saffron/30 bg-saffron-tint/50 p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.16em] text-saffron-ink uppercase">
                <Sparkles className="size-4" aria-hidden="true" /> Add-on
              </p>
              <h2 id="sponsored-heading" className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">
                Sponsored places
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
                Show your company at the top of a directory page, such as web development in Pune, above every other listing. Each page has only{' '}
                {SPONSORED_PLACE.perPage} places, and sponsored companies are always marked &ldquo;Sponsored&rdquo; so clients know.
              </p>
              <p className="mt-6 text-ink-soft">
                <span className="font-display text-3xl font-semibold text-ink">{SPONSOR_PRICE}</span> / month per page, GST included. Works with or without
                Verified.
              </p>
              <ButtonLink href="/dashboard/company/sponsored" className="mt-6">
                Choose a page <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </div>
            <ul className="space-y-3" aria-label="How sponsored places work">
              {[
                'Pick any service, country or city page your company is listed on',
                `First come, first served: at most ${SPONSORED_PLACE.perPage} companies per page`,
                'Cancel any time; your place stays until the paid month ends',
                'A GST invoice for every payment',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-2xl bg-surface px-4 py-3 text-[15px] text-ink shadow-[var(--shadow-card)]">
                  <Check className="mt-0.5 size-4.5 shrink-0 text-success" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* Steps */}
      <section className="grain border-y border-line bg-surface py-20 lg:py-28">
        <Container>
          <Reveal className="text-center">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">How to get Verified</h2>
          </Reveal>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: Wallet, title: 'Join the plan', text: `Start ${VERIFIED_PLAN.name} for ${PRICE} a month from your company dashboard.` },
              { icon: FileCheck2, title: 'Share your documents', text: 'Send your business documents, such as GST and registration, so our team can confirm your company.' },
              { icon: BadgeCheck, title: 'Get your badge', text: 'Once our team confirms your business, the Verified badge goes live and you move above other companies.' },
            ].map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 110} className="rounded-[var(--radius-card)] border border-line bg-paper p-7">
                <span className="font-display text-sm font-semibold text-accent">0{index + 1}</span>
                <step.icon className="mt-3 size-7 text-brand" aria-hidden="true" />
                <h3 className="mt-4 font-display text-2xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{step.text}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-10 text-center">
            <ButtonLink href={START} size="lg">
              Verify your business <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </Reveal>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28">
        <Container className="max-w-3xl">
          <Reveal className="text-center">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Questions</h2>
          </Reveal>
          <Reveal className="mt-10 divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface">
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

      {/* Final call to action */}
      <section className="px-4 pb-20 sm:px-6 lg:pb-28">
        <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-brand px-6 py-14 text-white sm:px-12">
          <span className="orb -top-24 right-10 size-72 bg-white/25" aria-hidden="true" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-3xl leading-tight font-semibold sm:text-5xl">Ready to get Verified?</h2>
              <p className="mt-3 max-w-xl text-lg text-white/80">Show buyers your business is real, checked and ready to take on their project.</p>
            </div>
            <ButtonLink href={START} size="lg" variant="inverse" className="shrink-0">
              Verify your business <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function PlanCell({ value }: { value: boolean | string }) {
  if (value === true)
    return (
      <>
        <Check className="mx-auto size-5 text-success" aria-hidden="true" />
        <span className="sr-only">Included</span>
      </>
    );
  if (value === false)
    return (
      <>
        <X className="mx-auto size-5 text-ink-faint" aria-hidden="true" />
        <span className="sr-only">Not included</span>
      </>
    );
  return <span className="text-sm font-medium text-ink">{value}</span>;
}

const FAQ = [
  {
    q: 'What is Accelfied Verified?',
    a: 'A paid plan for companies. Our team checks your business, and you get the Verified badge, a place above other companies, unlimited reviews and promotion by our team.',
  },
  { q: 'Who should join?', a: 'Any agency, studio or service firm listed on Accelfied that wants more clients to trust and find it.' },
  {
    q: 'What does it cost?',
    a: `${PRICE} a month, or ${YEARLY} a year (save ${SAVING}), with GST already included. Payment is by autopay: Razorpay charges your card at the start of each month or year until you cancel. You get an invoice for every payment, with the GST shown separately.`,
  },
  {
    q: 'What is Premier Verified?',
    a: 'A Verified company with at least 10 published client reviews and an average rating of 4.5 or more gets the Premier Verified badge on its own. It comes from real reviews, so it cannot be bought.',
  },
  {
    q: 'What is a sponsored place?',
    a: `An add-on that shows your company at the top of one directory page for ${SPONSOR_PRICE} a month, GST included. Each page has ${SPONSORED_PLACE.perPage} places and sponsored companies are always labelled.`,
  },
  {
    q: 'How long does verification take?',
    a: 'Usually two working days after we receive your documents. We email you as soon as your badge is live.',
  },
  {
    q: 'What happens if I stop the plan?',
    a: 'Your free profile stays live with all published reviews. The Verified badge, the higher position and the other Verified features end with the plan.',
  },
  { q: 'Can I start with a free profile and upgrade later?', a: 'Yes. List your company for free and join Verified whenever you are ready.' },
];
