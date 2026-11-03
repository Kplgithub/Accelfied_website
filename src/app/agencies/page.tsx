import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DirectoryResults, DirectorySkeleton } from '@/components/directory/directory-results';
import { Container } from '@/components/ui/container';
import { parseDirectoryParams } from '@/lib/directory';
import { withSeo } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return withSeo('agencies', {
    title: 'All companies',
    description: 'Search every company on Accelfied and compare them by client reviews, rates, team size and location.',
    alternates: { canonical: '/agencies' },
  });
}

export default function AllAgenciesPage({ searchParams }: PageProps<'/agencies'>) {
  return (
    <>
      <section className="grain border-b border-line">
        <Container className="py-12 lg:py-16">
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Directory</p>
          <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">
            Every company on Accelfied
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            Search by name or narrow down by location, budget and rate. Ratings come only from published client reviews.
          </p>
        </Container>
      </section>
      <Container className="py-10">
        <Suspense fallback={<DirectorySkeleton />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function Results({ searchParams }: { searchParams: PageProps<'/agencies'>['searchParams'] }) {
  const query = parseDirectoryParams(await searchParams);
  return <DirectoryResults query={query} basePath="/agencies" />;
}
