import { ArrowRight, BadgeCheck, MessageSquareQuote, Package, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { TrendChart } from '@/components/analytics/trend-chart';
import { HealthGauge } from '@/components/charts/health-gauge';
import { CountUp } from '@/components/motion/count-up';
import { Reveal } from '@/components/motion/reveal';
import { ButtonLink } from '@/components/ui/button';
import type { ProfileHealth } from '@/lib/profile-health';
import type { CompanyAnalytics, OwnedCompany } from '@/lib/types';
import { Certifications } from '../vendor/certifications';
import { RecommendedTasks } from '../vendor/recommended-tasks';
import { recommendedTasks } from '@/lib/tasks';
import type { Certification, CertificationRules } from '@/lib/vendor-tools';
import { Panel } from './bits';

const HEALTH_TEXT = {
  Great: 'Clients see everything they need to trust you. Keep adding reviews and projects.',
  Good: 'A solid start. A few more sections will lift you in the directory.',
  'Needs work': 'Fill in the sections below so clients can judge your work.',
} as const;

/** The top of a company owner's dashboard: health, reviews, the last 90 days and what to do next. */
export function CompanyHome({
  company,
  health,
  analytics,
  hasPackages,
  skippedTasks,
  certifications,
}: {
  company: OwnedCompany;
  health: ProfileHealth;
  analytics: CompanyAnalytics | null;
  hasPackages: boolean;
  skippedTasks: string[];
  certifications: { items: Certification[]; rules: CertificationRules } | null;
}) {
  const next = health.todo[0];
  const tasks = recommendedTasks(company, health);
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
          <p className="text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase">Profile score</p>
          <div className="mt-3 flex items-center gap-5">
            <HealthGauge score={health.score} label={health.label} />
            <div>
              <p className="font-display text-3xl font-semibold text-ink">
                {health.label} <span className="text-lg font-medium text-ink-faint tabular-nums">{health.score}/100</span>
              </p>
              <p className="mt-1 text-sm text-ink-soft">{HEALTH_TEXT[health.label]}</p>
            </div>
          </div>
          {next && (
            <Link href={next.href} className="group mt-5 flex items-center justify-between gap-3 rounded-xl bg-accent-tint px-4 py-3 text-sm text-ink transition-colors hover:bg-accent/15">
              <span>
                <span className="font-medium">Next: {next.title}.</span> {next.tip}
              </span>
              <ArrowRight className="size-4 shrink-0 text-accent transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          )}
        </Reveal>

        <Reveal delay={80} className="flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase">
            <MessageSquareQuote className="size-4 text-brand" aria-hidden="true" />
            Client reviews
          </p>
          <p className="mt-3 font-display text-3xl font-semibold text-ink tabular-nums">
            {company.rating.count > 0 ? (
              <>
                {company.rating.average.toFixed(1)} <span className="text-lg font-medium text-ink-faint">from {company.rating.count} {company.rating.count === 1 ? 'review' : 'reviews'}</span>
              </>
            ) : (
              'No reviews yet'
            )}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Ask a past client for a review. It takes them about ten minutes, and our team checks every review before it shows.
          </p>
          <div className="mt-auto pt-5">
            <ButtonLink href="/dashboard/company/reviews" size="sm">
              Request a review
            </ButtonLink>
          </div>
        </Reveal>
      </div>

      {!company.verified ? (
        <Reveal className="relative overflow-hidden rounded-[var(--radius-card)] bg-night p-6 text-paper shadow-[var(--shadow-lift)] sm:p-7">
          <div className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-accent/30 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <BadgeCheck className="size-6 text-accent-soft" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-xl font-semibold">Get Accelfied and stand out</p>
                <p className="mt-1 max-w-xl text-sm text-paper/75">Verified companies show a trust badge, rank above unverified ones and get a blog feature written by our team.</p>
              </div>
            </div>
            <ButtonLink href="/dashboard/company/verified" size="sm">
              See plans
            </ButtonLink>
          </div>
        </Reveal>
      ) : !hasPackages ? (
        <Reveal className="relative overflow-hidden rounded-[var(--radius-card)] border border-accent/30 bg-gradient-to-br from-accent-tint to-surface p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-white">
                <Package className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-xl font-semibold text-ink">Show clients a price range</p>
                <p className="mt-1 max-w-xl text-sm text-ink-soft">Add Starter, Growth and Scale packages. Clients who can see prices send briefs that fit your budget.</p>
              </div>
            </div>
            <ButtonLink href="/dashboard/company/packages" size="sm">
              Add packages
            </ButtonLink>
          </div>
        </Reveal>
      ) : null}

      <Panel>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
              <TrendingUp className="size-5 text-accent" aria-hidden="true" />
              90-day performance
            </h2>
            <p className="text-sm text-ink-soft">How clients found and used your profile.</p>
          </div>
          <Link href="/dashboard/company/analytics?days=90" className="text-sm font-medium text-accent hover:underline">
            Full analytics
          </Link>
        </div>
        {analytics ? (
          <>
            <dl className="mb-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Seen in lists', value: analytics.totals.impressions },
                { label: 'Profile views', value: analytics.totals.views },
                { label: 'Website clicks', value: analytics.totals.websiteClicks },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-line bg-paper/60 p-4">
                  <dt className="text-sm text-ink-soft">{stat.label}</dt>
                  <dd className="mt-1 font-display text-3xl font-semibold text-ink tabular-nums">
                    <CountUp value={stat.value} />
                  </dd>
                </div>
              ))}
            </dl>
            <TrendChart series={analytics.series} />
          </>
        ) : (
          <p className="text-ink-soft">Numbers appear here once your profile is live and clients start seeing it.</p>
        )}
      </Panel>

      {certifications && <Certifications items={certifications.items} rules={certifications.rules} />}

      <RecommendedTasks tasks={tasks} skipped={skippedTasks} />
    </div>
  );
}
