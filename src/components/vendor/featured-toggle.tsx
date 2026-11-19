'use client';

import { Pin } from 'lucide-react';
import { useOptimistic, useState, useTransition } from 'react';
import { setFeaturedReview } from '@/app/vendor-tools-actions';

/** Pins this review to the top of the public profile. Only one review can be pinned at a time. */
export function FeaturedToggle({ reviewId, featured }: { reviewId: string; featured: boolean }) {
  const [on, setOn] = useOptimistic(featured);
  const [problem, setProblem] = useState('');
  const [pending, startTransition] = useTransition();
  const toggle = () => {
    setProblem('');
    startTransition(async () => {
      setOn(!on);
      const result = await setFeaturedReview(on ? null : reviewId);
      if (!result.ok) setProblem(result.message ?? 'That did not save. Please try again.');
    });
  };
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-line bg-paper/60 p-4">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby="featured-label"
        aria-describedby="featured-hint"
        onClick={toggle}
        disabled={pending}
        className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors disabled:cursor-wait ${on ? 'bg-accent' : 'bg-line-strong'}`}
      >
        <span className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
      </button>
      <div className="min-w-0">
        <p id="featured-label" className="flex items-center gap-1.5 font-medium text-ink">
          <Pin className="size-4 text-accent" aria-hidden="true" />
          Feature this review
        </p>
        <p id="featured-hint" className="text-sm text-ink-soft">
          Pins it to the top of your public profile, above every other review. You can feature one review at a time.
        </p>
        {problem && (
          <p role="alert" className="mt-1 text-sm font-medium text-danger">
            {problem}
          </p>
        )}
      </div>
    </div>
  );
}
