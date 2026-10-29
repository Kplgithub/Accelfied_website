'use client';

import { useActionState } from 'react';
import { changePassword, updateProfile } from '@/app/auth-actions';
import { initialFormState } from '@/lib/form-state';
import { PasswordInput } from '../auth/password-input';
import { Field, Input } from '../ui/field';
import { FormAlert, FormSaved, SubmitButton } from '../forms/form-bits';
import { formFields } from '../forms/use-form-fields';

export function NameForm({ firstName, lastName }: { firstName: string; lastName: string }) {
  const [state, action] = useActionState(updateProfile, initialFormState);
  const { value, error } = formFields(state);
  return (
    <form key={state.nonce} action={action} className="grid gap-5 sm:grid-cols-2" noValidate>
      <div className="space-y-3 sm:col-span-2 empty:hidden">
        <FormAlert state={state} />
        <FormSaved state={state} />
      </div>
      <Field label="First name" name="firstName" error={error('firstName')}>
        {(ids) => <Input id={ids.id} name="firstName" autoComplete="given-name" defaultValue={value('firstName') || firstName} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <Field label="Last name" name="lastName" error={error('lastName')}>
        {(ids) => <Input id={ids.id} name="lastName" autoComplete="family-name" defaultValue={value('lastName') || lastName} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <div className="sm:col-span-2">
        <SubmitButton pendingLabel="Saving…">Save name</SubmitButton>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action] = useActionState(changePassword, initialFormState);
  const { error } = formFields(state);
  return (
    <form key={state.nonce} action={action} className="grid gap-5 sm:grid-cols-2" noValidate>
      <div className="space-y-3 sm:col-span-2 empty:hidden">
        <FormAlert state={state} />
        <FormSaved state={state} />
      </div>
      <div className="sm:col-span-2 sm:max-w-[calc(50%-10px)]">
        <Field label="Current password" name="currentPassword" error={error('currentPassword')}>
          {(ids) => <PasswordInput id={ids.id} name="currentPassword" autoComplete="current-password" aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
      </div>
      <Field label="New password" name="password" hint="At least 8 characters, with letters and a number." error={error('password')}>
        {(ids) => <PasswordInput id={ids.id} name="password" autoComplete="new-password" aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <Field label="Confirm new password" name="confirmPassword" error={error('confirmPassword')}>
        {(ids) => <PasswordInput id={ids.id} name="confirmPassword" autoComplete="new-password" aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <div className="sm:col-span-2">
        <SubmitButton pendingLabel="Saving…">Change password</SubmitButton>
      </div>
    </form>
  );
}
