import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { DirectoryResults, DirectorySkeleton } from '@/components/directory/directory-results';
import { Container } from '@/components/ui/container';
import { getService, getServiceGroups } from '@/lib/data';
import { parseDirectoryParams } from '@/lib/directory';

export async function generateStaticParams() {
  const groups = await getServiceGroups();
  return groups.flatMap((group) => group.services.map((service) => ({ service: service.slug })));
}

export async function generateMetadata({ params }: PageProps<'/agencies/[service]'>): Promise<Metadata> {
  const service = await getService((await params).service);
  if (!service) return { title: 'Service not found' };
  return {
    title: `Top ${service.name} Companies`,
    description: `Compare ${service.name.toLowerCase()} companies by verified client reviews, hourly rates, minimum project size and location.`,
    alternates: { canonical: `/agencies/${service.slug}` },
  };
}

export default function ServiceDirectoryPage({ params, searchParams }: PageProps<'/agencies/[service]'>) {
  return (
    <>
      <Suspense fallback={<HeaderShell />}>
        <Header params={params} />
      </Suspense>
      <Container className="py-10">
        <Suspense fallback={<DirectorySkeleton />}>
          <Results params={params} searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function Header({ params }: Pick<PageProps<'/agencies/[service]'>, 'params'>) {
  const service = await getService((await params).service);
  if (!service) notFound();
  return (
    <section className="grain border-b border-line">
      <Container className="py-12 lg:py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
          <Link href="/services" className="hover:text-accent">
            Services
          </Link>
          <span className="mx-2 text-line-strong">/</span>
          <Link href={`/services#${service.groupSlug}`} className="hover:text-accent">
            {service.group}
          </Link>
        </nav>
        <h1 className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">
          Top {service.name} companies
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft">{service.description}</p>
      </Container>
    </section>
  );
}

function HeaderShell() {
  return (
    <section className="grain border-b border-line">
      <Container className="py-12 lg:py-16" aria-hidden="true">
        <div className="h-5 w-40 animate-pulse rounded bg-paper-deep" />
        <div className="mt-5 h-12 w-2/3 animate-pulse rounded-lg bg-paper-deep" />
        <div className="mt-5 h-6 w-1/2 animate-pulse rounded bg-paper-deep" />
      </Container>
    </section>
  );
}

async function Results({ params, searchParams }: PageProps<'/agencies/[service]'>) {
  const { service } = await params;
  const query = parseDirectoryParams(await searchParams, service);
  return <DirectoryResults query={query} basePath={`/agencies/${service}`} />;
}
