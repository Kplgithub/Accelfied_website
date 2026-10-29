import Link from 'next/link';
import { formatDate } from '@/lib/format';
import { budgetLabel, timelineLabel } from '@/lib/labels';
import type { Lead, SentLead } from '@/lib/types';
import { StatusPill } from './bits';

/** One brief. `view` decides whose details are shown: the client's or the company's. */
export function LeadCard({ lead, view }: { lead: Lead | SentLead; view: 'client' | 'company' }) {
  const company = 'company' in lead ? lead.company : null;
  return (
    <article className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-ink">{lead.serviceName}</p>
          <p className="text-sm text-ink-soft">
            {view === 'client' ? (
              company ? (
                <>
                  To{' '}
                  <Link href={`/profile/${company.slug}`} className="font-medium text-accent underline-offset-4 hover:underline">
                    {company.name}
                  </Link>
                </>
              ) : (
                'Open brief for matching companies'
              )
            ) : (
              <>
                From {lead.contact.name}
                {lead.contact.companyName && `, ${lead.contact.companyName}`}
              </>
            )}
          </p>
        </div>
        <StatusPill status={lead.status} />
      </div>
      <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-ink-soft">{lead.description}</p>
      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div>
          <dt className="inline text-ink-faint">Budget </dt>
          <dd className="inline font-medium text-ink">{budgetLabel(lead.budget)}</dd>
        </div>
        <div>
          <dt className="inline text-ink-faint">Start </dt>
          <dd className="inline font-medium text-ink">{timelineLabel(lead.timeline)}</dd>
        </div>
        <div>
          <dt className="inline text-ink-faint">Sent </dt>
          <dd className="inline font-medium text-ink">{formatDate(lead.createdAt)}</dd>
        </div>
      </dl>
      {view === 'company' && (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-4 text-sm">
          <a href={`mailto:${lead.contact.email}`} className="font-medium text-accent underline-offset-4 hover:underline">
            {lead.contact.email}
          </a>
          {lead.contact.phone && (
            <a href={`tel:${lead.contact.phone.replace(/\s+/g, '')}`} className="font-medium text-accent underline-offset-4 hover:underline">
              {lead.contact.phone}
            </a>
          )}
        </div>
      )}
    </article>
  );
}
