import type { Metadata } from 'next';
import { LocationLanding } from '@/components/directory/location-landing';
import { placeMetadata, placeStaticParams } from '@/lib/place-metadata';

export function generateStaticParams() {
  return placeStaticParams('country');
}

export async function generateMetadata({ params }: PageProps<'/agencies/[service]/[country]'>): Promise<Metadata> {
  return placeMetadata(await params);
}

/** "Top web development companies in India": one page per service and country with listed companies. */
export default function ServiceCountryPage({ params, searchParams }: PageProps<'/agencies/[service]/[country]'>) {
  return <LocationLanding params={params} searchParams={searchParams} />;
}
