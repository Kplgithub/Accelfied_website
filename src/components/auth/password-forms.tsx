'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { forgotPassword, resetPassword } from '@/app/auth-actions';
import { initialFormState } from '@/lib/form-state';
import { Field, Input } from '../ui/field';
import { FormAlert, SubmitButton } from '../forms/form-bits';
import { formFields } from '../forms/use-form-fields';
import { PasswordInput } from './password-input';

export function ForgotPasswordForm() {
  const [state, action] = useActionState(forgotPassword, initialFormState);
  const { value, error } = formFields(state);

  if (state.status === 'success') {
    return (
      <div role="status" className="space-y-5">
        <p className="font-display text-2xl font-semibold text-ink">Check your inbox</p>
        <p className="text-ink-soft">{state.message}</p>
        <Link href="/login" className="inline-block font-medium text-brand underline-offset-4 hover:underline">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <form key={state.nonce} action={action} className="space-y-5" noValidate>
      <FormAlert state={state} />
      <Field label="Email" name="email" error={error('email')}>
        {(ids) => <Input id={ids.id} type="email" name="email" autoComplete="email" defaultValue={value('email')} required aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <SubmitButton pendingLabel="Sending…" block>
        Send reset link
      </SubmitButton>
      <p className="text-center text-sm text-ink-soft">
        Remembered it?{' '}
        <Link href="/login" className="font-medium text-brand underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useActionState(resetPassword, initialFormState);
  const { error } = formFields(state);
  return (
    <form key={state.nonce} action={action} className="space-y-5" noValidate>
      <input type="hidden" name="token" value={token} />
      <FormAlert state={state} />
      <Field label="New password" name="password" hint="At least 8 characters, with letters and a number." error={error('password')}>
        {(ids) => <PasswordInput id={ids.id} name="password" autoComplete="new-password" required minLength={8} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <Field label="Confirm new password" name="confirmPassword" error={error('confirmPassword')}>
        {(ids) => <PasswordInput id={ids.id} name="confirmPassword" autoComplete="new-password" required aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <SubmitButton pendingLabel="Saving…" block>
        Set new password
      </SubmitButton>
    </form>
  );
}
