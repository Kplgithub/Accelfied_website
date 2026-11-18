'use client';

import { Send } from 'lucide-react';
import { useActionState, useState } from 'react';
import { sendBrief } from '@/app/brief-actions';
import { initialFormState } from '@/lib/form-state';
import type { BriefProvider } from '@/lib/types';
import { CompanyLogo } from '../company/company-logo';
import { RatingInline } from '../company/rating-inline';
import { FormAlert, SubmitButton } from '../forms/form-bits';
import { formFields } from '../forms/use-form-fields';
import { Field, Input } from '../ui/field';

/** Picks up to five matching companies and sends them the brief. */
export function SendPanel({ briefId, suggestions, contactName, more = false }: { briefId: string; suggestions: BriefProvider[]; contactName: string; more?: boolean }) {
  const [state, action] = useActionState(sendBrief, initialFormState);
  const { value, error } = formFields(state);
  const [picked, setPicked] = useState(() => new Set(suggestions.slice(0, 5).map((row) => row.company.slug)));
  if (!suggestions.length) {
    return <p className="text-ink-soft">{more ? 'No more matching companies right now. We add new verified companies every week.' : 'No companies match this service yet. Try a broader location on a new brief.'}</p>;
  }
  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="id" value={briefId} />
      <FormAlert state={state} />
      <ul className="grid gap-3 sm:grid-cols-2">
        {suggestions.map((row) => {
          const checked = picked.has(row.company.slug);
          return (
            <li key={row.company.slug}>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition-[border-color,background-color,box-shadow] ${checked ? 'border-accent bg-accent-tint/50 shadow-[var(--shadow-card)]' : 'border-line bg-surface hover:border-ink/30'}`}
              >
                <input
                  type="checkbox"
                  name="companySlugs"
                  value={row.company.slug}
                  checked={checked}
                  onChange={() =>
                    setPicked((current) => {
                      const next = new Set(current);
                      if (next.has(row.company.slug)) next.delete(row.company.slug);
                      else if (next.size < 5) next.add(row.company.slug);
                      return next;
                    })
                  }
                  className="size-4 shrink-0 accent-[var(--accent)]"
                />
                <CompanyLogo name={row.company.name} logoUrl={row.company.logoUrl} size={40} />
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">{row.company.name}</span>
                  <RatingInline average={row.company.rating.average} count={row.company.rating.count} size="sm" />
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="contactName" error={error('contactName')}>
          {(ids) => <Input id={ids.id} name="contactName" autoComplete="name" defaultValue={value('contactName') || contactName} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
        <Field label="Phone" name="contactPhone" optional hint="Only the companies you send to see it." error={error('contactPhone')}>
          {(ids) => <Input id={ids.id} type="tel" name="contactPhone" autoComplete="tel" defaultValue={value('contactPhone')} aria-describedby={ids.describedBy} />}
        </Field>
      </div>
      <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft">By sending, you share this brief and your contact details with the companies you picked.</p>
        <SubmitButton pendingLabel="Sending…">
          <Send className="size-4" aria-hidden="true" />
          Send to {picked.size} {picked.size === 1 ? 'company' : 'companies'}
        </SubmitButton>
      </div>
    </form>
  );
}
