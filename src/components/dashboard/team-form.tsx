'use client';

import { useActionState } from 'react';
import { addTeamMember } from '@/app/dashboard-actions';
import { initialFormState } from '@/lib/form-state';
import { ImageUpload } from '../forms/image-upload';
import { FormAlert, FormSaved, SubmitButton } from '../forms/form-bits';
import { formFields } from '../forms/use-form-fields';
import { Field, Input } from '../ui/field';

export function TeamForm() {
  const [state, action] = useActionState(addTeamMember, initialFormState);
  const { value, error } = formFields(state);
  return (
    <form key={state.nonce} action={action} className="grid gap-5 sm:grid-cols-2" noValidate>
      <div className="space-y-3 sm:col-span-2">
        <FormAlert state={state} />
        <FormSaved state={state} />
      </div>
      <Field label="Name" name="name" error={error('name')}>
        {(ids) => <Input id={ids.id} name="name" maxLength={80} defaultValue={value('name')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <Field label="Role" name="role" optional hint="For example: Founder, Head of Design" error={error('role')}>
        {(ids) => <Input id={ids.id} name="role" maxLength={80} defaultValue={value('role')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <Field label="LinkedIn profile" name="linkedinUrl" optional error={error('linkedinUrl')}>
        {(ids) => (
          <Input
            id={ids.id}
            type="url"
            name="linkedinUrl"
            placeholder="https://www.linkedin.com/in/…"
            defaultValue={value('linkedinUrl')}
            aria-invalid={ids.invalid}
            aria-describedby={ids.describedBy}
          />
        )}
      </Field>
      <div className="sm:col-span-2">
        <ImageUpload name="photoUrl" label="Photo" kind="team" optional hint="A clear face photo. It is cropped to a square." defaultValue={value('photoUrl')} error={error('photoUrl')} />
      </div>
      <div className="sm:col-span-2">
        <SubmitButton pendingLabel="Adding…">Add to team</SubmitButton>
      </div>
    </form>
  );
}
