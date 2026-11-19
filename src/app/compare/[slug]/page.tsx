import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Bullets, FaqList, LandingHero, MoreGuides, QuoteCta, Sections, ServiceLinks } from '@/components/landing/landing-parts';
import { Container } from '@/components/ui/container';
import { COMPARISONS, getComparison } from '@/lib/landing/comparisons';
import { landingMetadata } from '@/lib/landing/metadata';
import { ArticleSkeleton } from '@/components/skeleton/public';

/** Not linked from the site menus (kapil, 2026-11-18); listed in /sitemap.xml for search engines. */
export function generateStaticParams() {
  return COMPARISONS.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps<'/compare/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  return landingMetadata(getComparison(slug), `/compare/${slug}`);
}

export default function ComparePage({ params }: PageProps<'/compare/[slug]'>) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <Comparison params={params} />
    </Suspense>
  );
}

async function Comparison({ params }: Pick<PageProps<'/compare/[slug]'>, 'params'>) {
  const { slug } = await params;
  const page = getComparison(slug);
  if (!page) notFound();
  const [a, b] = page.sides;
  return (
    <>
      <LandingHero page={page} path={`/compare/${page.slug}`} />
      <Container className="py-10 lg:py-14">
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            {a} vs {b} at a glance
          </h2>
          <div className="mt-5 overflow-x-auto rounded-[var(--radius-card)] bg-surface ring-1 ring-line">
            <table className="w-full min-w-[640px] text-left text-[15px]">
              <thead className="bg-paper-deep text-sm text-ink">
                <tr>
                  <th scope="col" className="w-1/4 px-5 py-3 font-semibold">
                    <span className="sr-only">Factor</span>
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">{a}</th>
                  <th scope="col" className="px-5 py-3 font-semibold">{b}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {page.rows.map((row) => (
                  <tr key={row.factor}>
                    <th scope="row" className="px-5 py-3.5 font-medium text-ink">{row.factor}</th>
                    <td className="px-5 py-3.5 text-ink-soft">{row.a}</td>
                    <td className="px-5 py-3.5 text-ink-soft">{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {[
            { side: a, title: page.chooseTitles[0], items: page.chooseA },
            { side: b, title: page.chooseTitles[1], items: page.chooseB },
          ].map(({ side, title, items }) => (
            <section key={side} className="rounded-[var(--radius-card)] bg-surface p-6 ring-1 ring-line">
              <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">{title}</h2>
              <Bullets items={items} />
            </section>
          ))}
        </div>
        <Sections sections={page.sections} />
        <FaqList faqs={page.faqs} />
        <ServiceLinks services={page.services} heading="Compare companies by service" />
        <QuoteCta service={page.services[0]} text="Describe your project once and hear from companies that fit your budget and timeline, with reviews from their past clients." />
        <MoreGuides kind="compare" current={page.slug} />
      </Container>
    </>
  );
}
