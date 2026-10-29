import { formatRating, pluralize } from '@/lib/format';
import { Stars } from '../ui/stars';

/** Rating and review count, always from real reviews. Shows a neutral note when there are none. */
export function RatingInline({ average, count, size = 'md' }: { average: number; count: number; size?: 'sm' | 'md' }) {
  if (count === 0) {
    return <span className="text-sm text-ink-faint">No reviews yet</span>;
  }
  return (
    <span className="inline-flex items-center gap-2" aria-label={`Rated ${formatRating(average)} out of 5 from ${pluralize(count, 'review')}`}>
      <span className={`font-semibold text-ink ${size === 'sm' ? 'text-sm' : 'text-base'}`}>{formatRating(average)}</span>
      <Stars value={average} size={size === 'sm' ? 14 : 16} />
      <span className="text-sm text-ink-soft underline decoration-line-strong underline-offset-4">
        {pluralize(count, 'review')}
      </span>
    </span>
  );
}
