import type { Metadata } from 'next';
import Image from 'next/image';
import { FaqBrowser } from '@/components/faq/faq-browser';
import { JsonLd } from '@/components/seo/json-ld';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { COMPANY_FAQ } from '@/lib/company-faq';

export const metadata: Metadata = {
  title: 'Help for agencies and IT companies',
  description: 'How agencies and IT companies in India get listed on Accelfied, collect client reviews, show package prices and win more projects. Straight answers.',
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
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">For companies</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl leading-tight font-semibold tracking-tight text-ink">Help for companies</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Everything about listing your company, building a strong profile, collecting client reviews and winning projects on Accelfied.
          </p>
          </div>
          <div className="relative hidden animate-rise lg:block">
            <div className="absolute -inset-3 -z-10 rotate-2 rounded-[2rem] bg-brand/10" aria-hidden="true" />
            <Image
              src="/images/pages/faq.webp"
              alt="An agency team discussing a client project around a table"
              width={1200}
              height={675}
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="aspect-[16/10] w-full rounded-[1.75rem] object-cover shadow-[var(--shadow-lift)]"
            />
          </div>
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
