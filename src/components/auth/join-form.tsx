'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { register } from '@/app/auth-actions';
import { initialFormState } from '@/lib/form-state';
import type { AccountType } from '@/lib/types';
import { Field, Input } from '../ui/field';
import { FormAlert, Honeypot, SubmitButton } from '../forms/form-bits';
import { formFields } from '../forms/use-form-fields';
import { PasswordInput } from './password-input';

export function JoinForm({ accountType, next }: { accountType: AccountType; next?: string }) {
  const [state, action] = useActionState(register, initialFormState);
  const { value, error, checked } = formFields(state);

  return (
    <form key={state.nonce} action={action} className="relative space-y-5" noValidate>
      <Honeypot />
      <input type="hidden" name="accountType" value={accountType} />
      {next && <input type="hidden" name="next" value={next} />}
      <FormAlert state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" name="firstName" error={error('firstName')}>
          {(ids) => <Input id={ids.id} name="firstName" autoComplete="given-name" defaultValue={value('firstName')} required aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
        <Field label="Last name" name="lastName" error={error('lastName')}>
          {(ids) => <Input id={ids.id} name="lastName" autoComplete="family-name" defaultValue={value('lastName')} required aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
      </div>
      <Field label="Work email" name="email" error={error('email')}>
        {(ids) => <Input id={ids.id} type="email" name="email" autoComplete="email" defaultValue={value('email')} required aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <Field label="Password" name="password" hint="At least 8 characters, with letters and a number." error={error('password')}>
        {(ids) => <PasswordInput id={ids.id} name="password" autoComplete="new-password" required minLength={8} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <Field label="Confirm password" name="confirmPassword" error={error('confirmPassword')}>
        {(ids) => <PasswordInput id={ids.id} name="confirmPassword" autoComplete="new-password" required aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
          <input type="checkbox" name="terms" defaultChecked={checked('terms')} className="mt-0.5 size-4 accent-accent" aria-invalid={Boolean(error('terms'))} />
          <span>
            I agree to the Accelfied{' '}
            <a href="/terms" target="_blank" className="font-medium text-accent underline-offset-4 hover:underline">
              terms of use
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" className="font-medium text-accent underline-offset-4 hover:underline">
              privacy policy
            </a>
            .
          </span>
        </label>
        {error('terms') && (
          <p className="mt-1.5 text-[13px] font-medium text-danger" role="alert">
            {error('terms')}
          </p>
        )}
      </div>
      <SubmitButton pendingLabel="Creating account…" block>
        {accountType === 'provider' ? 'Create account and list my company' : 'Create account'}
      </SubmitButton>
      <p className="text-center text-sm text-ink-soft">
        Already have an account?{' '}
        <Link href={next ? `/login?next=${encodeURIComponent(next)}` : '/login'} className="font-medium text-accent underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
