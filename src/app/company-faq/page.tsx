import type { Metadata } from 'next';
import { FaqBrowser } from '@/components/faq/faq-browser';
import { JsonLd } from '@/components/seo/json-ld';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { COMPANY_FAQ } from '@/lib/company-faq';

export const metadata: Metadata = {
  title: 'Help for companies',
  description: 'Answers for agencies and service companies on Accelfied: listing, profile, packages, client reviews, project briefs and Verified plans.',
  alternates: { canonical: '/company-faq' },
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: COMPANY_FAQ.flatMap((topic) =>
    topic.items.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
  ),
};

export default function CompanyFaqPage() {
  return (
    <>
      <JsonLd data={faqLd} />
      <section className="grain border-b border-line">
        <Container className="py-14 lg:py-20">
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">For companies</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl leading-tight font-semibold tracking-tight text-ink">Help for companies</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Everything about listing your company, building a strong profile, collecting client reviews and winning projects on Accelfied.
          </p>
        </Container>
      </section>
      <Container className="py-12 lg:py-16">
        <FaqBrowser topics={COMPANY_FAQ} />
        <div className="mt-16 flex flex-col items-start justify-between gap-5 rounded-[var(--radius-card)] bg-night p-8 text-white sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="font-display text-2xl font-semibold">Still have a question?</h2>
            <p className="mt-1 text-white/75">Write to our team and we will help you out.</p>
          </div>
          <ButtonLink href="/contact" variant="inverse">
            Contact us
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
