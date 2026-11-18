import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { DirectoryResults, DirectorySkeleton } from '@/components/directory/directory-results';
import { PlaceLinks } from '@/components/directory/place-links';
import { JsonLd, breadcrumbLd } from '@/components/seo/json-ld';
import { Container } from '@/components/ui/container';
import { getService, getServiceGroups } from '@/lib/data';
import { parseDirectoryParams } from '@/lib/directory';
import { pagedCanonical } from '@/lib/page-param';
import { getStatePlaces, listedServices, placeName, relatedPlaces } from '@/lib/places';
import { SITE_URL } from '@/lib/site';
import { MAX_DESCRIPTION } from '@/lib/seo-text';
import { ServiceGuide } from '@/components/directory/service-guide';

export async function generateStaticParams() {
  const groups = await getServiceGroups();
  return groups.flatMap((group) => group.services.map((service) => ({ service: service.slug })));
}

export async function generateMetadata({ params, searchParams }: PageProps<'/agencies/[service]'>): Promise<Metadata> {
  const [service, listed] = await Promise.all([getService((await params).service), listedServices()]);
  if (!service) return { title: 'Service not found' };
  const { canonical, suffix } = await pagedCanonical(`/agencies/${service.slug}`, searchParams);
  return {
    title: `Best ${service.name} Companies in India${suffix}`,
    description: fitDescription(`Shortlist ${service.name.toLowerCase()} companies in India by checked client reviews, hourly rates and minimum budget.`, [
      ' Free to compare and free to send a brief.',
      ' Free to compare.',
    ]),
    alternates: { canonical },
    robots: listed.has(service.slug) ? undefined : { index: false, follow: true },
  };
}

/** Adds the longest ending that still fits in a search result description. */
function fitDescription(base: string, endings: string[]): string {
  return base + (endings.find((ending) => base.length + ending.length <= MAX_DESCRIPTION) ?? '');
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
        <Suspense fallback={null}>
          <Locations params={params} />
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
      <JsonLd
        data={breadcrumbLd([
          { name: 'Services', url: `${SITE_URL}/services` },
          { name: service.group, url: `${SITE_URL}/services#${service.groupSlug}` },
          { name: service.name, url: `${SITE_URL}/agencies/${service.slug}` },
        ])}
      />
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
          Best {service.name} companies in India
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft">
          {service.description} Every rating below comes from client reviews our team read and approved, so you can compare on what past clients
          actually experienced.
        </p>
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

/** Links to this service's country and city pages, busiest first. */
async function Locations({ params }: Pick<PageProps<'/agencies/[service]'>, 'params'>) {
  const service = await getService((await params).service);
  if (!service) return null;
  const [{ countries, cities }, states] = await Promise.all([relatedPlaces(service.slug), getStatePlaces()]);
  return (
    <>
      <ServiceGuide service={service} where="India" />
      <PlaceLinks title={`${service.name} companies by country`} places={countries} label={(p) => `${service.name} in ${placeName(p)}`} />
      <PlaceLinks
        title={`${service.name} companies by state in India`}
        places={states.filter((p) => p.service === service.slug).slice(0, 36)}
        label={(p) => `${service.name} in ${p.city}`}
      />
      <PlaceLinks title={`${service.name} companies by city`} places={cities} label={(p) => `${service.name} in ${p.city}`} />
    </>
  );
}
