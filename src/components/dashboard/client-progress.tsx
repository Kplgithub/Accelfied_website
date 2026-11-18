'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export interface ClientStep {
  title: string;
  done: boolean;
  href: string;
  cta: string;
}

/** "You are one step closer": a ring that fills with each finished step, and the list of steps. */
export function ClientProgress({ steps }: { steps: ClientStep[] }) {
  const done = steps.filter((step) => step.done).length;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(done));
    return () => cancelAnimationFrame(frame);
  }, [done]);
  const next = steps.findIndex((step) => !step.done);
  const share = (shown / steps.length) * 100;
  return (
    <div className="grid items-center gap-8 rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] md:grid-cols-[220px_minmax(0,1fr)] sm:p-7">
      <div className="text-center">
        <p className="font-display text-lg font-semibold text-ink">{done === steps.length ? 'All done. Nice work!' : 'You are one step closer'}</p>
        <div className="relative mx-auto mt-4 size-32">
          <svg viewBox="0 0 42 42" className="size-full -rotate-90" role="img" aria-label={`${done} of ${steps.length} steps done`}>
            <circle cx="21" cy="21" r="15.9155" fill="none" stroke="var(--paper-deep)" strokeWidth="3.5" />
            <circle
              cx="21"
              cy="21"
              r="15.9155"
              fill="none"
              stroke="url(#client-ring)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`${share} ${100 - share}`}
              className="transition-[stroke-dasharray] duration-1000 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
            />
            <defs>
              <linearGradient id="client-ring" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#1b7499" />
                <stop offset="100%" stopColor="#1c7a4f" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-semibold text-ink tabular-nums">
              {done}/{steps.length}
            </span>
            <span className="text-xs text-ink-faint">steps</span>
          </span>
        </div>
        <p className="mt-3 text-sm text-ink-soft">to finding your next business partner</p>
      </div>
      <ol className="space-y-2">
        {steps.map((step, index) => {
          const current = index === next;
          return (
            <li key={step.title}>
              <div
                className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-colors ${current ? 'border-accent/40 bg-accent-tint/50' : 'border-line'}`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${step.done ? 'bg-success text-white' : current ? 'bg-accent text-white' : 'border border-line-strong text-ink-faint'}`}
                  >
                    {step.done ? <Check className="size-3.5" strokeWidth={3} aria-label="Done" /> : index + 1}
                  </span>
                  <span className={`text-[15px] ${step.done ? 'text-ink-faint line-through decoration-line-strong' : 'text-ink'}`}>{step.title}</span>
                </span>
                {!step.done && (
                  <Link href={step.href} className={`shrink-0 text-sm font-medium ${current ? 'text-accent' : 'text-ink-soft'} hover:underline`}>
                    {step.cta}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
