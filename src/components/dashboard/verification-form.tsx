'use client';

import { useActionState } from 'react';
import { submitVerificationDetails } from '@/app/billing-actions';
import { initialFormState } from '@/lib/form-state';
import type { VerificationDetails } from '@/lib/types';
import { FormAlert, SubmitButton } from '../forms/form-bits';
import { formFields } from '../forms/use-form-fields';
import { Field, Input, Textarea } from '../ui/field';

/** Business details our team checks before the Verified badge goes live. */
export function VerificationForm({ previous }: { previous?: VerificationDetails | null }) {
  const [state, action] = useActionState(submitVerificationDetails, initialFormState);
  const { value: echoed, error } = formFields(state);
  const value = (key: keyof VerificationDetails) => echoed(key) || String(previous?.[key] ?? '');
  return (
    <form key={state.nonce} action={action} className="grid gap-5 sm:grid-cols-2" noValidate>
      <div className="sm:col-span-2">
        <FormAlert state={state} />
      </div>
      <div className="sm:col-span-2">
        <Field label="Registered business name" name="legalName" hint="As on your GST or company registration" error={error('legalName')}>
          {(ids) => <Input id={ids.id} name="legalName" autoComplete="organization" defaultValue={value('legalName')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
      </div>
      <Field label="GSTIN" name="gstin" optional hint="15 characters. Printed on your invoices" error={error('gstin')}>
        {(ids) => (
          <Input id={ids.id} name="gstin" maxLength={15} className="uppercase" defaultValue={value('gstin')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />
        )}
      </Field>
      <Field label="PAN" name="pan" hint="10 characters, of the business or owner" error={error('pan')}>
        {(ids) => <Input id={ids.id} name="pan" maxLength={10} className="uppercase" defaultValue={value('pan')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <div className="sm:col-span-2">
        <Field label="Registration number" name="registrationNumber" optional hint="CIN, LLPIN, Udyam or shop licence number" error={error('registrationNumber')}>
          {(ids) => (
            <Input id={ids.id} name="registrationNumber" maxLength={60} defaultValue={value('registrationNumber')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />
          )}
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Registered address" name="address" error={error('address')}>
          {(ids) => (
            <Textarea id={ids.id} name="address" rows={3} maxLength={500} autoComplete="street-address" defaultValue={value('address')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />
          )}
        </Field>
      </div>
      <div className="sm:col-span-2">
        <SubmitButton pendingLabel="Sending…">Send for verification</SubmitButton>
      </div>
    </form>
  );
}
