'use client';

import { CheckCircle2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import type { FormState } from '@/lib/form-state';
import { Button } from '../ui/button';

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending && <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
      {pending ? 'Sending…' : children}
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

export function SuccessPanel({ title, message, children }: { title: string; message?: string; children?: React.ReactNode }) {
  return (
    <div role="status" className="grain rounded-[var(--radius-card)] border border-line bg-surface p-8 text-center sm:p-12">
      <CheckCircle2 className="mx-auto size-12 text-brand" aria-hidden="true" />
      <h2 className="mt-4 font-display text-3xl font-semibold text-ink">{title}</h2>
      {message && <p className="mx-auto mt-3 max-w-md text-ink-soft">{message}</p>}
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
