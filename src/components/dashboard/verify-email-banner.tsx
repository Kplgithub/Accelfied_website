'use client';

import { MailWarning } from 'lucide-react';
import { useActionState } from 'react';
import { resendVerification } from '@/app/dashboard-actions';
import { initialFormState } from '@/lib/form-state';

/** Shown until the account's email is confirmed. */
export function VerifyEmailBanner({ email }: { email: string }) {
  const [state, action, pending] = useActionState(resendVerification, initialFormState);
  return (
    <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-saffron/40 bg-saffron-tint px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-start gap-3 text-[15px] text-saffron-ink">
        <MailWarning className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <span>
          Please confirm your email. We sent a link to <strong className="font-semibold">{email}</strong>.
          {state.message && (
            <span role="status" className="mt-1 block font-medium">
              {state.message}
            </span>
          )}
        </span>
      </p>
      {state.status !== 'success' && (
        <form action={action} className="shrink-0">
          <button
            type="submit"
            disabled={pending}
            className="cursor-pointer rounded-full bg-surface px-4 py-2 text-sm font-medium text-ink ring-1 ring-saffron/50 transition-colors hover:bg-paper disabled:opacity-60"
          >
            {pending ? 'Sending…' : 'Send the link again'}
          </button>
        </form>
      )}
    </div>
  );
}
