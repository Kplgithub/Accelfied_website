'use client';

import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';
import { confirmClaim, confirmEmail, unsubscribeInvite } from '@/app/token-actions';
import { initialFormState } from '@/lib/form-state';
import { FormAlert, SubmitButton } from '../forms/form-bits';

const ACTIONS = { email: confirmEmail, claim: confirmClaim, unsubscribe: unsubscribeInvite };

/**
 * One button that confirms the link from an email. A button, not an automatic
 * confirm on page load, so mail scanners that open links cannot confirm for people.
 */
export function TokenConfirm({ kind, token, label, next }: { kind: keyof typeof ACTIONS; token: string; label: string; next: { href: string; label: string } }) {
  const [state, action] = useActionState(ACTIONS[kind], initialFormState);
  if (state.status === 'success') {
    return (
      <div className="space-y-5">
        <p role="status" className="flex items-start gap-2 rounded-xl border border-accent/25 bg-accent-tint px-4 py-3 text-[15px] font-medium text-accent">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.message}
        </p>
        <Link href={next.href} className="font-medium text-accent underline-offset-4 hover:underline">
          {next.label}
        </Link>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-5">
      <FormAlert state={state} />
      <input type="hidden" name="token" value={token} />
      <SubmitButton block pendingLabel="Confirming…">
        {label}
      </SubmitButton>
    </form>
  );
}
