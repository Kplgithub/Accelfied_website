'use client';

import { useActionState } from 'react';
import { inviteReviewer } from '@/app/dashboard-actions';
import { initialFormState } from '@/lib/form-state';
import { FormAlert, FormSaved, SubmitButton } from '../forms/form-bits';
import { formFields } from '../forms/use-form-fields';
import { Field, Input, Textarea } from '../ui/field';

/** Emails a past client a link to review this company. */
export function ReviewInviteForm({ companyName }: { companyName: string }) {
  const [state, action] = useActionState(inviteReviewer, initialFormState);
  const { value, error } = formFields(state);
  return (
    <form key={state.nonce} action={action} className="grid gap-5 sm:grid-cols-2" noValidate>
      <div className="space-y-3 sm:col-span-2">
        <FormAlert state={state} />
        <FormSaved state={state} />
      </div>
      <Field label="Client's name" name="name" error={error('name')}>
        {(ids) => <Input id={ids.id} name="name" maxLength={80} autoComplete="off" defaultValue={value('name')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <Field label="Client's email" name="email" error={error('email')}>
        {(ids) => <Input id={ids.id} type="email" name="email" maxLength={254} autoComplete="off" defaultValue={value('email')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <div className="sm:col-span-2">
        <Field label="A personal note" name="note" optional hint={`Shown in the email under ${companyName}'s request.`} error={error('note')}>
          {(ids) => (
            <Textarea
              id={ids.id}
              name="note"
              rows={3}
              maxLength={500}
              className="min-h-24"
              placeholder="It was great working with you on the new website. Would you share a few words about it?"
              defaultValue={value('note')}
              aria-invalid={ids.invalid}
              aria-describedby={ids.describedBy}
            />
          )}
        </Field>
      </div>
      <div className="sm:col-span-2">
        <SubmitButton pendingLabel="Sending…">Send review request</SubmitButton>
      </div>
    </form>
  );
}
