'use client';

import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { CURRENCIES, PAY_METHODS, type Currency } from '@/lib/verified-plan';

const LABEL: Record<Currency, string> = { INR: 'Pay in rupees', USD: 'Pay in dollars' };

/** The price in each currency, already formatted, such as { INR: '₹520', USD: '$6' }. */
export type CurrencyPrices = Record<Currency, string>;

/**
 * Asks rupees or dollars right after Pay is pressed, then the Razorpay window opens.
 * Razorpay fixes the currency before its window opens, so the choice has to come first.
 */
export function CurrencyChoice({
  open,
  prices,
  note,
  onChoose,
  onClose,
}: {
  open: boolean;
  prices: CurrencyPrices;
  /** Under each price, such as "/ month" or "one time". */
  note?: string;
  onChoose: (currency: Currency) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog itself.
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="currency-choice-title"
      className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-[var(--radius-card)] border border-line bg-surface p-0 text-left text-ink shadow-[var(--shadow-card)] backdrop:bg-ink/50 backdrop:backdrop-blur-[2px]"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id="currency-choice-title" className="font-display text-xl font-semibold">
            How would you like to pay?
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="-mt-1 -mr-1 rounded-full p-1.5 text-ink-faint hover:bg-paper hover:text-ink">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-5 grid gap-3">
          {CURRENCIES.map((currency) => (
            <button
              key={currency}
              type="button"
              onClick={() => onChoose(currency)}
              className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-4 py-3.5 text-left transition-colors hover:border-brand hover:bg-brand-tint/40 focus-visible:border-brand"
            >
              <span>
                <span className="block font-semibold">{LABEL[currency]}</span>
                <span className="block text-sm text-ink-faint">{PAY_METHODS[currency]}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block font-display text-xl font-semibold">{prices[currency]}</span>
                {note && <span className="block text-xs text-ink-faint">{note}</span>}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink-faint">GST included. The secure Razorpay window opens next.</p>
      </div>
    </dialog>
  );
}
