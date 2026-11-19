import type { Metadata } from 'next';
import Link from 'next/link';
import { TrendChart } from '@/components/analytics/trend-chart';
import { UpgradeStrip } from '@/components/dashboard/upgrade-strip';
import { DashboardHeader, Panel, StatTile } from '@/components/dashboard/bits';
import { NoCompany } from '@/components/dashboard/no-company';
import { getMyCompany, getMyCompanyAnalytics } from '@/lib/account-data';
import { formatCount } from '@/lib/format';

export const metadata: Metadata = { title: 'Analytics' };

const HERE = '/dashboard/company/analytics';
const RANGES = [7, 30, 90] as const;

const dayLabel = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const label = (day: string) => dayLabel.format(new Date(`${day}T00:00:00Z`));
const percent = (part: number, whole: number) => (whole ? `${((part / whole) * 100).toFixed(1)}%` : '–');

/** Readable names for the pages a company appears on. */
function pageName(path: string): string {
  if (path === '/') return 'Home page';
  if (path === '/agencies') return 'All companies';
  if (path === '/dashboard/shortlist') return 'Client shortlists';
  const parts = path.split('/').filter(Boolean);
  if (parts[0] === 'agencies') return parts.slice(1).map((part) => part.replace(/-/g, ' ')).join(' in ').replace(/^\w/, (c) => c.toUpperCase());
  if (parts[0] === 'blog') return 'Blog';
  if (parts[0] === 'profile') return 'Other company profiles';
  return path;
}

export default async function AnalyticsPage({ searchParams }: PageProps<'/dashboard/company/analytics'>) {
  const raw = Number((await searchParams).days);
  const days = (RANGES as readonly number[]).includes(raw) ? raw : 30;
  const company = await getMyCompany(HERE);
  if (!company || company.status === 'rejected') return <NoCompany />;
  const stats = await getMyCompanyAnalytics(HERE, days);
  const { totals } = stats;

  return (
    <>
      <DashboardHeader
        eyebrow={company.name}
        title="Analytics"
        intro={`How clients found and used your profile from ${label(stats.from)} to ${label(stats.to)} (IST). Updated every few seconds.`}
      />
      <UpgradeStrip company={company} />
      <nav aria-label="Date range" className="mb-6 flex flex-wrap gap-2">
        {RANGES.map((range) => (
          <Link
            key={range}
            href={`${HERE}?days=${range}`}
            aria-current={range === days ? 'page' : undefined}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              range === days ? 'bg-night text-paper' : 'bg-surface text-ink-soft ring-1 ring-line-strong hover:text-ink'
            }`}
          >
            Last {range} days
          </Link>
        ))}
      </nav>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatTile label="Seen in lists" value={formatCount(totals.impressions)} note="Times your card showed in a list" />
        <StatTile label="Profile views" value={formatCount(totals.views)} note={`${percent(totals.views, totals.impressions)} of list views`} />
        <StatTile label="Website clicks" value={formatCount(totals.websiteClicks)} note={`${percent(totals.websiteClicks, totals.views)} of profile views`} />
        <StatTile label="Briefs" value={formatCount(totals.leads)} note="Project briefs sent to you" />
        <StatTile label="Shortlisted" value={formatCount(totals.shortlists)} note="Clients who saved you" />
      </div>
      <Panel title="Day by day" className="mb-8">
        <TrendChart series={stats.series} />
      </Panel>
      <Panel title="Where clients see you">
        {stats.pages.length ? (
          <div className="-mx-5 overflow-x-auto sm:mx-0">
            <table className="w-full min-w-[520px] text-left text-sm tabular-nums">
              <thead className="text-ink-soft">
                <tr className="border-b border-line">
                  <th className="px-5 py-2.5 font-medium sm:px-3">Page</th>
                  <th className="px-3 py-2.5 text-right font-medium">Seen</th>
                  <th className="px-3 py-2.5 text-right font-medium">Average position</th>
                  <th className="px-5 py-2.5 text-right font-medium sm:px-3">Profile views from here</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {stats.pages.map((row) => (
                  <tr key={row.page}>
                    <td className="px-5 py-3 sm:px-3">
                      <span className="block font-medium text-ink">{pageName(row.page)}</span>
                      <span className="block text-[12px] text-ink-faint">{row.page}</span>
                    </td>
                    <td className="px-3 py-3 text-right text-ink">{formatCount(row.impressions)}</td>
                    <td className="px-3 py-3 text-right text-ink">{row.avgPosition ? `#${row.avgPosition}` : '–'}</td>
                    <td className="px-5 py-3 text-right text-ink sm:px-3">{formatCount(row.views)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-ink-soft">
            Nothing yet for these days. When your card shows on a directory page, the page and your position on it appear here.
          </p>
        )}
      </Panel>
    </>
  );
}
