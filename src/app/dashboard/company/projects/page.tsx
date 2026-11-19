import { CheckCircle2, Clock3, FolderOpen, MessageSquareQuote, Pin, Plus, Search, Star } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DashboardHeader, StatusPill } from '@/components/dashboard/bits';
import { NoCompany } from '@/components/dashboard/no-company';
import { Pagination } from '@/components/directory/pagination';
import { ButtonLink } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/field';
import { ShareReviewLink } from '@/components/vendor/share-review-link';
import { getMyCompany } from '@/lib/account-data';
import { formatDay, initials } from '@/lib/format';
import { SITE_URL } from '@/lib/site';
import { getMyProjects, type ProjectCard } from '@/lib/vendor-tools';

export const metadata: Metadata = { title: 'Projects' };

const HERE = '/dashboard/company/projects';
const STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'published', label: 'Live' },
  { value: 'pending', label: 'Waiting for approval' },
  { value: 'rejected', label: 'Not approved' },
];
const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'rating', label: 'Highest rated' },
];

const one = (value: string | string[] | undefined) => (typeof value === 'string' ? value : '');

export default async function ProjectsPage({ searchParams }: PageProps<'/dashboard/company/projects'>) {
  const params = await searchParams;
  const company = await getMyCompany(HERE);
  if (!company || company.status === 'rejected') return <NoCompany />;
  const query = {
    q: one(params.q).slice(0, 100),
    service: /^[a-z0-9-]{0,120}$/.test(one(params.service)) ? one(params.service) : '',
    status: STATUSES.some((item) => item.value === one(params.status)) ? one(params.status) : '',
    sort: SORTS.some((item) => item.value === one(params.sort)) ? one(params.sort) : 'newest',
    page: Math.max(1, Math.min(500, Number(one(params.page)) || 1)),
  };
  const data = await getMyProjects(HERE, query);
  const filtered = Boolean(query.q || query.service || query.status);
  const live = company.status === 'published';
  const reviewUrl = `${SITE_URL}/write-a-review?company=${company.slug}`;
  const hrefFor = (page: number) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...query, page: String(page) })) if (value && !(key === 'sort' && value === 'newest') && !(key === 'page' && value === '1')) next.set(key, String(value));
    const text = next.toString();
    return text ? `${HERE}?${text}` : HERE;
  };
  const totalReviews = data.counts.published + data.counts.pending + data.counts.rejected;

  return (
    <>
      <DashboardHeader
        eyebrow={company.name}
        title="Projects"
        intro="Every client project in one place: its review, its status, and the portfolio item that shows it off."
        action={live ? <ShareReviewLink url={reviewUrl} companyName={company.name} /> : undefined}
      />

      <section className="relative mb-8 overflow-hidden rounded-[var(--radius-card)] bg-night p-6 text-paper shadow-[var(--shadow-lift)] sm:p-8">
        <div className="pointer-events-none absolute -top-24 -right-20 size-72 rounded-full bg-accent/35 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 size-64 rounded-full bg-brand/25 blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-accent-soft uppercase">{totalReviews ? 'Keep it going' : 'Start here'}</p>
            <h2 className="mt-2 font-display text-2xl leading-tight font-semibold sm:text-3xl">Each project earns a review and a portfolio item</h2>
            <p className="mt-2 max-w-xl text-paper/75">
              Ask a past client for a review. Once our team approves it, turn the project into a portfolio item in one click.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {live ? (
              <>
                <ButtonLink href="/dashboard/company/reviews" size="md">
                  <Plus className="size-4" aria-hidden="true" />
                  Ask for a review
                </ButtonLink>
                <ShareReviewLink url={reviewUrl} companyName={company.name} variant="button" />
              </>
            ) : (
              <p className="max-w-xs text-sm text-paper/75">Your review link appears here as soon as your profile is live.</p>
            )}
          </div>
        </div>
      </section>

      <dl className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Count icon={Star} tone="text-brand bg-brand-tint" label="Reviews live" value={data.counts.published} />
        <Count icon={FolderOpen} tone="text-accent bg-accent-tint" label="Portfolio items" value={data.counts.portfolio} />
        <Count icon={Clock3} tone="text-saffron-ink bg-saffron-tint" label="Waiting for approval" value={data.counts.pending} />
      </dl>

      <form action={HERE} className="mb-6 grid gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))_auto]">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <label htmlFor="projects-q" className="sr-only">
            Search projects
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          <Input id="projects-q" name="q" type="search" defaultValue={query.q} placeholder="Client, project or service" className="pl-10" />
        </div>
        <FilterSelect name="service" label="Service" value={query.service} options={[{ value: '', label: 'All services' }, ...data.services.map((item) => ({ value: item.slug, label: item.name }))]} />
        <FilterSelect name="status" label="Status" value={query.status} options={STATUSES} />
        <FilterSelect name="sort" label="Sort" value={query.sort} options={SORTS} />
        <button type="submit" className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-night px-5 text-[15px] font-medium text-paper transition-colors hover:bg-night-soft">
          Apply
        </button>
      </form>

      {data.items.length ? (
        <>
          <p className="mb-4 text-sm text-ink-soft tabular-nums">
            {data.total} {data.total === 1 ? 'project' : 'projects'}
            {filtered && (
              <>
                {' '}
                ·{' '}
                <Link href={HERE} className="font-medium text-accent hover:underline">
                  Clear filters
                </Link>
              </>
            )}
          </p>
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.items.map((item, index) => (
              <li key={item.id} className="animate-rise" style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}>
                <ProjectTile item={item} />
              </li>
            ))}
          </ul>
          <Pagination page={data.page} totalPages={data.totalPages} hrefFor={hrefFor} />
        </>
      ) : (
        <div className="rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
          <MessageSquareQuote className="mx-auto size-10 text-accent" aria-hidden="true" />
          <p className="mt-4 font-display text-xl font-semibold text-ink">{filtered ? 'No projects match these filters' : 'No projects yet'}</p>
          <p className="mx-auto mt-1.5 max-w-md text-ink-soft">
            {filtered ? 'Try another search or clear the filters.' : 'Your first project appears here as soon as a client sends a review.'}
          </p>
          {filtered && (
            <ButtonLink href={HERE} variant="secondary" size="sm" className="mt-5">
              Clear filters
            </ButtonLink>
          )}
        </div>
      )}
    </>
  );
}

function Count({ icon: Icon, tone, label, value }: { icon: typeof Star; tone: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <dd className="font-display text-3xl leading-none font-semibold text-ink tabular-nums">{value}</dd>
        <dt className="mt-1 text-sm text-ink-soft">{label}</dt>
      </div>
    </div>
  );
}

function FilterSelect({ name, label, value, options }: { name: string; label: string; value: string; options: Array<{ value: string; label: string }> }) {
  return (
    <div>
      <label htmlFor={`projects-${name}`} className="sr-only">
        {label}
      </label>
      <Select id={`projects-${name}`} name={name} defaultValue={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

function ProjectTile({ item }: { item: ProjectCard }) {
  const client = item.reviewer.companyName || item.reviewer.name;
  return (
    <Link
      href={`${HERE}/${item.id}`}
      className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-paper-deep text-sm font-semibold text-ink-soft">{initials(client)}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink group-hover:text-accent">{client}</p>
          <p className="truncate text-sm text-ink-soft">{item.project.title}</p>
        </div>
        {item.featured && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-white">
            <Pin className="size-3" aria-hidden="true" />
            Featured
          </span>
        )}
      </div>
      <span className="mt-3 inline-flex w-fit rounded-full bg-paper px-2.5 py-1 text-xs text-ink-soft ring-1 ring-line">{item.project.serviceName}</span>
      <dl className="mt-4 space-y-2.5 border-t border-line pt-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase">Review</dt>
          <dd className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-medium text-ink tabular-nums">
              <Star className="size-3.5 fill-brand text-brand" aria-hidden="true" />
              {item.rating.toFixed(1)}
            </span>
            {item.verified && item.status === 'published' && <CheckCircle2 className="size-4 text-success" aria-label="Verified" />}
            <StatusPill status={item.status} kind="review" />
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase">Portfolio</dt>
          <dd>
            {item.portfolioItemId ? (
              <span className="inline-flex items-center gap-1 text-success">
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Added
              </span>
            ) : item.status === 'rejected' ? (
              <span className="text-ink-faint">–</span>
            ) : (
              <span className="inline-flex items-center gap-1 font-medium text-accent">
                <Plus className="size-3.5" aria-hidden="true" />
                Add
              </span>
            )}
          </dd>
        </div>
      </dl>
      <p className="mt-auto pt-4 text-xs text-ink-faint">Received {formatDay(item.createdAt)}</p>
    </Link>
  );
}
