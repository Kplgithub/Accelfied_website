'use client';

import { Link2, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { CopyLink } from '@/components/dashboard/copy-link';

/** A button that opens a small dialog with the company's review link, ready to copy. */
export function ShareReviewLink({ url, companyName, variant = 'link' }: { url: string; companyName: string; variant?: 'link' | 'button' }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    // A click on the dimmed backdrop (outside the panel) closes the dialog.
    const onClick = (event: MouseEvent) => {
      if (event.target === node) node.close();
    };
    node.addEventListener('click', onClick);
    return () => node.removeEventListener('click', onClick);
  }, []);
  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className={
          variant === 'button'
            ? 'inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-white/10 px-5 text-[15px] font-medium text-paper ring-1 ring-white/25 transition-colors hover:bg-white/20'
            : 'inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-accent hover:underline'
        }
      >
        <Link2 className="size-4" aria-hidden="true" />
        Share your review link
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="share-review-title"
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-[var(--radius-card)] border border-line bg-surface p-0 text-ink shadow-[var(--shadow-lift)] backdrop:bg-night/55 backdrop:backdrop-blur-sm open:animate-rise"
      >
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="share-review-title" className="font-display text-2xl font-semibold">
                Share your review link
              </h2>
              <p className="mt-1.5 text-[15px] text-ink-soft">
                Send this to a past client of {companyName}. They write the review in their own words and confirm their email before sending. Our team
                checks it, then it shows on your profile.
              </p>
            </div>
            <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="-mt-1 -mr-2 cursor-pointer rounded-full p-2 text-ink-soft hover:bg-ink/5">
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-5">
            <CopyLink url={url} />
          </div>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="mt-5 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-night text-[15px] font-medium text-paper transition-colors hover:bg-night-soft"
          >
            Done
          </button>
        </div>
      </dialog>
    </>
  );
}
