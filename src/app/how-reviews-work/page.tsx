import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'How We Check Client Reviews',
  description: 'How Accelfied collects, checks and scores client reviews of agencies in India, and why no company can pay to change its rating.',
  alternates: { canonical: '/how-reviews-work' },
};

const STEPS = [
  {
    title: 'A client writes a review',
    text: 'Anyone who has worked with a listed company can review it. They describe the project, its budget and timeline, then score quality, timelines, value for money and whether they would recommend the team to a friend.',
  },
  {
    title: 'Our team checks it',
    text: 'Every review waits in a queue until a person on our team has confirmed it looks genuine. We may call or email the reviewer to confirm the project. Reviews we can confirm carry a "Verified client" mark.',
  },
  {
    title: 'It counts towards the rating',
    text: 'A company’s rating is the average of its approved reviews and nothing else. If a review is later taken down, the rating changes with it. Ratings cannot be bought, and nobody types them in.',
  },
  {
    title: 'Ranking stays fair',
    text: 'The default order weighs a company’s rating together with how many reviews it has, so a single five-star review does not outrank years of steady, well-reviewed work.',
  },
];

export default function HowReviewsWorkPage() {
  return (
    <Container className="max-w-3xl py-14 lg:py-20">
      <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Trust</p>
      <h1 className="mt-3 font-display text-5xl leading-tight font-semibold tracking-tight text-ink">How reviews work</h1>
      <p className="mt-5 text-lg leading-relaxed text-ink-soft">
        A review is only worth reading if you know where it came from. Here is every step between a client pressing submit and those words appearing on a
        company profile.
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
