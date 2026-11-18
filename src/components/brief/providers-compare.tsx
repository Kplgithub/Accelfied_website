import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { budgetLabel, teamSizeLabel } from '@/lib/labels';
import type { BriefProvider } from '@/lib/types';
import { CompanyLogo } from '../company/company-logo';
import { RatingInline } from '../company/rating-inline';
import { VerifiedBadge } from '../ui/badge';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

/** Side-by-side view of the companies a brief went to. Every figure comes from real profile and review data. */
export function ProvidersCompare({ providers, budget }: { providers: BriefProvider[]; budget: string }) {
  const rows: Array<{ label: string; cell: (row: BriefProvider) => React.ReactNode }> = [
    {
      label: 'Budget fit',
      cell: (row) => (
        <div className="space-y-1.5">
          {row.estimate ? (
            <p className="font-medium text-ink tabular-nums">
              {usd.format(row.estimate.from)} – {usd.format(row.estimate.to)}
              <span className="block text-xs font-normal text-ink-faint">From their packages</span>
            </p>
          ) : (
            <p className="text-sm text-ink-faint">No package prices shared yet</p>
          )}
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${row.budgetFit === 'fits' ? 'bg-success/10 text-success' : 'bg-saffron-tint text-saffron-ink'}`}>
            {row.budgetFit === 'fits' ? `Works with ${budgetLabel(budget)}` : 'Usual minimum is higher'}
          </span>
        </div>
      ),
    },
    {
      label: 'Review summary',
      cell: (row) =>
        row.reviewSnippet ? (
          <figure>
            <blockquote className="text-sm leading-relaxed text-ink-soft">“{row.reviewSnippet.text}”</blockquote>
            <figcaption className="mt-1.5 text-xs text-ink-faint">{row.reviewSnippet.projectTitle}</figcaption>
          </figure>
        ) : (
          <p className="text-sm text-ink-faint">No published reviews yet</p>
        ),
    },
    {
      label: 'Relevant reviews',
      cell: (row) => (
        <p className="text-sm text-ink">
          <span className="font-display text-xl font-semibold tabular-nums">{row.serviceReviewCount}</span> for this service
        </p>
      ),
    },
    {
      label: 'Team size',
      cell: (row) => <p className="text-sm text-ink">{teamSizeLabel(row.company.teamSize)}</p>,
    },
  ];

  return (
    <div className="-mx-5 overflow-x-auto sm:mx-0">
      <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 w-36 bg-surface px-5 pb-4 align-bottom text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase sm:px-3">Companies</th>
            {providers.map((row, index) => (
              <th key={row.company.slug} className="min-w-[200px] px-3 pb-4 align-top font-normal" style={{ animation: `rise 600ms cubic-bezier(0.2,0.7,0.2,1) ${index * 90}ms both` }}>
                <div className="rounded-2xl border border-line bg-paper/60 p-4">
                  <CompanyLogo name={row.company.name} logoUrl={row.company.logoUrl} size={44} />
                  <p className="mt-2 font-medium text-ink">{row.company.name}</p>
                  <div className="mt-1">
                    <RatingInline average={row.company.rating.average} count={row.company.rating.count} size="sm" />
                  </div>
                  {row.company.verified && (
                    <div className="mt-2">
                      <VerifiedBadge premier={row.company.premier} />
                    </div>
                  )}
                  <p className="mt-2 text-xs text-ink-faint">
                    {row.company.headquarters.city}, {row.company.headquarters.country}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    <Link href={`/profile/${row.company.slug}`} className="font-medium text-accent hover:underline">
                      View profile
                    </Link>
                    {row.conversationId && (
                      <Link href={`/dashboard/messages/${row.conversationId}`} className="inline-flex items-center gap-1 font-medium text-accent hover:underline">
                        <MessageSquare className="size-3.5" aria-hidden="true" />
                        Messages
                      </Link>
                    )}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className="sticky left-0 z-10 border-t border-line bg-surface px-5 py-4 align-top text-sm font-medium text-ink-soft sm:px-3">
                {row.label}
              </th>
              {providers.map((provider) => (
                <td key={provider.company.slug} className="border-t border-line px-3 py-4 align-top">
                  {row.cell(provider)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
