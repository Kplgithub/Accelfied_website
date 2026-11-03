import { formatRating, pluralize } from '@/lib/format';
import type { CompanyProfile } from '@/lib/types';
import { Stars } from '../ui/stars';

const SUBSCORES = [
  { key: 'quality', label: 'Quality' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'cost', label: 'Cost' },
  { key: 'willingToRefer', label: 'Would refer' },
] as const;

export function RatingSummary({ rating }: { rating: CompanyProfile['rating'] }) {
  const max = Math.max(1, ...Object.values(rating.distribution));
  return (
    <div className="grid gap-8 rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-8 md:grid-cols-[auto_1fr_1fr] md:items-center">
      <div className="text-center md:pr-8 md:text-left">
        <p className="font-display text-6xl font-semibold text-ink">{formatRating(rating.average)}</p>
        <Stars value={rating.average} size={20} className="mt-2" />
        <p className="mt-2 text-sm text-ink-soft">{pluralize(rating.count, 'review')}</p>
      </div>
      <ul className="space-y-2" aria-label="Rating breakdown">
        {([5, 4, 3, 2, 1] as const).map((star) => {
          const count = rating.distribution[String(star) as '1'] ?? 0;
          return (
            <li key={star} className="flex items-center gap-3 text-sm">
              <span className="w-10 text-ink-soft">{star} star</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-paper-deep">
                <span className="block h-full rounded-full bg-saffron" style={{ width: `${(count / max) * 100}%` }} />
              </span>
              <span className="w-8 text-right tabular-nums text-ink-soft">{count}</span>
            </li>
          );
        })}
      </ul>
      <dl className="grid grid-cols-2 gap-4">
        {SUBSCORES.map(({ key, label }) => (
          <div key={key} className="rounded-xl bg-paper px-4 py-3">
            <dt className="text-xs text-ink-faint">{label}</dt>
            <dd className="mt-0.5 font-display text-2xl font-semibold text-ink">{formatRating(rating[key])}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
