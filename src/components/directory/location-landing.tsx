import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { JsonLd, breadcrumbLd } from '@/components/seo/json-ld';
import { Container } from '@/components/ui/container';
import { Stars } from '@/components/ui/stars';
import { countryName } from '@/lib/countries';
import { CompanyCard } from '@/components/company/company-card';
import { getService, getStateCompanies } from '@/lib/data';
import { pageParam } from '@/lib/page-param';
import { parseDirectoryParams } from '@/lib/directory';
import { formatRating, pluralize } from '@/lib/format';
import { findPlace, findStatePlace, placeName, placePath, placeUrl, relatedPlaces, stateLinks } from '@/lib/places';
import { SITE_URL } from '@/lib/site';
import type { Service, ServicePlace } from '@/lib/types';
import { DirectoryResults, DirectorySkeleton } from './directory-results';
import { PlaceFacts } from './place-facts';
import { ServiceGuide } from './service-guide';
import { Pagination } from './pagination';
import { PlaceLinks } from './place-links';

export interface PlaceParams {
  service: string;
  country: string;
  city?: string;
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Resolves the address to a real service and place, or null when either does not exist. */
export async function resolvePlace(params: PlaceParams): Promise<{ service: Service; place: ServicePlace } | null> {
  const [service, found] = await Promise.all([getService(params.service), findPlace(params.service, params.country, params.city)]);
  // The city level also holds India's state pages (/agencies/<service>/india/rajasthan); a city wins when both exist.
  const place = found ?? (params.city ? await findStatePlace(params.service, params.country, params.city) : null);
  return service && place ? { service, place } : null;
}

export function placeHeading(service: Service, place: ServicePlace): string {
  return `Best ${service.name} Companies in ${placeName(place)}`;
}

/** One sentence of real numbers about the place, used in the page intro and description. */
export function placeSummary(service: Service, place: ServicePlace): string {
  const where = place.city ? `${place.city}, ${countryName(place.countryCode)}` : countryName(place.countryCode);
  const one = place.companies === 1;
  const base = `${pluralize(place.companies, 'company', 'companies')} in ${where} ${one ? 'offers' : 'offer'} ${service.name.toLowerCase()}.`;
  if (!place.reviews) return base;
  return `${base} Clients rate ${one ? 'it' : 'them'} ${formatRating(place.rating)} out of 5 on average, across ${pluralize(place.reviews, 'published review')}.`;
}

export function LocationLanding({ params, searchParams }: { params: Promise<PlaceParams>; searchParams: SearchParams }) {
  return (
    <Suspense fallback={<LandingSkeleton />}>
      <Landing params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Landing({ params, searchParams }: { params: Promise<PlaceParams>; searchParams: SearchParams }) {
  const resolved = await resolvePlace(await params);
  if (!resolved) notFound();
  const { service, place } = resolved;
  const country = { ...place, city: '', citySlug: '', kind: undefined };
  const { state } = await stateLinks(service.slug, place);
  const crumbs = [
    { name: 'Services', url: `${SITE_URL}/services` },
    { name: service.name, url: `${SITE_URL}/agencies/${service.slug}` },
    { name: countryName(place.countryCode), url: placeUrl(country) },
    ...(state ? [{ name: state.city, url: placeUrl(state) }] : []),
    ...(place.city ? [{ name: place.city, url: placeUrl(place) }] : []),
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <section className="grain border-b border-line">
        <Container className="py-12 lg:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
            <ol className="flex flex-wrap items-center gap-y-1">
              {crumbs.slice(0, -1).map((crumb) => (
                <li key={crumb.url} className="flex items-center">
                  <Link href={crumb.url.slice(SITE_URL.length)} className="hover:text-accent">
                    {crumb.name}
                  </Link>
                  <span className="mx-2 text-line-strong" aria-hidden="true">
                    /
                  </span>
                </li>
              ))}
              <li aria-current="page" className="text-ink">
                {crumbs.at(-1)!.name}
              </li>
            </ol>
          </nav>
          <h1 className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">{placeHeading(service, place)}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">{placeSummary(service, place)}</p>
          {place.reviews > 0 && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-sm ring-1 ring-line">
              <span className="font-semibold text-ink">{formatRating(place.rating)}</span>
              <Stars value={place.rating} size={14} />
              <span className="text-ink-soft">{pluralize(place.reviews, 'review')}</span>
            </p>
          )}
        </Container>
      </section>
      <Container className="py-10">
        <Suspense fallback={<DirectorySkeleton />}>
          <Results place={place} searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={null}>
          <PlaceFacts service={service} place={place} />
        </Suspense>
        <ServiceGuide service={service} where={placeName(place)} />
        <Related service={service} place={place} />
      </Container>
    </>
  );
}

async function Results({ place, searchParams }: { place: ServicePlace; searchParams: SearchParams }) {
  if (place.kind === 'state') return <StateResults place={place} searchParams={searchParams} />;
  const query = { ...parseDirectoryParams(await searchParams, place.service), country: place.countryCode, city: place.city || undefined };
  return <DirectoryResults query={query} basePath={placePath(place)} fixed={['service', 'country', 'city']} />;
}

async function Related({ service, place }: { service: Service; place: ServicePlace }) {
  const where = placeName(place);
  const states = await stateLinks(service.slug, place);
  if (place.kind === 'state') {
    return (
      <>
        <PlaceLinks title={`${service.name} companies by city in ${where}`} places={states.cities} label={(p) => `${service.name} in ${p.city}`} />
        <PlaceLinks title={`Other services in ${where}`} places={states.otherServices} label={(p) => `${p.serviceName} in ${p.city}`} />
        <PlaceLinks title={`${service.name} in other states`} places={states.otherStates} label={(p) => `${service.name} in ${p.city}`} />
      </>
    );
  }
  const related = await relatedPlaces(service.slug, place);
  return (
    <>
      {states.state && (
        <PlaceLinks title={`${service.name} across ${states.state.city}`} places={[states.state]} label={(p) => `All ${service.name} companies in ${p.city}`} />
      )}
      <PlaceLinks title={`${service.name} companies by state`} places={states.otherStates} label={(p) => `${service.name} in ${p.city}`} />
      <PlaceLinks
        title={place.city ? `${service.name} in other cities of ${countryName(place.countryCode)}` : `${service.name} companies by city`}
        places={related.cities}
        label={(p) => `${service.name} in ${p.city}`}
      />
      <PlaceLinks title={`Other services in ${where}`} places={related.services} label={(p) => `${p.serviceName} in ${placeName(p)}`} />
      <PlaceLinks title={`${service.name} in other countries`} places={related.countries} label={(p) => `${service.name} in ${placeName(p)}`} />
    </>
  );
}

function LandingSkeleton() {
  // At least a screen tall, so the footer does not jump when the page streams in.
  return (
    <div aria-hidden="true" className="min-h-dvh">
      <section className="grain border-b border-line">
        <Container className="py-12 lg:py-16">
          <div className="h-5 w-56 animate-pulse rounded bg-paper-deep" />
          <div className="mt-5 h-12 w-2/3 animate-pulse rounded-lg bg-paper-deep" />
          <div className="mt-5 h-6 w-1/2 animate-pulse rounded bg-paper-deep" />
        </Container>
      </section>
      <Container className="py-10">
        <DirectorySkeleton />
      </Container>
    </div>
  );
}


/** State pages list companies from the state endpoint, with plain pagination (the filter bar works per city or country). */
async function StateResults({ place, searchParams }: { place: ServicePlace; searchParams: SearchParams }) {
  const page = await getStateCompanies({ state: place.citySlug, service: place.service, page: pageParam((await searchParams).page) });
  const base = placePath(place);
  return (
    <>
      {page.page === 1 && page.items.length > 0 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: page.items.map((company, index) => ({ '@type': 'ListItem', position: index + 1, url: `${SITE_URL}/profile/${company.slug}`, name: company.name })),
          }}
        />
      )}
      <p className="text-sm text-ink-soft">{pluralize(page.total, 'company', 'companies')} found</p>
      <div className="mt-4 grid gap-5">
        {page.items.map((company) => (
          <CompanyCard key={company.id} company={company} highlightService={place.service} />
        ))}
      </div>
      <Pagination page={page.page} totalPages={page.totalPages} hrefFor={(target) => (target > 1 ? `${base}?page=${target}` : base)} />
    </>
  );
}
