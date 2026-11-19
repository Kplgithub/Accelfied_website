import { Award, CheckCircle2, CircleDashed } from 'lucide-react';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui/button';
import type { Certification, CertificationRules } from '@/lib/vendor-tools';

/** Progress towards a certification for each service line, from published reviews and the profile's service split. */
export function Certifications({ items, rules }: { items: Certification[]; rules: CertificationRules }) {
  const earned = items.filter((item) => item.earned).length;
  return (
    <section className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
            <Award className="size-5 text-brand" aria-hidden="true" />
            Service certifications
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            Earn a certification for a service and it shows on your profile, so clients know your work there is proven. Each one needs{' '}
            {rules.reviews}+ published reviews rated {rules.minRating.toFixed(1)} or higher in the last {rules.months} months, and at least {rules.minShare}% of
            your work in that service.
          </p>
        </div>
        <span className="rounded-full bg-accent-tint px-3 py-1 text-sm font-medium text-accent tabular-nums">
          {earned} of {items.length} earned
        </span>
      </div>
      {items.length === 0 ? (
        <p className="mt-5 text-ink-soft">
          Add your service lines first.{' '}
          <Link href="/dashboard/company?section=services" className="font-medium text-accent hover:underline">
            Add services
          </Link>
        </p>
      ) : (
        <div className="-mx-1 mt-5 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
          {items.map((item) => {
            const progress = Math.min(item.qualifyingReviews, rules.reviews) / rules.reviews;
            return (
              <article
                key={item.slug}
                className={`flex w-[280px] shrink-0 snap-start flex-col rounded-2xl border p-5 transition-shadow hover:shadow-[var(--shadow-card)] ${
                  item.earned ? 'border-success/40 bg-gradient-to-br from-accent-tint to-surface' : 'border-line bg-paper/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-ink">{item.name}</h3>
                  {item.earned ? (
                    <span className="shrink-0 rounded-full bg-success px-2.5 py-0.5 text-xs font-semibold text-white">Earned</span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-saffron-tint px-2.5 py-0.5 text-xs font-medium text-saffron-ink">
                      {item.reviewsNeeded > 0 ? `Needs ${item.reviewsNeeded} ${item.reviewsNeeded === 1 ? 'review' : 'reviews'}` : 'Almost there'}
                    </span>
                  )}
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-paper-deep" role="progressbar" aria-valuemin={0} aria-valuemax={rules.reviews} aria-valuenow={Math.min(item.qualifyingReviews, rules.reviews)} aria-label={`${item.name} reviews`}>
                  <div className="h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${progress * 100}%` }} />
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  <Criterion met={item.reviewsMet}>
                    {rules.reviews}+ reviews rated {rules.minRating.toFixed(1)}+{' '}
                    <span className="text-ink-faint">
                      (you have {item.qualifyingReviews})
                    </span>
                  </Criterion>
                  <Criterion met={item.shareMet}>
                    {rules.minShare}%+ of your work{' '}
                    <span className="text-ink-faint">(now {item.share}%)</span>
                  </Criterion>
                </ul>
                {!item.earned && (
                  <div className="mt-auto pt-4">
                    {item.reviewsMet ? (
                      <ButtonLink href="/dashboard/company?section=services" variant="secondary" size="sm">
                        Update service split
                      </ButtonLink>
                    ) : (
                      <ButtonLink href="/dashboard/company/reviews" variant="secondary" size="sm">
                        Ask for a review
                      </ButtonLink>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Criterion({ met, children }: { met: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-ink-soft">
      {met ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-label="Done" /> : <CircleDashed className="mt-0.5 size-4 shrink-0 text-ink-faint" aria-label="Not yet" />}
      <span>{children}</span>
    </li>
  );
}
