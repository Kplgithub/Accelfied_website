import { ArrowLeft, CheckCircle2, MailCheck } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BriefEditor } from '@/components/brief/brief-editor';
import { BRIEF_OUTLINE } from '@/lib/brief-outline';
import { ProvidersCompare } from '@/components/brief/providers-compare';
import { SendPanel } from '@/components/brief/send-panel';
import { Panel } from '@/components/dashboard/bits';
import { getMyBrief } from '@/lib/account-data';
import { countryName } from '@/lib/countries';
import { budgetLabel, teamSizeLabel, timelineLabel } from '@/lib/labels';
import { requireUser } from '@/lib/session';
import type { ProjectBrief } from '@/lib/types';

export const metadata: Metadata = { title: 'Project brief' };

function locationText(brief: ProjectBrief): string {
  if (brief.locationPreference === 'countries') return brief.countries.map(countryName).join(', ');
  if (brief.locationPreference === 'near') return `Near ${brief.nearCity || 'me'}`;
  return 'No preference';
}

export default async function BriefPage({ params }: PageProps<'/dashboard/briefs/[id]'>) {
  const { id } = await params;
  const here = `/dashboard/briefs/${id}`;
  const { user } = await requireUser(here);
  const data = await getMyBrief(here, id);
  if (!data) notFound();
  const { brief, providers, suggestions } = data;
  const sent = brief.status === 'sent';
  const contactName = `${user.firstName} ${user.lastName}`.trim();

  const facts = [
    { label: 'Service', value: brief.serviceName },
    { label: 'Budget', value: budgetLabel(brief.budget) },
    { label: 'Start', value: timelineLabel(brief.timeline) },
    { label: 'Company size', value: brief.employees ? teamSizeLabel(brief.employees) : 'Not given' },
    { label: 'Location preference', value: locationText(brief) },
    { label: 'Contact', value: `${contactName} · ${user.email}` },
  ];

  return (
    <>
      <Link href="/dashboard/briefs" className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" />
        All project briefs
      </Link>

      {sent ? (
        <section className="relative mb-8 overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-br from-accent-tint via-surface to-surface p-7 text-center shadow-[var(--shadow-card)] sm:p-10">
          <span className="mx-auto flex size-16 animate-rise items-center justify-center rounded-2xl bg-accent text-white shadow-[var(--shadow-lift)]">
            <MailCheck className="size-8" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Project sent to {brief.sentCount} {brief.sentCount === 1 ? 'company' : 'companies'}!
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-ink-soft">
            We sent your brief to these companies. Compare them side by side, then reply to the ones you like in Messages.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            <a href="#brief" className="inline-flex h-10 items-center rounded-full border border-line-strong bg-surface px-4 font-medium text-ink hover:border-ink">
              View brief
            </a>
            {suggestions.length > 0 && (
              <a href="#more" className="inline-flex h-10 items-center rounded-full bg-ink px-4 font-medium text-paper hover:bg-night-soft">
                Send to more companies
              </a>
            )}
          </div>
        </section>
      ) : (
        <header className="mb-8">
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Your project brief</p>
          <h1 className="mt-2 font-display text-3xl leading-tight font-semibold text-ink sm:text-4xl">Request for {brief.serviceName}</h1>
          <ol className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
            {['Review your project details', 'We send it to the best-fit companies', 'Get replies in Messages'].map((step, index) => (
              <li key={step} className="flex items-center gap-2">
                <CheckCircle2 className={`size-4 ${index === 0 ? 'text-accent' : 'text-line-strong'}`} aria-hidden="true" />
                {step}
              </li>
            ))}
          </ol>
        </header>
      )}

      {sent && providers.length > 0 && (
        <Panel title="Compare companies" className="mb-8">
          <ProvidersCompare providers={providers} budget={brief.budget} />
        </Panel>
      )}

      <div id="brief" className="grid scroll-mt-32 gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden xl:block xl:sticky xl:top-32 xl:self-start">
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase">Outline</p>
          <nav aria-label="Brief outline">
            <ul className="space-y-1 text-[15px]">
              {BRIEF_OUTLINE.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="block rounded-xl px-3 py-1.5 text-ink-soft hover:bg-ink/5 hover:text-ink">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="min-w-0 space-y-6">
          <Panel>
            <dl className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label} className="rounded-2xl border border-line bg-paper/60 px-4 py-3">
                  <dt className="text-xs text-ink-faint">{fact.label}</dt>
                  <dd className="mt-0.5 text-sm font-medium break-words text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <BriefEditor brief={brief} readOnly={sent} />
          </Panel>
          <div id="more" className="scroll-mt-32">
            <Panel title={sent ? 'Send to more companies' : 'Send to the best-fit companies'}>
              <p className="-mt-3 mb-5 text-sm text-ink-soft">
                Verified companies come first, then by rating. Pick up to five.
              </p>
              <SendPanel briefId={brief.id} suggestions={suggestions} contactName={contactName} more={sent} />
            </Panel>
          </div>
        </div>
      </div>
    </>
  );
}
