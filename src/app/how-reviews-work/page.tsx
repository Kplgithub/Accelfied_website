import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'How reviews work',
  description: 'How Accelfied collects, checks and scores client reviews.',
  alternates: { canonical: '/how-reviews-work' },
};

const STEPS = [
  {
    title: 'A client writes a review',
    text: 'Anyone who worked with a listed company can review it. They describe the project, its budget and timeline, and rate quality, schedule, cost and whether they would refer the company.',
  },
  {
    title: 'Our team checks it',
    text: 'Every review waits for a person on our team to confirm it is genuine before it is published. We may contact the reviewer to confirm the project. Reviews we can confirm carry a "Verified client" mark.',
  },
  {
    title: 'It counts towards the rating',
    text: 'A company’s rating is the average of its published reviews and nothing else. If a review is later removed, the rating updates with it. Ratings cannot be bought or typed in.',
  },
  {
    title: 'Ranking stays fair',
    text: 'The default order weighs a company’s rating together with how many reviews it has, so one glowing review does not outrank a long, consistent track record.',
  },
];

export default function HowReviewsWorkPage() {
  return (
    <Container className="max-w-3xl py-14 lg:py-20">
      <p className="text-sm font-semibold tracking-[0.16em] text-saffron-ink uppercase">Trust</p>
      <h1 className="mt-3 font-display text-5xl leading-tight font-semibold tracking-tight text-ink">How reviews work</h1>
      <p className="mt-5 text-lg leading-relaxed text-ink-soft">
        Reviews are only useful if you can trust them. Here is exactly what happens between a client pressing submit and a
        review appearing on a profile.
      </p>
      <ol className="mt-12 space-y-10">
        {STEPS.map((step, index) => (
          <li key={step.title} className="grid grid-cols-[48px_1fr] gap-5">
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand font-display text-lg font-semibold text-paper">
              {index + 1}
            </span>
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">{step.title}</h2>
              <p className="mt-2 leading-relaxed text-ink-soft">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-14 flex flex-wrap gap-3">
        <ButtonLink href="/write-a-review">Write a review</ButtonLink>
        <ButtonLink href="/agencies" variant="secondary">
          Browse companies
        </ButtonLink>
      </div>
    </Container>
  );
}
