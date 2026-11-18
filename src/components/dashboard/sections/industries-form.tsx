'use client';

import { useActionState, useState } from 'react';
import { saveIndustries } from '@/app/profile-section-actions';
import { initialFormState } from '@/lib/form-state';
import { INDUSTRIES } from '@/lib/labels';
import { FormAlert, FormSaved, SubmitButton } from '../../forms/form-bits';

const MAX = 10;

export function IndustriesForm({ industries }: { industries: string[] }) {
  const [state, action] = useActionState(saveIndustries, initialFormState);
  const [picked, setPicked] = useState(() => new Set(industries));
  const toggle = (industry: string) =>
    setPicked((current) => {
      const next = new Set(current);
      if (next.has(industry)) next.delete(industry);
      else if (next.size < MAX) next.add(industry);
      return next;
    });
  return (
    <form action={action} className="space-y-6" noValidate>
      <FormAlert state={state} />
      <FormSaved state={state} />
      <p className="text-sm text-ink-soft">
        Pick up to {MAX}. Clients filter the directory by industry. <span className="font-medium text-ink tabular-nums">{picked.size} of {MAX} picked.</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {INDUSTRIES.map((industry) => (
          <label key={industry} className="cursor-pointer">
            <input type="checkbox" name="industries" value={industry} checked={picked.has(industry)} onChange={() => toggle(industry)} className="peer sr-only" />
            <span className="inline-block rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-ink-soft transition-[color,background-color,border-color,transform] duration-200 peer-checked:scale-[1.03] peer-checked:border-accent peer-checked:bg-accent-tint peer-checked:text-accent peer-focus-visible:outline-2 peer-focus-visible:outline-accent">
              {industry}
            </span>
          </label>
        ))}
      </div>
      <div className="flex justify-end border-t border-line pt-6">
        <SubmitButton pendingLabel="Saving…">Save industries</SubmitButton>
      </div>
    </form>
  );
}
