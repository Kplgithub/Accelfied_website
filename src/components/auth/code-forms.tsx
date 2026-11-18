'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { confirmClaimWithCode, confirmEmailWithCode, resetPasswordWithCode } from '@/app/test-otp-actions';
import { initialFormState } from '@/lib/form-state';
import { Field, Input } from '../ui/field';
import { FormAlert, SubmitButton } from '../forms/form-bits';
import { formFields } from '../forms/use-form-fields';
import { PasswordInput } from './password-input';

/** A 6-digit code box. Phones show the number pad and can fill it from a message. */
function CodeInput(props: { id: string; defaultValue?: string; invalid?: boolean; describedBy?: string; className?: string }) {
  return (
    <Input
      id={props.id}
      name="code"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="\d{6}"
      maxLength={6}
      placeholder="6-digit code"
      required
      defaultValue={props.defaultValue}
      aria-invalid={props.invalid}
      aria-describedby={props.describedBy}
      className={`font-mono tracking-[0.3em] ${props.className ?? ''}`}
    />
  );
}

/** Forgot password while the test code is on: the code stands in for the emailed link. */
export function ResetWithCodeForm({ email }: { email: string }) {
  const [state, action] = useActionState(resetPasswordWithCode, initialFormState);
  const { value, error } = formFields(state);
  return (
    <form key={state.nonce} action={action} className="space-y-5" noValidate>
      <input type="hidden" name="email" value={email} />
      <FormAlert state={state} />
      <p className="text-[15px] text-ink-soft">
        Resetting the password for <strong className="font-semibold text-ink">{email}</strong>.
      </p>
      <Field label="Code" name="code" error={error('code')}>
        {(ids) => <CodeInput id={ids.id} defaultValue={value('code')} invalid={ids.invalid} describedBy={ids.describedBy} />}
      </Field>
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

function InlineCodeForm({
  action,
  label,
  hidden,
}: {
  action: (form: FormData) => void;
  label: string;
  hidden?: Record<string, string>;
}) {
  return (
    <form action={action} className="flex items-center gap-2" noValidate>
      {hidden && Object.entries(hidden).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
      <label className="sr-only" htmlFor={`code-${hidden?.claimId ?? 'email'}`}>
        Code
      </label>
      <CodeInput id={`code-${hidden?.claimId ?? 'email'}`} className="h-10 w-36" />
      <InlineSubmit label={label} />
    </form>
  );
}

function InlineSubmit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-10 shrink-0 cursor-pointer rounded-full bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
    >
      {pending ? 'Checking…' : label}
    </button>
  );
}

function Feedback({ message, error }: { message?: string; error: boolean }) {
  if (!message) return null;
  return (
    <p role={error ? 'alert' : 'status'} className={`mt-1.5 text-[13px] font-medium ${error ? 'text-danger' : 'text-accent'}`}>
      {message}
    </p>
  );
}

/** Dashboard banner while the test code is on: confirms the account email. */
export function EmailCodeForm() {
  const [state, action] = useActionState(confirmEmailWithCode, initialFormState);
  return (
    <div>
      <InlineCodeForm action={action} label="Confirm" />
      <Feedback message={state.status === 'error' ? (state.errors?.code ?? state.message) : state.message} error={state.status === 'error'} />
    </div>
  );
}

/** Dashboard claims list while the test code is on: confirms the work email on one claim. */
export function ClaimCodeForm({ claimId }: { claimId: string }) {
  const [state, action] = useActionState(confirmClaimWithCode, initialFormState);
  return (
    <div className="w-full sm:w-auto">
      <InlineCodeForm action={action} label="Confirm" hidden={{ claimId }} />
      <Feedback message={state.status === 'error' ? (state.errors?.code ?? state.message) : state.message} error={state.status === 'error'} />
    </div>
  );
}
