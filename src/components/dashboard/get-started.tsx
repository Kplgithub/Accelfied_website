import { ArrowRight, BadgeCheck, Images, Medal, MessageSquareQuote, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';
import type { OwnedCompany } from '@/lib/types';

interface StartCard {
  href: string;
  icon: LucideIcon;
  title: string;
  text: string;
  cta: string;
  /** Card colours: a soft tint with a matching icon tile. */
  tone: string;
  tile: string;
}

/** Three big next steps at the top of a company's dashboard. Each one moves the company up the directory. */
export function GetStarted({ company }: { company: OwnedCompany }) {
  const cards: StartCard[] = [
    company.verified
      ? {
          href: '/dashboard/company/badge',
          icon: Medal,
          title: 'Show your Verified badge',
          text: 'Add it to your website so visitors can check your reviews in one click.',
          cta: 'Get badge',
          tone: 'from-accent-tint via-surface to-surface',
          tile: 'bg-accent text-white',
        }
      : {
          href: '/dashboard/company/verified',
          icon: BadgeCheck,
          title: 'Get Verified',
          text: 'Verified companies carry a trust badge and rank above unverified ones.',
          cta: 'Verify now',
          tone: 'from-accent-tint via-surface to-surface',
          tile: 'bg-accent text-white',
        },
    {
      href: '/dashboard/company/reviews/request',
      icon: MessageSquareQuote,
      title: 'Request a client review',
      text: 'Reviews from real clients build trust and lift your place in every list.',
      cta: 'Request now',
      tone: 'from-brand-tint via-surface to-surface',
      tile: 'bg-brand text-white',
    },
    {
      href: '/dashboard/company/portfolio',
      icon: Images,
      title: 'Add a portfolio project',
      text: 'Show your best work so clients can judge it before they call you.',
      cta: 'Add project',
      tone: 'from-saffron-tint via-surface to-surface',
      tile: 'bg-night text-paper',
    },
  ];
  return (
    <section aria-labelledby="get-started" className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
      <h2 id="get-started" className="font-display text-xl font-semibold text-ink">
        Get started
      </h2>
      <p className="mt-1 text-sm text-ink-soft">Three steps that build trust with clients and move you up the directory.</p>
      <ul className="mt-5 grid gap-4 md:grid-cols-3">
        {cards.map((card, index) => (
          <Reveal as="li" key={card.href} delay={index * 70}>
            <Link
              href={card.href}
              className={`group flex h-full flex-col rounded-2xl border border-line bg-gradient-to-br ${card.tone} p-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow-lift)]`}
            >
              <span className={`flex size-11 items-center justify-center rounded-xl ${card.tile} transition-transform duration-300 group-hover:scale-105`}>
                <card.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="mt-4 block font-display text-lg font-semibold text-ink">{card.title}</span>
              <span className="mt-1 block flex-1 text-sm text-ink-soft">{card.text}</span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                {card.cta}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
