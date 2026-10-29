import { BadgeCheck, Building2, CalendarDays, MapPin, Wallet } from 'lucide-react';
import { formatDate, formatMonthYear, formatRating } from '@/lib/format';
import { budgetLabel, teamSizeLabel } from '@/lib/labels';
import type { Review } from '@/lib/types';
import { Stars } from '../ui/stars';

const SCORES: Array<{ key: keyof Review['ratings']; label: string }> = [
  { key: 'quality', label: 'Quality' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'cost', label: 'Cost' },
  { key: 'willingToRefer', label: 'Would refer' },
];

export function ReviewCard({ review }: { review: Review }) {
  const { reviewer, project } = review;
  const period = `${formatMonthYear(project.startedOn)} – ${project.ongoing || !project.endedOn ? 'Ongoing' : formatMonthYear(project.endedOn)}`;

  return (
    <article className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-4 border-b border-line pb-5 lg:border-r lg:border-b-0 lg:pr-6 lg:pb-0">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-semibold text-ink">{formatRating(review.ratings.overall)}</span>
              <Stars value={review.ratings.overall} />
            </div>
            <dl className="mt-3 space-y-1.5 text-sm">
              {SCORES.map(({ key, label }) => (
                <div key={key} className="flex justify-between gap-4">
                  <dt className="text-ink-soft">{label}</dt>
                  <dd className="font-medium text-ink">{formatRating(review.ratings[key])}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="text-sm">
            <p className="font-medium text-ink">{reviewer.name ?? 'Name withheld'}</p>
            <p className="text-ink-soft">
              {reviewer.jobTitle}
              {reviewer.companyName && `, ${reviewer.companyName}`}
            </p>
            <ul className="mt-3 space-y-1.5 text-ink-soft">
              {reviewer.industry && (
                <li className="flex items-center gap-2">
                  <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
                  {reviewer.industry}
                </li>
              )}
              <li className="flex items-center gap-2">
                <span className="inline-block size-3.5 shrink-0 rounded-full border border-current opacity-60" aria-hidden="true" />
                {teamSizeLabel(reviewer.companySize)}
              </li>
              {reviewer.location && (
                <li className="flex items-center gap-2">
                  <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                  {reviewer.location}
                </li>
              )}
            </ul>
            {review.verified && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand">
                <BadgeCheck className="size-4" aria-hidden="true" />
                Verified client
              </p>
            )}
          </div>
        </aside>

        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.12em] text-saffron-ink uppercase">{project.serviceName}</p>
          <h3 className="mt-1.5 font-display text-2xl leading-snug font-semibold text-ink">{project.title}</h3>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-soft">
            <li className="inline-flex items-center gap-1.5">
              <Wallet className="size-4" aria-hidden="true" />
              {budgetLabel(project.budget)}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden="true" />
              {period}
            </li>
          </ul>

          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink">
            <Section title="Background">{review.content.background}</Section>
            <Section title="The challenge">{review.content.challenge}</Section>
            <Section title="The solution">{review.content.solution}</Section>
            <Section title="Results">{review.content.results}</Section>
          </div>
          {review.publishedAt && <p className="mt-6 text-[13px] text-ink-faint">Published {formatDate(review.publishedAt)}</p>}
        </div>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: string }) {
  return (
    <section>
      <h4 className="text-sm font-semibold text-ink">{title}</h4>
      <p className="mt-1 whitespace-pre-line text-ink-soft">{children}</p>
    </section>
  );
}
