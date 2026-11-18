import type { Metadata } from 'next';
import { LocationLanding } from '@/components/directory/location-landing';
import { placeMetadata, placeStaticParams } from '@/lib/place-metadata';

export function generateStaticParams() {
  return placeStaticParams('city');
}

export async function generateMetadata({ params, searchParams }: PageProps<'/agencies/[service]/[country]/[city]'>): Promise<Metadata> {
  return placeMetadata(await params, searchParams);
}

/** "Top web development companies in Pune": one page per service and city with listed companies. */
export default function ServiceCityPage({ params, searchParams }: PageProps<'/agencies/[service]/[country]/[city]'>) {
  return <LocationLanding params={params} searchParams={searchParams} />;
}
