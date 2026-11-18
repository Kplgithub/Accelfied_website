'use client';

import { useActionState, useState } from 'react';
import { saveClientFocus } from '@/app/profile-section-actions';
import { initialFormState } from '@/lib/form-state';
import type { ClientFocus } from '@/lib/types';
import { Donut } from '../../charts/donut';
import { FormAlert, FormSaved, SubmitButton } from '../../forms/form-bits';

export const CLIENT_SIZES: Array<{ key: keyof ClientFocus; label: string; hint: string }> = [
  { key: 'small', label: 'Small business', hint: 'Under $10M yearly revenue' },
  { key: 'midmarket', label: 'Mid-market', hint: '$10M to $1B' },
  { key: 'enterprise', label: 'Enterprise', hint: 'Over $1B' },
];

export function ClientFocusForm({ focus }: { focus: ClientFocus }) {
  const [state, action] = useActionState(saveClientFocus, initialFormState);
  const [values, setValues] = useState(focus);
  const total = values.small + values.midmarket + values.enterprise;
  return (
    <form action={action} className="space-y-6" noValidate>
      <FormAlert state={state} />
      <FormSaved state={state} />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-6">
          {CLIENT_SIZES.map((size) => (
            <div key={size.key}>
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={`focus-${size.key}`} className="font-medium text-ink">
                  {size.label} <span className="text-sm font-normal text-ink-faint">{size.hint}</span>
                </label>
                <span className="font-display text-lg font-semibold text-ink tabular-nums">{values[size.key]}%</span>
              </div>
              <input
                id={`focus-${size.key}`}
                type="range"
                name={size.key}
                min={0}
                max={100}
                step={5}
                value={values[size.key]}
                onChange={(event) => setValues((current) => ({ ...current, [size.key]: Number(event.target.value) }))}
                className="mt-2 w-full cursor-pointer accent-[var(--accent)]"
              />
            </div>
          ))}
          <p className={`text-sm font-medium ${total === 100 ? 'text-success' : 'text-brand'}`} aria-live="polite">
            Total: {total}%{total !== 100 && ' (must be 100%)'}
          </p>
        </div>
        <Donut caption="Preview" slices={CLIENT_SIZES.map((size) => ({ label: size.label, value: values[size.key] }))} />
      </div>
      <div className="flex justify-end border-t border-line pt-6">
        <SubmitButton pendingLabel="Saving…">Save client focus</SubmitButton>
      </div>
    </form>
  );
}
