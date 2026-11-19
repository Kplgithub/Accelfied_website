import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';
import type { ServiceGroup } from '@/lib/types';
import { GroupIcon } from './group-icon';

const LIST = 5;
const FEATURED_LIST = 8;

/**
 * "Browse by service" as a bento grid: the first group is a large dark card, the others light
 * cards, and a "not sure" card fills whatever space is left on the last row.
 */
export function ServiceDirectory({ groups }: { groups: ServiceGroup[] }) {
  if (!groups.length) return null;
  const [first, ...rest] = groups;
  // The featured card takes two of the three columns; the closing card fills the rest of its row.
  const used = 2 + rest.length;
  const remainder = (3 - (used % 3)) % 3;
  const closingSpan = remainder === 0 ? 'lg:col-span-3' : remainder === 2 ? 'lg:col-span-2' : '';

  return (
    <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <Reveal className="sm:col-span-2">
        <FeaturedGroup group={first!} />
      </Reveal>
      {rest.map((group, index) => (
        <Reveal key={group.slug} delay={((index + 2) % 3) * 90} className="h-full">
          <GroupCard group={group} index={index + 2} />
        </Reveal>
      ))}
      <Reveal className={`h-full sm:col-span-2 ${closingSpan}`}>
        <ClosingCard />
      </Reveal>
    </div>
  );
}

function FeaturedGroup({ group }: { group: ServiceGroup }) {
  const more = group.services.length - FEATURED_LIST;
  return (
    <div className="group relative h-full overflow-hidden rounded-[1.75rem] bg-night p-7 text-paper sm:p-9">
      <div className="grid-lines absolute inset-0 opacity-70" aria-hidden="true" />
      <span className="orb -top-24 -right-16 size-72 bg-brand/40" aria-hidden="true" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand text-white shadow-[0_12px_30px_-10px_rgb(199_54_47/0.9)]">
              <GroupIcon slug={group.slug} className="size-6" />
            </span>
            <div>
              <h3 className="font-display text-3xl font-semibold">{group.name}</h3>
              <p className="mt-0.5 text-sm text-paper/60">{group.services.length} services</p>
            </div>
          </div>
          <span className="font-display text-5xl leading-none text-white/10 select-none" aria-hidden="true">
            01
          </span>
        </div>
        <ul className="mt-8 grid gap-x-8 sm:grid-cols-2">
          {group.services.slice(0, FEATURED_LIST).map((service) => (
            <li key={service.slug} className="border-b border-white/10">
              <Link href={`/agencies/${service.slug}`} className="group/link flex items-center justify-between gap-3 py-3 text-[15px] text-paper/85 transition-colors hover:text-white">
                {service.name}
                <ArrowUpRight
                  className="size-4 shrink-0 text-accent-soft transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
        <Link href={`/services#${group.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent-soft hover:text-white">
          {more > 0 ? `All ${group.services.length} ${group.name.toLowerCase()} services` : `About ${group.name.toLowerCase()}`}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function GroupCard({ group, index }: { group: ServiceGroup; index: number }) {
  const more = group.services.length - LIST;
  return (
    <div className="service-card group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent-tint text-accent transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
          <GroupIcon slug={group.slug} className="size-5" />
        </span>
        <span className="font-display text-4xl leading-none text-line-strong/70 select-none" aria-hidden="true">
          {String(index).padStart(2, '0')}
        </span>
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold text-ink">{group.name}</h3>
      <p className="mt-0.5 text-sm text-ink-faint">{group.services.length} services</p>
      <ul className="mt-5 flex-1">
        {group.services.slice(0, LIST).map((service) => (
          <li key={service.slug} className="border-t border-line first:border-t-0">
            <Link href={`/agencies/${service.slug}`} className="group/link flex items-center justify-between gap-3 py-2.5 text-[15px] text-ink-soft transition-colors hover:text-accent">
              <span className="truncate">{service.name}</span>
              <ArrowUpRight
                className="size-4 shrink-0 text-ink-faint opacity-0 transition-[opacity,transform] duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-accent group-hover/link:opacity-100"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
      <Link href={`/services#${group.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
        {more > 0 ? `+${more} more` : 'See all'}
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}

function ClosingCard() {
  return (
    <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-[1.75rem] border border-brand/15 bg-brand-tint p-7 sm:p-9 lg:flex-row lg:items-end">
      <span className="orb -bottom-24 -left-10 size-64 bg-brand/15" aria-hidden="true" />
      <div className="relative max-w-md">
        <Sparkles className="size-6 text-brand" aria-hidden="true" />
        <h3 className="mt-4 font-display text-3xl leading-tight font-semibold text-ink">Not sure which service you need?</h3>
        <p className="mt-2 text-ink-soft">Answer six short questions and we line up the companies that fit your project and budget.</p>
      </div>
      <Link
        href="/get-matched"
        className="relative inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-brand px-6 text-[15px] font-medium text-white transition-colors hover:bg-brand-strong lg:self-auto"
      >
        Get a free shortlist <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
