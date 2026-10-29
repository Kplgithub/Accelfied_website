import type { ReactNode } from 'react';

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="grain rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface/60 px-6 py-14 text-center">
      <svg viewBox="0 0 64 64" className="mx-auto mb-5 size-14 text-line-strong" aria-hidden="true">
        <circle cx="28" cy="28" r="17" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M41 41l12 12" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M21 29c3 3 11 3 14 0" fill="none" stroke="var(--saffron)" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {children && <div className="mx-auto mt-2 max-w-md text-ink-soft">{children}</div>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
