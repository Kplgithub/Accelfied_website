import { ArrowRight, Bookmark, ClipboardList, Handshake, MessagesSquare, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui/button';

const STEPS = [
  { icon: ClipboardList, title: 'Tell us about your project', text: 'Seven quick questions: what you need, your budget and when.' },
  { icon: Sparkles, title: 'See the companies that fit', text: 'We match your brief against real reviews, rates and locations.' },
  { icon: Handshake, title: 'Pick your favourites', text: 'Save them here, compare side by side and message the best ones.' },
];

/** The empty shortlist: how matching works, with both ways to start. */
export function ShortlistHowItWorks() {
  return (
    <section className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-card)]">
      <div className="grid gap-6 bg-gradient-to-br from-accent-tint via-surface to-surface p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div>
          <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-accent text-white">
            <Bookmark className="size-5" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-display text-2xl font-semibold text-ink sm:text-3xl">Your shortlist is empty</h2>
          <p className="mt-2 max-w-xl text-ink-soft">Save companies as you browse, or let us build a shortlist for you from a short brief. Either way, it is free.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/get-matched">Get matched</ButtonLink>
          <ButtonLink href="/agencies" variant="secondary">
            Browse companies
          </ButtonLink>
        </div>
      </div>
      <div className="border-t border-line p-6 sm:p-8">
        <h3 className="text-xs font-semibold tracking-[0.16em] text-ink-faint uppercase">How matching works</h3>
        <ol className="mt-5 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative rounded-2xl border border-line bg-paper/60 p-5 animate-rise" style={{ animationDelay: `${index * 90}ms` }}>
              <span className="absolute top-4 right-4 font-display text-3xl font-semibold text-ink/10 tabular-nums">{index + 1}</span>
              <step.icon className="size-6 text-accent" aria-hidden="true" />
              <p className="mt-3 font-medium text-ink">{step.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** A client with no conversations yet: two ways to find someone to talk to. */
export function NoMessagesYet() {
  return (
    <section className="rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface px-6 py-12 text-center sm:py-16">
      <span className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-accent-tint">
        <MessagesSquare className="size-8 text-accent" aria-hidden="true" />
      </span>
      <h2 className="mt-5 font-display text-2xl font-semibold text-ink">No messages yet</h2>
      <p className="mx-auto mt-2 max-w-md text-ink-soft">When you write to a company or send a brief, their replies show up here, all in one place.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/agencies">
          <Search className="size-4" aria-hidden="true" />
          Find a company
        </ButtonLink>
      </div>
      <p className="mt-4 text-sm text-ink-soft">
        Not sure where to start?{' '}
        <Link href="/get-matched" className="group inline-flex items-center gap-1 font-medium text-accent hover:underline">
          Get matched with companies
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </p>
    </section>
  );
}
