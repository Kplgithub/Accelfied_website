'use client';

import { ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SealIcon } from '../ui/seal-icon';

const KEY = 'accelfied:verify-nudge-hidden-until';
const HIDE_DAYS = 14;
const PLAN_PAGE = '/dashboard/company/verified';
/** Pages with the larger upgrade strip (upgrade-strip.tsx), so the two never stack. */
const STRIP_PAGES = ['/dashboard', '/dashboard/company', '/dashboard/company/reviews', '/dashboard/company/analytics'];

/** Reminder for companies without the Verified plan. Closing it hides it for two weeks on this browser. */
/** `message` and `action` replace the default upgrade wording for a company that has paid but is not approved yet. */
export function VerifyNudge({ message, action }: { message?: string; action?: string }) {
  const pathname = usePathname();
  // A company that has paid gets its own reminder, even if it closed the upgrade one earlier.
  const storageKey = message ? `${KEY}:paid` : KEY;
  // Hidden until mounted, so a closed reminder never flashes in.
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let hiddenUntil = 0;
    try {
      hiddenUntil = Number(window.localStorage.getItem(storageKey) ?? 0);
    } catch {
      // Storage can be blocked; then the reminder simply shows.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser storage once after mount
    setOpen(Date.now() > hiddenUntil);
  }, [storageKey]);
  if (!open || pathname === PLAN_PAGE || STRIP_PAGES.includes(pathname)) return null;
  const close = () => {
    setOpen(false);
    try {
      window.localStorage.setItem(storageKey, String(Date.now() + HIDE_DAYS * 86_400_000));
    } catch {
      // Closes for this page view only.
    }
  };
  return (
    <div role="region" aria-label="Verified plan" className="mb-6 flex items-start gap-3 rounded-2xl border border-accent/25 bg-accent-tint px-4 py-3.5 sm:items-center sm:px-5">
      <SealIcon className="mt-0.5 size-6 shrink-0 sm:mt-0" />
      <p className="flex-1 text-[15px] text-ink">
        {message ?? 'Your company is not verified yet. Verified companies show the Verified badge, are listed above companies that are not verified, and can add Accelfied badges to their own website.'}{' '}
        <Link href={PLAN_PAGE} className="inline-flex items-center gap-1 font-semibold whitespace-nowrap text-accent hover:underline">
          {action ?? 'Get Accelfied'}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </p>
      <button type="button" onClick={close} aria-label="Close" className="-m-1 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-soft hover:bg-ink/5 hover:text-ink">
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
