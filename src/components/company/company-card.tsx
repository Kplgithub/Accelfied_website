import { DollarSign, MapPin, Timer, Users } from 'lucide-react';
import Link from 'next/link';
import { countryName } from '@/lib/countries';
import { hourlyRateLabel, minProjectLabel, teamSizeLabel } from '@/lib/labels';
import type { CompanySummary } from '@/lib/types';
import { VerifiedBadge } from '../ui/badge';
import { ButtonLink } from '../ui/button';
import { CompanyLogo } from './company-logo';
import { RatingInline } from './rating-inline';
import { SaveButton } from './save-button';

/** `sponsored` marks a paid place at the top of a directory page, labelled so clients always know. */
export function CompanyCard({ company, highlightService, sponsored = false }: { company: CompanySummary; highlightService?: string; sponsored?: boolean }) {
  const hq = company.headquarters;
  const facts = [
    { icon: DollarSign, label: 'Min. project', value: minProjectLabel(company.minProjectSize) },
    { icon: Timer, label: 'Hourly rate', value: hourlyRateLabel(company.hourlyRate) },
    { icon: Users, label: 'Team', value: teamSizeLabel(company.teamSize) },
    {
      icon: MapPin,
      label: 'Location',
      value: `${hq.city}, ${countryName(hq.countryCode)}${company.locationCount > 1 ? ` +${company.locationCount - 1}` : ''}`,
    },
  ];

  return (
    <article
      className={`group @container relative rounded-[var(--radius-card)] border bg-surface p-5 ${sponsored ? 'border-saffron/50 ring-1 ring-saffron/20' : 'border-line'} shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)] sm:p-6`}
    >
      <div className="flex flex-col gap-6 @2xl:flex-row @2xl:items-start">
        <div className="flex flex-1 gap-4">
          <CompanyLogo name={company.name} logoUrl={company.logoUrl} size={64} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                <Link href={`/profile/${company.slug}`} className="after:absolute after:inset-0 after:rounded-[var(--radius-card)]">
                  {company.name}
                </Link>
              </h3>
              {company.verified && <VerifiedBadge premier={company.premier} />}
              {sponsored && <span className="rounded-full bg-saffron-tint px-2 py-0.5 text-xs font-medium text-saffron-ink">Sponsored</span>}
            </div>
            {company.tagline && <p className="mt-1 line-clamp-2 text-[15px] text-ink-soft">{company.tagline}</p>}
            <div className="mt-3">
              <RatingInline average={company.rating.average} count={company.rating.count} size="sm" />
            </div>
            <ServiceFocus services={company.services} highlight={highlightService} />
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-5 gap-y-3 border-t border-line pt-5 text-sm @2xl:w-72 @2xl:shrink-0 @2xl:border-t-0 @2xl:border-l @2xl:pt-0 @2xl:pl-6">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="min-w-0">
              <dt className="flex items-center gap-1.5 text-xs text-ink-faint">
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </dt>
              <dd className="mt-0.5 truncate font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <ButtonLink href={`/profile/${company.slug}`} variant="secondary" size="sm">
          View profile
        </ButtonLink>
        <ButtonLink href={`/get-a-quote?company=${company.slug}`} size="sm">
          Get a quote
        </ButtonLink>
        <span className="ml-auto">
          <SaveButton slug={company.slug} name={company.name} />
        </span>
      </div>
    </article>
  );
}

function ServiceFocus({ services, highlight }: { services: CompanySummary['services']; highlight?: string }) {
  if (!services.length) return null;
  const palette = ['bg-brand', 'bg-accent', 'bg-night', 'bg-[#5b8a9b]', 'bg-ink-faint'];
  return (
    <div className="mt-4">
      <div className="flex h-1.5 overflow-hidden rounded-full bg-paper-deep" aria-hidden="true">
        {services.map((service, index) => (
          <span key={service.slug} className={palette[index % palette.length]} style={{ width: `${service.percent}%` }} />
        ))}
      </div>
      <p className="mt-2 text-[13px] text-ink-soft">
        {services.slice(0, 3).map((service, index) => (
          <span key={service.slug}>
            {index > 0 && <span className="text-line-strong"> · </span>}
            <span className={service.slug === highlight ? 'font-medium text-ink' : ''}>
              {service.percent}% {service.name}
            </span>
          </span>
        ))}
      </p>
    </div>
  );
}
