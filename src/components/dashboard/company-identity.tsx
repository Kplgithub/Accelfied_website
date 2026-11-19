import { ArrowUpRight, BadgeCheck, Eye, MapPin, PenLine } from 'lucide-react';
import Link from 'next/link';
import { initials } from '@/lib/format';
import type { OwnedCompany } from '@/lib/types';
import { ButtonLink } from '../ui/button';

/** Logo with a monogram fallback, sized for the dashboard. */
export function DashboardLogo({ company, size, ring = false }: { company: Pick<OwnedCompany, 'name' | 'logoUrl'>; size: number; ring?: boolean }) {
  const style = { width: size, height: size };
  const frame = `shrink-0 rounded-2xl ${ring ? 'ring-4 ring-white/15 shadow-[0_12px_30px_-12px_rgb(0_0_0/0.5)]' : 'border border-line shadow-[var(--shadow-card)]'}`;
  if (company.logoUrl) {
    return (
      // Logos come from any host, so next/image (which needs every host allow-listed) is not used.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={company.logoUrl} alt={`${company.name} logo`} width={size} height={size} className={`${frame} bg-white object-contain p-1.5`} style={style} />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${frame} inline-flex items-center justify-center bg-gradient-to-br from-brand to-[#9d2a24] font-display font-semibold text-white`}
      style={{ ...style, fontSize: size * 0.38 }}
    >
      {initials(company.name)}
    </span>
  );
}

/** "Verified" for paying, checked companies; everyone else is on the free profile. */
export function PlanPill({ company, tone = 'light' }: { company: Pick<OwnedCompany, 'verified' | 'premier'>; tone?: 'light' | 'dark' }) {
  if (company.verified) {
    const label = company.premier ? 'Premier Verified' : 'Verified';
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
          tone === 'dark' ? 'bg-accent-soft/20 text-accent-soft ring-1 ring-accent-soft/30' : 'bg-accent-tint text-accent ring-1 ring-accent/20'
        }`}
      >
        <BadgeCheck className={`size-3.5 ${company.premier ? 'text-saffron' : ''}`} aria-hidden="true" />
        {label}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        tone === 'dark' ? 'bg-white/10 text-paper/85 ring-1 ring-white/15' : 'bg-paper-deep text-ink-soft ring-1 ring-line'
      }`}
    >
      Free profile
    </span>
  );
}

const STATUS_NOTE = {
  pending: 'Verifying your details',
  published: 'Live',
  rejected: 'Not approved',
  suspended: 'Paused',
} as const;

/** Sidebar card: who this dashboard belongs to. */
export function CompanySidebarCard({ company }: { company: OwnedCompany }) {
  const live = company.status === 'published';
  return (
    <div className="relative mb-5 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface p-3 shadow-[var(--shadow-card)] lg:mb-8 lg:p-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-16 bg-gradient-to-br from-night via-night-soft to-accent-strong lg:block" aria-hidden="true" />
      <div className="relative flex items-center gap-3 lg:flex-col lg:items-start lg:gap-0">
        <div className="lg:mt-5">
          <DashboardLogo company={company} size={52} />
        </div>
        <div className="min-w-0 flex-1 lg:w-full lg:pt-3">
          <p className="truncate font-display text-[17px] leading-snug font-semibold text-ink" title={company.name}>
            {company.name}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <PlanPill company={company} />
            <span className={`inline-flex items-center gap-1 text-xs ${live ? 'text-success' : 'text-saffron-ink'}`}>
              <span className={`size-1.5 rounded-full ${live ? 'bg-success' : 'bg-saffron'}`} aria-hidden="true" />
              {STATUS_NOTE[company.status]}
            </span>
          </div>
        </div>
        {live && (
          <Link
            href={`/profile/${company.slug}`}
            className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-sm font-medium text-accent transition-colors hover:bg-accent-tint lg:mt-3 lg:-ml-2"
          >
            <span className="hidden sm:inline">View profile</span>
            <span className="sm:hidden">Profile</span>
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}

/** Top of the company overview: logo, "Welcome, {Company}!" and the plan. */
export function CompanyWelcome({ company }: { company: OwnedCompany }) {
  const live = company.status === 'published';
  const city = company.headquarters?.city;
  return (
    <header className="relative mb-8 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface text-ink shadow-[var(--shadow-card)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand via-accent to-night" aria-hidden="true" />
      <span className="pointer-events-none absolute -top-28 -right-20 size-80 rounded-full bg-accent-tint blur-2xl" aria-hidden="true" />
      <span className="pointer-events-none absolute -bottom-32 right-1/4 size-64 rounded-full bg-brand-tint/80 blur-3xl" aria-hidden="true" />
      <div className="relative flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <div className="animate-rise">
            <DashboardLogo company={company} size={76} />
          </div>
          <div className="min-w-0 animate-rise" style={{ animationDelay: '80ms' }}>
            <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">Company dashboard</p>
            <h1 className="mt-1.5 font-display text-2xl leading-tight font-semibold tracking-tight break-words sm:text-[2.1rem]">Welcome, {company.name}!</h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
              <PlanPill company={company} />
              {company.rating.count > 0 && (
                <span className="tabular-nums">
                  <span className="font-semibold text-ink">{company.rating.average.toFixed(1)}</span> from {company.rating.count}{' '}
                  {company.rating.count === 1 ? 'review' : 'reviews'}
                </span>
              )}
              {city && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {city}
                </span>
              )}
              {!live && <span className="text-saffron-ink">{STATUS_NOTE[company.status]}</span>}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 animate-rise" style={{ animationDelay: '160ms' }}>
          {live && (
            <ButtonLink href={`/profile/${company.slug}`} size="sm" variant="secondary" className="gap-1.5">
              <Eye className="size-4" aria-hidden="true" />
              View profile
            </ButtonLink>
          )}
          <ButtonLink href="/dashboard/company" size="sm" className="gap-1.5">
            <PenLine className="size-4" aria-hidden="true" />
            Edit profile
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
