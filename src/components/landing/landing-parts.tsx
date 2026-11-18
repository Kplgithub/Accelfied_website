import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { JsonLd, breadcrumbLd } from '@/components/seo/json-ld';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { getServiceGroups, getServicePlaces } from '@/lib/data';
import { formatDay } from '@/lib/format';
import { landingLinks, type LandingKind } from '@/lib/landing';
import type { Faq, LandingBase, Table, TextSection } from '@/lib/landing/types';
import { SITE_URL } from '@/lib/site';

/** Title, intro and structured data shared by every landing page. */
export function LandingHero({ page, path, children }: { page: LandingBase; path: string; children?: ReactNode }) {
  return (
    <section className="grain border-b border-line">
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: SITE_URL },
          { name: page.title, url: `${SITE_URL}${path}` },
        ])}
      />
      <Container className="py-12 lg:py-16">
        <p className="animate-rise text-sm font-semibold tracking-[0.16em] text-brand uppercase">{page.eyebrow}</p>
        <h1 className="mt-3 max-w-4xl animate-rise font-display text-4xl leading-tight font-semibold tracking-tight text-ink [animation-delay:80ms] sm:text-5xl">
          {page.title}
        </h1>
        <div className="mt-5 max-w-3xl animate-rise space-y-3 text-lg leading-relaxed text-ink-soft [animation-delay:160ms]">
          {page.intro.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <p className="mt-5 text-sm text-ink-faint">Facts and prices checked {formatDay(page.reviewed)}</p>
        {children}
      </Container>
    </section>
  );
}

export function Sections({ sections }: { sections: TextSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.heading} className="mt-14 max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{section.heading}</h2>
          {section.paragraphs?.map((text) => (
            <p key={text} className="mt-4 leading-relaxed text-ink-soft">
              {text}
            </p>
          ))}
          {section.bullets && <Bullets items={section.bullets} />}
        </section>
      ))}
    </>
  );
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed text-ink-soft">
          <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function DataTable({ table }: { table: Table }) {
  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{table.caption}</h2>
      <div className="mt-5 overflow-x-auto rounded-[var(--radius-card)] bg-surface ring-1 ring-line">
        <table className="w-full min-w-[560px] text-left text-[15px]">
          <thead className="bg-paper-deep text-sm text-ink">
            <tr>
              {table.headers.map((header) => (
                <th key={header} scope="col" className="px-5 py-3 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {table.rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) =>
                  index === 0 ? (
                    <th key={index} scope="row" className="px-5 py-3.5 font-medium text-ink">
                      {cell}
                    </th>
                  ) : (
                    <td key={index} className="px-5 py-3.5 text-ink-soft">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && <p className="mt-3 max-w-3xl text-sm text-ink-faint">{table.note}</p>}
    </section>
  );
}

/** Visible questions and answers, with the same text as FAQPage structured data. */
export function FaqList({ faqs, heading = 'Frequently asked questions' }: { faqs: Faq[]; heading?: string }) {
  return (
    <section className="mt-14 max-w-3xl">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
        }}
      />
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{heading}</h2>
      <div className="mt-5 divide-y divide-line rounded-[var(--radius-card)] bg-surface ring-1 ring-line">
        {faqs.map((item) => (
          <div key={item.q} className="px-5 py-4">
            <h3 className="font-semibold text-ink">{item.q}</h3>
            <p className="mt-1.5 leading-relaxed text-ink-soft">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Links into the directory for the services this page is about, by their real names. */
export async function ServiceLinks({ services, heading }: { services: string[]; heading: string }) {
  const [groups, places] = await Promise.all([getServiceGroups(), getServicePlaces()]);
  const names = new Map(groups.flatMap((group) => group.services.map((service) => [service.slug, service.name] as const)));
  // The India page exists only once a company in India offers the service; until then the service page is the target.
  const inIndia = new Set(places.filter((place) => place.countryCode === 'IN' && !place.city).map((place) => place.service));
  const known = services.filter((slug) => names.has(slug));
  if (!known.length) return null;
  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{heading}</h2>
      <div className="mt-5 flex flex-wrap gap-3">
        {known.map((slug) => (
          <Link
            key={slug}
            href={inIndia.has(slug) ? `/agencies/${slug}/india` : `/agencies/${slug}`}
            className="group inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-ink ring-1 ring-line transition-shadow hover:ring-accent"
          >
            {names.get(slug)} companies{inIndia.has(slug) ? ' in India' : ''}
            <ArrowRight className="size-4 text-accent transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Closing call to action: describe the project once and hear from matching companies. */
export function QuoteCta({ service, text }: { service?: string; text: string }) {
  return (
    <section className="mt-16 rounded-[var(--radius-card)] bg-night px-6 py-10 text-white sm:px-10">
      <h2 className="max-w-2xl font-display text-2xl font-semibold sm:text-3xl">Get quotes from companies that fit</h2>
      <p className="mt-3 max-w-2xl text-white/80">{text}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href={service ? `/get-matched?service=${service}` : '/get-matched'} variant="primary" size="lg">
          Get a free shortlist
        </ButtonLink>
        <ButtonLink href="/agencies" variant="inverse" size="lg">
          Browse companies
        </ButtonLink>
      </div>
    </section>
  );
}

/** Other guides of the same kind, so search engines and readers can move between them. */
export function MoreGuides({ kind, current }: { kind: LandingKind; current: string }) {
  const links = landingLinks(kind).filter((link) => link.slug !== current);
  if (!links.length) return null;
  const heading = { tools: 'More cost calculators', compare: 'More comparisons', industries: 'Other industries' }[kind];
  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{heading}</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <li key={link.slug}>
            <Link href={link.path} className="block h-full rounded-2xl bg-surface p-4 font-medium text-ink ring-1 ring-line transition-shadow hover:ring-accent">
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
