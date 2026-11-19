import { ArrowDownRight, ArrowUpRight, Download, Megaphone, Minus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { TrendChart } from '@/components/analytics/trend-chart';
import { DashboardHeader, Panel } from '@/components/dashboard/bits';
import { UpgradeStrip } from '@/components/dashboard/upgrade-strip';
import { NoCompany } from '@/components/dashboard/no-company';
import { PageFilter } from '@/components/vendor/page-filter';
import { getMyCompany } from '@/lib/account-data';
import { formatCount } from '@/lib/format';
import { pageName } from '@/lib/page-name';
import { getMyPerformance, PERFORMANCE_DAYS } from '@/lib/vendor-tools';

export const metadata: Metadata = { title: 'Performance' };

const HERE = '/dashboard/company/analytics';
const ROWS = 15;

const dayLabel = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const label = (day: string) => dayLabel.format(new Date(`${day}T00:00:00Z`));
const percent = (part: number, whole: number) => (whole ? `${((part / whole) * 100).toFixed(1)}%` : '–');
const rangeLabel = (days: number) => (days === 365 ? 'Last 12 months' : days === 180 ? 'Last 6 months' : `Last ${days} days`);

export default async function AnalyticsPage({ searchParams }: PageProps<'/dashboard/company/analytics'>) {
  const params = await searchParams;
  const raw = Number(params.days);
  const days = (PERFORMANCE_DAYS as readonly number[]).includes(raw) ? raw : 90;
  const page = typeof params.page === 'string' ? params.page.slice(0, 300) : '';
  const showAll = params.rows === 'all';
  const company = await getMyCompany(HERE);
  if (!company || company.status === 'rejected') return <NoCompany />;
  const stats = await getMyPerformance(HERE, days, page);
  const { totals, previous } = stats;
  const href = (next: { days?: number; page?: string; rows?: string }) => {
    const query = new URLSearchParams();
    query.set('days', String(next.days ?? days));
    const p = next.page ?? page;
    if (p) query.set('page', p);
    if (next.rows) query.set('rows', next.rows);
    return `${HERE}?${query}`;
  };
  const exportHref = `${HERE}/export?${new URLSearchParams({ days: String(days), ...(page ? { page } : {}) })}`;
  const rows = showAll ? stats.pages : stats.pages.slice(0, ROWS);

  return (
    <>
      <DashboardHeader
        eyebrow={company.name}
        title="Performance"
        intro={`How clients found and used your profile from ${label(stats.from)} to ${label(stats.to)} (IST). Updated every few seconds.`}
      />

      <UpgradeStrip company={company} />
      <div className="mb-6 flex flex-col gap-3">
        <nav aria-label="Date range" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          {PERFORMANCE_DAYS.map((range) => (
            <Link
              key={range}
              href={href({ days: range })}
              aria-current={range === days ? 'page' : undefined}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                range === days ? 'bg-night text-paper' : 'bg-surface text-ink-soft ring-1 ring-line-strong hover:text-ink'
              }`}
            >
              {rangeLabel(range)}
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-2">
          <PageFilter days={days} page={stats.page} options={stats.pageOptions.map((value) => ({ value, label: pageName(value) }))} />
          <a
            href={exportHref}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-surface px-4 text-sm font-medium text-ink ring-1 ring-line-strong transition-colors hover:bg-paper"
            download
          >
            <Download className="size-4" aria-hidden="true" />
            Export CSV
          </a>
        </div>
      </div>

      {stats.page && (
        <p className="mb-4 rounded-xl bg-accent-tint px-4 py-2.5 text-sm text-ink">
          Showing <span className="font-medium">{pageName(stats.page)}</span> only.{' '}
          <Link href={href({ page: '' })} className="font-medium text-accent hover:underline">
            Show all pages
          </Link>
        </p>
      )}

      <section aria-label={`${rangeLabel(days)} at a glance`} className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric label="Seen in lists" value={totals.impressions} before={previous.impressions} note="Times your card showed in a list" />
        <Metric label="Profile views" value={totals.views} before={previous.views} note={`${percent(totals.views, totals.impressions)} of list views`} />
        {totals.websiteClicks !== null ? (
          <Metric label="Website clicks" value={totals.websiteClicks} before={previous.websiteClicks ?? 0} note={`${percent(totals.websiteClicks, totals.views)} of profile views`} />
        ) : (
          <Metric label="Website clicks" value={null} note="Counted for all pages together" />
        )}
        {totals.leads !== null ? (
          <Metric label="Project briefs" value={totals.leads} before={previous.leads ?? 0} note="Sent to you directly" />
        ) : (
          <Metric label="Project briefs" value={null} note="Counted for all pages together" />
        )}
      </section>

      <Panel title="Day by day" className="mb-8">
        <TrendChart series={stats.series} only={stats.page ? ['impressions', 'views'] : ['impressions', 'views', 'websiteClicks']} />
      </Panel>

      <Panel title="Where clients see you" className="mb-8">
        {rows.length ? (
          <>
            <div className="-mx-5 overflow-x-auto sm:mx-0">
              <table className="w-full min-w-[640px] text-left text-sm tabular-nums">
                <thead className="text-ink-soft">
                  <tr className="border-b border-line">
                    <th className="px-5 py-2.5 font-medium sm:px-3">Page</th>
                    <th className="px-3 py-2.5 font-medium">Type</th>
                    <th className="px-3 py-2.5 text-right font-medium">Seen</th>
                    <th className="px-3 py-2.5 text-right font-medium">Profile views</th>
                    <th className="px-3 py-2.5 text-right font-medium">Avg. position</th>
                    <th className="px-5 py-2.5 text-right font-medium sm:px-3">
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((row) => {
                    const directory = row.page.startsWith('/agencies/');
                    return (
                      <tr key={row.page} className="transition-colors hover:bg-paper/60">
                        <td className="px-5 py-3 sm:px-3">
                          <Link href={href({ page: row.page })} className="block font-medium text-ink hover:text-accent">
                            {pageName(row.page)}
                          </Link>
                          <span className="block text-[12px] text-ink-faint">{row.page}</span>
                        </td>
                        <td className="px-3 py-3 text-ink-soft">{directory ? 'Directory' : row.page.startsWith('/blog') ? 'Blog' : 'Other'}</td>
                        <td className="px-3 py-3 text-right text-ink">{formatCount(row.impressions)}</td>
                        <td className="px-3 py-3 text-right text-ink">{formatCount(row.views)}</td>
                        <td className="px-3 py-3 text-right text-ink">{row.avgPosition ? `#${row.avgPosition}` : '–'}</td>
                        <td className="px-5 py-3 text-right sm:px-3">
                          {directory && (row.avgPosition === 0 || row.avgPosition > 3) ? (
                            <Link
                              href="/dashboard/company/sponsored"
                              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-medium whitespace-nowrap text-brand ring-1 ring-brand/30 transition-colors hover:bg-brand-tint"
                            >
                              Move up
                            </Link>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {stats.pages.length > ROWS && (
              <Link href={href({ rows: showAll ? undefined : 'all' })} className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
                {showAll ? 'Show the top 15' : `Show all ${stats.pages.length} pages`}
              </Link>
            )}
          </>
        ) : (
          <p className="text-ink-soft">
            Nothing yet for these days. When your card shows on a directory page, the page and your position on it appear here.
          </p>
        )}
      </Panel>

      <section className="relative overflow-hidden rounded-[var(--radius-card)] bg-night p-6 text-paper shadow-[var(--shadow-lift)] sm:p-7">
        <div className="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <Megaphone className="size-5 text-accent-soft" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-xl font-semibold">Want to sit at the top of a page?</p>
              <p className="mt-1 max-w-xl text-sm text-paper/75">A sponsored place keeps you in the first three on the directory page you pick, for the clients already searching there.</p>
            </div>
          </div>
          <Link href="/dashboard/company/sponsored" className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-strong">
            See sponsored places
          </Link>
        </div>
      </section>
    </>
  );
}

function Metric({ label, value, before, note }: { label: string; value: number | null; before?: number; note: string }) {
  const change = value === null || before === undefined ? null : before === 0 ? (value > 0 ? null : 0) : Math.round(((value - before) / before) * 100);
  const isNew = value !== null && before === 0 && value > 0;
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-ink tabular-nums">{value === null ? '–' : formatCount(value)}</p>
      {value !== null && before !== undefined && (
        <p
          className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums ${
            isNew || (change ?? 0) > 0 ? 'bg-accent-tint text-accent' : (change ?? 0) < 0 ? 'bg-danger-tint text-danger' : 'bg-paper-deep text-ink-soft'
          }`}
        >
          {isNew || (change ?? 0) > 0 ? <ArrowUpRight className="size-3.5" aria-hidden="true" /> : (change ?? 0) < 0 ? <ArrowDownRight className="size-3.5" aria-hidden="true" /> : <Minus className="size-3.5" aria-hidden="true" />}
          {isNew ? 'New this period' : change === 0 ? 'Same as period before' : `${change! > 0 ? '+' : ''}${change}% vs. period before`}
        </p>
      )}
      <p className="mt-1.5 text-[13px] text-ink-faint">{note}</p>
    </div>
  );
}
