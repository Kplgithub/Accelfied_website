import { ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { countryName } from '@/lib/countries';
import { getCompanies } from '@/lib/data';
import { minProjectLabel } from '@/lib/labels';
import { CompanyLogo } from './company-logo';
import { RatingInline } from './rating-inline';
import { VerifiedBadge } from '../ui/badge';

/** Other companies offering the same main service, so a client who is not sure can keep looking. */
export async function SimilarCompanies({ slug, service }: { slug: string; service?: { slug: string; name: string } }) {
  if (!service) return null;
  const { items } = await getCompanies({ service: service.slug, page: 1 }).catch(() => ({ items: [] }));
  const similar = items.filter((company) => company.slug !== slug).slice(0, 3);
  if (!similar.length) return null;

  return (
    <section aria-labelledby="similar-title" className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
      <h2 id="similar-title" className="font-display text-lg font-semibold text-ink">
        Other teams to consider
      </h2>
      <p className="mt-0.5 text-sm text-ink-soft">Also offering {service.name}</p>
      <ul className="mt-4 space-y-1">
        {similar.map((company) => (
          <li key={company.id}>
            <Link href={`/profile/${company.slug}`} className="group -mx-2 flex gap-3 rounded-xl p-2 transition-colors hover:bg-paper">
              <CompanyLogo name={company.name} logoUrl={company.logoUrl} size={44} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate font-medium text-ink group-hover:text-brand">{company.name}</span>
                  {company.verified && <VerifiedBadge premier={company.premier} />}
                </span>
                <span className="mt-0.5 block">
                  <RatingInline average={company.rating.average} count={company.rating.count} size="sm" />
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-ink-faint">
                  <MapPin className="size-3" aria-hidden="true" />
                  {company.headquarters.city}, {countryName(company.headquarters.countryCode)} · {minProjectLabel(company.minProjectSize)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href={`/agencies/${service.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
        See all {service.name} companies
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </section>
  );
}
