'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { login } from '@/app/auth-actions';
import { initialFormState } from '@/lib/form-state';
import { Field, Input } from '../ui/field';
import { FormAlert, SubmitButton } from '../forms/form-bits';
import { formFields } from '../forms/use-form-fields';
import { PasswordInput } from './password-input';

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState(login, initialFormState);
  const { value, error, checked } = formFields(state);
  const joinHref = next ? `/join?next=${encodeURIComponent(next)}` : '/join';

  return (
    <form key={state.nonce} action={action} className="space-y-5" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      <FormAlert state={state} />
      <Field label="Email" name="email" error={error('email')}>
        {(ids) => <Input id={ids.id} type="email" name="email" autoComplete="email" defaultValue={value('email')} required aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <Field label="Password" name="password" error={error('password')}>
        {(ids) => <PasswordInput id={ids.id} name="password" autoComplete="current-password" required aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <div className="flex items-center justify-between gap-4 text-sm">
        <label className="flex cursor-pointer items-center gap-2.5 text-ink-soft">
          <input type="checkbox" name="remember" defaultChecked={checked('remember')} className="size-4 accent-accent" />
          Stay logged in
        </label>
        <Link href="/forgot-password" className="font-medium text-accent underline-offset-4 hover:underline">
          Forgot password?
        </Link>
      </div>
      <SubmitButton pendingLabel="Logging in…" block>
        Log in
      </SubmitButton>
      <p className="text-center text-sm text-ink-soft">
        New to Accelfied?{' '}
        <Link href={joinHref} className="font-medium text-accent underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
