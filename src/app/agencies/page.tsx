import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DirectoryResults, DirectorySkeleton } from '@/components/directory/directory-results';
import { Container } from '@/components/ui/container';
import { parseDirectoryParams } from '@/lib/directory';
import { pagedCanonical } from '@/lib/page-param';
import { withSeo } from '@/lib/seo';

export async function generateMetadata({ searchParams }: PageProps<'/agencies'>): Promise<Metadata> {
  const { canonical, suffix } = await pagedCanonical('/agencies', searchParams);
  const metadata = await withSeo('agencies', {
    title: 'IT, Software & Marketing Companies in India',
    description: 'Search every agency on Accelfied. Filter software, app, design and marketing companies in India by city, budget, hourly rate and checked client reviews.',
    alternates: { canonical },
  });
  return suffix ? { ...metadata, title: `IT, Software & Marketing Companies in India${suffix}` } : metadata;
}

export default function AllAgenciesPage({ searchParams }: PageProps<'/agencies'>) {
  return (
    <>
      <section className="grain border-b border-line">
        <Container className="py-12 lg:py-16">
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Directory</p>
          <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">
            Software, design and marketing companies in India
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            Search by name, or narrow the list by city, budget and hourly rate. Every star rating here comes from client reviews our team has approved.
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
