import { ArrowRight, FilePlus2 } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DashboardHeader, Panel, StatusPill } from '@/components/dashboard/bits';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { getMyBriefs } from '@/lib/account-data';
import { formatDate } from '@/lib/format';
import { budgetLabel } from '@/lib/labels';

export const metadata: Metadata = { title: 'Project briefs' };

export default async function BriefsPage() {
  const briefs = await getMyBriefs('/dashboard/briefs');
  return (
    <>
      <DashboardHeader
        eyebrow="Hiring"
        title="Project briefs"
        intro="Write a brief once and compare the companies it goes to."
        action={
          <ButtonLink href="/project-brief" size="sm">
            <FilePlus2 className="size-4" aria-hidden="true" />
            New brief
          </ButtonLink>
        }
      />
      <Panel>
        {briefs.length ? (
          <ul className="divide-y divide-line">
            {briefs.map((brief) => (
              <li key={brief.id}>
                <Link href={`/dashboard/briefs/${brief.id}`} className="group flex items-center justify-between gap-4 py-4">
                  <span className="min-w-0">
                    <span className="block font-medium text-ink group-hover:text-accent">{brief.serviceName}</span>
                    <span className="block text-sm text-ink-soft">
                      {budgetLabel(brief.budget)} · {formatDate(brief.createdAt)}
                      {brief.sentCount > 0 && ` · sent to ${brief.sentCount}`}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <StatusPill status={brief.status} />
                    <ArrowRight className="size-4 text-accent transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No briefs yet" action={<ButtonLink href="/project-brief">Build a brief in minutes</ButtonLink>}>
            Answer seven short questions. We write the brief and send it to up to five companies that fit.
          </EmptyState>
        )}
      </Panel>
    </>
  );
}
