'use client';

import { CheckCircle2, Hourglass } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import type { FormState } from '@/lib/form-state';
import { Button } from '../ui/button';

export function SubmitButton({
  children,
  pendingLabel = 'Sending…',
  block = false,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  /** Full width at every size, for narrow forms. */
  block?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className={block ? 'w-full' : 'w-full sm:w-auto'}>
      {pending && <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
      {pending ? pendingLabel : children}
    </Button>
  );
}

/** Invisible to people, tempting to bots. The API rejects any submission that fills it. */
export function Honeypot() {
  return (
    <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
      <label>
        Fax
        <input type="text" name="companyFax" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

export function FormAlert({ state }: { state: FormState }) {
  if (state.status !== 'error' || !state.message) return null;
  return (
    <div role="alert" className="rounded-xl border border-danger/30 bg-danger-tint px-4 py-3 text-[15px] font-medium text-danger">
      {state.message}
    </div>
  );
}

/** Inline confirmation for forms that stay on screen after saving. */
export function FormSaved({ state }: { state: FormState }) {
  if (state.status !== 'success' || !state.message) return null;
  return (
    <div role="status" className="flex items-center gap-2 rounded-xl border border-accent/25 bg-accent-tint px-4 py-3 text-[15px] font-medium text-accent">
      <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
      {state.message}
    </div>
  );
}

interface SuccessProps {
  title: string;
  message?: string;
  children?: React.ReactNode;
  /** Shows a "waiting on our team" timeline: done, in progress, still to come. */
  steps?: [string, string, string];
}

export function SuccessPanel({ title, message, children, steps }: SuccessProps) {
  return (
    <div role="status" className="grain rounded-[var(--radius-card)] border border-line bg-surface p-8 text-center sm:p-12">
      {steps ? (
        <span className="relative mx-auto flex size-16 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-saffron/25 motion-reduce:animate-none" aria-hidden="true" />
          <span className="relative inline-flex size-16 items-center justify-center rounded-full bg-saffron-tint text-saffron-ink">
            <Hourglass className="size-7" aria-hidden="true" />
          </span>
        </span>
      ) : (
        <CheckCircle2 className="mx-auto size-12 text-accent" aria-hidden="true" />
      )}
      <h2 className="mt-5 font-display text-3xl font-semibold text-ink">{title}</h2>
      {message && <p className="mx-auto mt-3 max-w-md text-ink-soft">{message}</p>}
      {steps && (
        <ol className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-2 text-left text-xs sm:text-sm">
          {steps.map((step, index) => (
            <li key={step} className="flex flex-col gap-2">
              <span
                className={`h-1.5 rounded-full ${index === 0 ? 'bg-accent' : index === 1 ? 'animate-pulse bg-saffron' : 'bg-line'}`}
                aria-hidden="true"
              />
              <span className={index === 2 ? 'text-ink-faint' : 'font-medium text-ink'}>
                {step}
                <span className="sr-only">{index === 0 ? ' (done)' : index === 1 ? ' (in progress)' : ' (next)'}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
      {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}

export function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-6 border-t border-line pt-8 first:border-t-0 first:pt-0 lg:grid-cols-[240px_1fr] lg:gap-10">
      <div>
        <legend className="font-display text-xl font-semibold text-ink">{title}</legend>
        {description && <p className="mt-1.5 text-sm text-ink-soft">{description}</p>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}
