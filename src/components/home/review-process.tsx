import { ArrowRight, BadgeCheck, Ban, FileSearch, PenLine, Star, UserCheck, Users } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';
import { Container } from '@/components/ui/container';

const STEPS = [
  { icon: PenLine, status: 'Submitted', tone: 'bg-accent-tint text-accent', title: 'A client writes it', text: 'A signed-in client describes the brief, the work and the outcome, and scores quality, timelines and value for money.' },
  { icon: FileSearch, status: 'In review', tone: 'bg-saffron-tint text-saffron-ink', title: 'Our team reads it', text: 'Nothing goes live until a person on our team has checked it. Each client can review a company only once.' },
  { icon: BadgeCheck, status: 'Published', tone: 'bg-[#e4f3eb] text-success', title: 'It goes on the profile', text: 'Approved reviews appear on the company page with the project budget, timeline and service.' },
  { icon: Star, status: 'Rating updated', tone: 'bg-brand-tint text-brand', title: 'The rating moves', text: 'Rankings weigh the score and how many clients stand behind it, so one glowing review cannot top the list.' },
];

const PROMISES = [
  { icon: Ban, title: 'Money cannot buy a rating', text: 'Paid plans change placement, never scores.' },
  { icon: UserCheck, title: 'Every review read by a person', text: 'No review goes live without a check.' },
  { icon: Users, title: 'One review per client', text: 'And companies cannot review themselves.' },
];

/** How a review travels from a client to a company's rating. */
export function ReviewProcess() {
  return (
    <section className="grain border-y border-line bg-paper-deep py-20 lg:py-28" aria-labelledby="review-process-heading">
      <Container>
        <Reveal className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Review process</p>
            <h2 id="review-process-heading" className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">
              A rating is only worth the reviews behind it.
            </h2>
          </div>
          <div className="lg:pb-1">
            <p className="text-lg leading-relaxed text-ink-soft">
              Every score on Accelfied is worked out from approved client reviews and nothing else. Nobody types one in by hand.
            </p>
            <Link href="/how-reviews-work" className="group mt-4 inline-flex items-center gap-1.5 font-medium text-accent hover:underline">
              How reviews work <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        <ol className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* The track joining the four steps on wide screens. */}
          <span className="process-track absolute top-[34px] right-[12%] left-[12%] hidden h-px lg:block" aria-hidden="true" />
          {STEPS.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 110} className="relative h-full">
              <div className="flex h-full flex-col rounded-[1.5rem] border border-line bg-surface p-6 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="relative z-10 inline-flex size-11 items-center justify-center rounded-full bg-night font-display text-lg font-semibold text-paper ring-[6px] ring-paper-deep">
                    {index + 1}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${step.tone}`}>
                    <step.icon className="size-3.5" aria-hidden="true" />
                    {step.status}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-6 grid gap-px overflow-hidden rounded-[1.5rem] bg-white/10 sm:grid-cols-3">
          {PROMISES.map((item) => (
            <div key={item.title} className="flex items-start gap-4 bg-night p-6 text-paper">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent-soft">
                <item.icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-medium text-white">{item.title}</p>
                <p className="mt-0.5 text-sm text-paper/65">{item.text}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
