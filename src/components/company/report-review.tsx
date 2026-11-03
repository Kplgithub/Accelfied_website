'use client';

import { Flag } from 'lucide-react';
import { useActionState } from 'react';
import { reportReview, type ReportState } from '@/app/report-actions';
import { SubmitButton } from '../forms/form-bits';

const REASONS = [
  { value: 'not-a-client', label: 'The reviewer was not a client' },
  { value: 'wrong-company', label: 'It is about a different company' },
  { value: 'offensive', label: 'It is offensive or abusive' },
  { value: 'private-information', label: 'It shares private information' },
  { value: 'other', label: 'Something else' },
];

/** "Report this review": opens a short form; our team decides in the admin panel. */
export function ReportReview({ reviewId, returnTo }: { reviewId: string; returnTo: string }) {
  const [state, action] = useActionState<ReportState, FormData>(reportReview, { status: 'idle' });
  if (state.status === 'success') {
    return (
      <p role="status" className="mt-6 text-[13px] text-success">
        {state.message}
      </p>
    );
  }
  return (
    <details className="group mt-6 text-[13px]">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-ink-faint transition-colors hover:text-danger">
        <Flag className="size-3.5" aria-hidden="true" /> Report this review
      </summary>
      <form action={action} className="mt-3 max-w-lg space-y-3 rounded-xl border border-line bg-paper p-4">
        <input type="hidden" name="reviewId" value={reviewId} />
        <fieldset>
          <legend className="text-sm font-medium text-ink">What is wrong with it?</legend>
          <div className="mt-2 space-y-1.5">
            {REASONS.map((reason, index) => (
              <label key={reason.value} className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
                <input type="radio" name="reason" value={reason.value} defaultChecked={index === 0} className="accent-[var(--brand)]" />
                {reason.label}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm font-medium text-ink">
          Details for our team
          <textarea name="details" rows={3} minLength={10} maxLength={2000} required className="mt-1 block w-full rounded-xl border border-line-strong bg-surface px-3 py-2 text-sm font-normal outline-none focus:border-accent" />
        </label>
        {state.status === 'error' && (
          <p role="alert" className="text-sm font-medium text-danger">
            {state.message}
          </p>
        )}
        {state.status === 'login' && (
          <p role="alert" className="text-sm text-ink-soft">
            Please{' '}
            {/* A full page load, so the profile opens fresh after logging in instead of with this message still showing. */}
            <a href={`/login?next=${encodeURIComponent(returnTo)}`} className="font-medium text-accent underline">
              log in
            </a>{' '}
            to report a review, so our team can reach you about it.
          </p>
        )}
        <SubmitButton pendingLabel="Sending…">
          Send report
        </SubmitButton>
      </form>
    </details>
  );
}
