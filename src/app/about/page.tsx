import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'About Accelfied',
  description: 'Accelfied helps businesses find service companies they can trust, through checked client reviews and clear profiles.',
  alternates: { canonical: '/about' },
};

const PRINCIPLES = [
  {
    title: 'Reviews you can trust',
    text: 'Every review is read by a person on our team before it is published. Ratings come only from those reviews, and no company can buy, edit or hide them.',
  },
  {
    title: 'Profiles that answer real questions',
    text: 'Services, rates, minimum project size, team, past work and locations, laid out the same way for every company so you can compare fairly.',
  },
  {
    title: 'Free to list, free to hire',
    text: 'Companies list for free and clients never pay to search, message or send a brief. Verified is an optional plan for companies that want to stand out.',
  },
  {
    title: 'One city at a time',
    text: 'We start where we can check companies properly, beginning with Jaipur, and grow city by city so every listing stays useful.',
  },
];

export default function AboutPage() {
  return (
    <Container className="max-w-4xl py-14 lg:py-20">
      <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">About us</p>
      <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">Helping businesses hire with confidence</h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-soft">
        Choosing an agency or service company is hard. Websites all look good and every pitch sounds the same. Accelfied brings together honest reviews from past clients
        and clear company profiles, so you can see who has done the kind of work you need, and how it went.
      </p>
      <ul className="mt-12 grid gap-5 sm:grid-cols-2">
        {PRINCIPLES.map((item) => (
          <li key={item.title} className="rounded-[var(--radius-card)] border border-line bg-surface p-7">
            <h2 className="font-display text-xl font-semibold text-ink">{item.title}</h2>
            <p className="mt-2 leading-relaxed text-ink-soft">{item.text}</p>
          </li>
        ))}
      </ul>
      <div className="mt-12 flex flex-wrap gap-3">
        <ButtonLink href="/agencies">Browse companies</ButtonLink>
        <ButtonLink href="/join?as=provider" variant="secondary">
          List your company
        </ButtonLink>
        <ButtonLink href="/contact" variant="ghost">
          Contact us
        </ButtonLink>
      </div>
    </Container>
  );
}
