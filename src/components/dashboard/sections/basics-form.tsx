'use client';

import { useActionState } from 'react';
import { saveBasics } from '@/app/profile-section-actions';
import { initialFormState } from '@/lib/form-state';
import { HOURLY_RATES, MIN_PROJECT_SIZES, TEAM_SIZES } from '@/lib/labels';
import type { OwnedCompany } from '@/lib/types';
import { FormAlert, FormSaved, FormSection, SubmitButton } from '../../forms/form-bits';
import { formFields } from '../../forms/use-form-fields';
import { Field, Input, Select } from '../../ui/field';

export function BasicsForm({ company }: { company: OwnedCompany }) {
  const [state, action] = useActionState(saveBasics, initialFormState);
  const { value, error } = formFields(state);
  const pick = (name: string, fallback: string) => (state.status === 'error' ? value(name) : fallback);
  const options = (list: ReadonlyArray<{ value: string | number; label: string }>) =>
    list.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ));
  return (
    <form key={state.nonce} action={action} className="space-y-8" noValidate>
      <FormAlert state={state} />
      <FormSaved state={state} />
      <FormSection title="Size and pricing" description="Clients filter the directory by these, so keep them current.">
        <Field label="Team size" name="teamSize" error={error('teamSize')}>
          {(ids) => (
            <Select id={ids.id} name="teamSize" defaultValue={pick('teamSize', company.teamSize)} aria-invalid={ids.invalid} aria-describedby={ids.describedBy}>
              {options(TEAM_SIZES)}
            </Select>
          )}
        </Field>
        <Field label="Typical hourly rate" name="hourlyRate" error={error('hourlyRate')}>
          {(ids) => (
            <Select id={ids.id} name="hourlyRate" defaultValue={pick('hourlyRate', company.hourlyRate)} aria-invalid={ids.invalid} aria-describedby={ids.describedBy}>
              {options(HOURLY_RATES)}
            </Select>
          )}
        </Field>
        <Field label="Minimum project size" name="minProjectSize" error={error('minProjectSize')}>
          {(ids) => (
            <Select id={ids.id} name="minProjectSize" defaultValue={pick('minProjectSize', String(company.minProjectSize))} aria-invalid={ids.invalid} aria-describedby={ids.describedBy}>
              {options(MIN_PROJECT_SIZES)}
            </Select>
          )}
        </Field>
        <Field label="Year founded" name="foundedYear" optional error={error('foundedYear')}>
          {(ids) => (
            <Input
              id={ids.id}
              type="number"
              inputMode="numeric"
              name="foundedYear"
              min={1800}
              max={new Date().getFullYear()}
              defaultValue={pick('foundedYear', company.foundedYear ? String(company.foundedYear) : '')}
              aria-invalid={ids.invalid}
              aria-describedby={ids.describedBy}
            />
          )}
        </Field>
      </FormSection>
      <div className="flex justify-end border-t border-line pt-6">
        <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
      </div>
    </form>
  );
}
