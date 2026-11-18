import type { ReactNode } from 'react';
import type { CompanyStatus, ReviewStatus } from '@/lib/types';

export function DashboardHeader({ eyebrow, title, intro, action }: { eyebrow?: string; title: string; intro?: ReactNode; action?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">{eyebrow}</p>}
        <h1 className="mt-2 font-display text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
        {intro && <p className="mt-2 max-w-2xl text-ink-soft">{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

export function Panel({ title, children, className = '' }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-7 ${className}`}>
      {title && <h2 className="mb-5 font-display text-xl font-semibold text-ink">{title}</h2>}
      {children}
    </section>
  );
}

export function StatTile({ label, value, note }: { label: string; value: ReactNode; note?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-ink tabular-nums">{value}</p>
      {note && <p className="mt-1 text-[13px] text-ink-faint">{note}</p>}
    </div>
  );
}

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  pending: { label: 'In review', className: 'bg-saffron-tint text-saffron-ink' },
  published: { label: 'Live', className: 'bg-accent-tint text-accent' },
  approved: { label: 'Approved', className: 'bg-accent-tint text-accent' },
  rejected: { label: 'Not approved', className: 'bg-danger-tint text-danger' },
  suspended: { label: 'Paused', className: 'bg-paper-deep text-ink-soft' },
  new: { label: 'Sent', className: 'bg-saffron-tint text-saffron-ink' },
  contacted: { label: 'Replied', className: 'bg-accent-tint text-accent' },
  closed: { label: 'Closed', className: 'bg-paper-deep text-ink-soft' },
  unconfirmed: { label: 'Check your work email', className: 'bg-saffron-tint text-saffron-ink' },
};

/** Pending means something different to each kind of record. */
const PENDING_LABELS = {
  company: 'Verifying your details',
  review: 'Waiting to be published',
  claim: 'Waiting for verification',
} as const;

export function StatusPill({ status, kind }: { status: CompanyStatus | ReviewStatus | string; kind?: keyof typeof PENDING_LABELS }) {
  const base = STATUS_STYLES[status] ?? { label: status, className: 'bg-paper-deep text-ink-soft' };
  const style = status === 'pending' && kind ? { ...base, label: PENDING_LABELS[kind] } : base;
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${style.className}`}>{style.label}</span>;
}
