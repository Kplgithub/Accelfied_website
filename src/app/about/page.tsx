import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'About Us: Agency Reviews Built for India',
  description: 'Why we built Accelfied: a place where Indian businesses compare software, design and marketing companies on checked client reviews, not sales pitches.',
  alternates: { canonical: '/about' },
};

const PRINCIPLES = [
  {
    title: 'A person reads every review',
    text: 'No review goes live until someone on our team has checked it. Ratings are worked out only from those approved reviews, and no company can buy, edit or hide them.',
  },
  {
    title: 'Profiles you can compare side by side',
    text: 'Services, hourly rate band, smallest project, team size, past work and offices, laid out the same way for every company, so a five-person studio and a large firm are judged on the same facts.',
  },
  {
    title: 'Free to list, free to hire',
    text: 'Companies list for free, and businesses never pay to search, message or send a brief. The Verified plan is an optional paid plan for companies that want a checked badge and more reach.',
  },
  {
    title: 'Every city, not just the metros',
    text: 'Good work comes out of Indore, Kochi, Bhubaneswar and Udaipur as often as Bengaluru or Gurugram. Every state and city with listed companies gets its own page, held to the same review checks.',
  },
];

export default function AboutPage() {
  return (
    <Container className="max-w-4xl py-14 lg:py-20">
      <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">About us</p>
      <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">
        Hiring an agency should not feel like a gamble
      </h1>
      <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-ink-soft">
        <p>
          Ask any business owner in India how they found their last website developer or marketing agency and you will hear the same answers: a cousin knew
          someone, a cold call sounded convincing, or they picked the cheapest of three quotes. Sometimes it works. Often it means missed deadlines, a half-built
          app or a monthly fee with nothing to show for it.
        </p>
        <p>
          Accelfied exists to make that choice less of a guess. We bring together reviews from people who actually paid for the work and company profiles that
          answer the questions you would ask on a first call, so you can see who has done the kind of project you need, what they charge and how it went for
          the last client.
        </p>
        <p>
          For agencies, the deal is just as simple. Do good work, ask your clients to say so, and let that record bring the next enquiry. No bidding wars, and no
          paying to be rated higher.
        </p>
      </div>
      <h2 className="mt-14 font-display text-3xl font-semibold text-ink">What we hold ourselves to</h2>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2">
        {PRINCIPLES.map((item) => (
          <li key={item.title} className="rounded-[var(--radius-card)] border border-line bg-surface p-7">
            <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
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
