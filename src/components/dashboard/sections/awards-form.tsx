'use client';

import { Award, ExternalLink, Trash2 } from 'lucide-react';
import { useActionState } from 'react';
import { addAward, removeAward } from '@/app/profile-section-actions';
import { initialFormState } from '@/lib/form-state';
import type { CompanyAward } from '@/lib/types';
import { FormAlert, FormSaved, SubmitButton } from '../../forms/form-bits';
import { formFields } from '../../forms/use-form-fields';
import { Field, Input } from '../../ui/field';

export function AwardsForm({ awards }: { awards: CompanyAward[] }) {
  const [state, action] = useActionState(addAward, initialFormState);
  const { value, error } = formFields(state);
  return (
    <div className="space-y-8">
      {awards.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {awards.map((award) => (
            <li key={award.id} className="flex items-start gap-3 rounded-2xl border border-line bg-paper/60 p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-saffron-tint text-saffron-ink">
                <Award className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">{award.title}</p>
                <p className="text-sm text-ink-soft">
                  {award.year ?? ''}
                  {award.url && (
                    <a href={award.url} target="_blank" rel="noopener noreferrer nofollow" className="ml-2 inline-flex items-center gap-1 text-accent hover:underline">
                      Link <ExternalLink className="size-3" aria-hidden="true" />
                    </a>
                  )}
                </p>
              </div>
              <form action={removeAward}>
                <input type="hidden" name="id" value={award.id} />
                <button type="submit" className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-ink-soft hover:bg-ink/5 hover:text-danger" aria-label={`Remove ${award.title}`}>
                  <Trash2 className="size-4" />
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-ink-soft">No awards yet. Rankings, industry awards and certifications all count.</p>
      )}
      <form key={state.nonce} action={action} className="space-y-4 rounded-2xl border border-dashed border-line-strong p-5" noValidate>
        <FormAlert state={state} />
        <FormSaved state={state} />
        <h3 className="font-display text-lg font-semibold text-ink">Add an award</h3>
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <Field label="Award title" name="title" hint="For example: Top 10 app developers in Jaipur, 2025" error={error('title')}>
            {(ids) => <Input id={ids.id} name="title" maxLength={140} defaultValue={value('title')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
          </Field>
          <Field label="Year" name="year" optional error={error('year')}>
            {(ids) => <Input id={ids.id} type="number" inputMode="numeric" name="year" min={1950} max={new Date().getFullYear()} defaultValue={value('year')} aria-describedby={ids.describedBy} />}
          </Field>
        </div>
        <Field label="Link to the award" name="url" optional hint="A page that shows the award, so clients can check it." error={error('url')}>
          {(ids) => <Input id={ids.id} type="url" name="url" placeholder="https://" defaultValue={value('url')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
        <div className="flex justify-end">
          <SubmitButton pendingLabel="Adding…">Add award</SubmitButton>
        </div>
      </form>
    </div>
  );
}
