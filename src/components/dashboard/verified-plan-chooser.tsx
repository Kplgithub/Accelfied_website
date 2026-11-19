'use client';

import { useState } from 'react';
import { startVerifiedPlan } from '@/app/billing-actions';
import type { BillingInterval, PlanPrice } from '@/lib/types';
import { formatMoney, formatWhole, type Currency } from '@/lib/verified-plan';
import { VerifiedCheckout } from './verified-checkout';

/**
 * Monthly or yearly, then pay. Both renew by autopay; yearly costs less than twelve monthly payments.
 * Rupees are shown first; rupees or dollars is asked when Pay is pressed.
 */
export function VerifiedPlanChooser({
  plans,
  prices,
  companyName,
  name,
  email,
}: {
  /** Dollar prices, from every API version. */
  plans: Record<BillingInterval, PlanPrice>;
  /** Both currencies; missing from an API older than rupee prices. */
  prices?: Record<Currency, Record<BillingInterval, PlanPrice>>;
  companyName: string;
  name: string;
  email: string;
}) {
  const [interval, setChoice] = useState<BillingInterval>('monthly');
  const main = prices?.INR ?? plans;
  const saving = main.monthly.total * 12 - main.yearly.total;
  const also = (key: BillingInterval) => (prices ? ` or ${formatWhole(prices.USD[key].total, 'USD')}` : '');
  const options: Array<{ value: BillingInterval; title: string; price: string; note: string }> = [
    { value: 'monthly', title: 'Monthly', price: `${formatWhole(main.monthly.total, main.monthly.currency)} / month`, note: 'Charged each month' },
    {
      value: 'yearly',
      title: 'Yearly',
      price: `${formatWhole(main.yearly.total, main.yearly.currency)} / year`,
      note: saving > 0 ? `Save ${formatWhole(saving, main.yearly.currency)}` : 'Charged once a year',
    },
  ];
  const chosen = main[interval];
  const period = interval === 'yearly' ? '/ year' : '/ month';

  return (
    <div className="w-full">
      <fieldset>
        <legend className="sr-only">How often to pay</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => (
            <label
              key={option.value}
              className={`relative flex cursor-pointer flex-col rounded-xl border px-4 py-3 text-left transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                interval === option.value ? 'border-brand bg-brand-tint/50' : 'border-line bg-surface hover:border-line-strong'
              }`}
            >
              <input
                type="radio"
                name="interval"
                value={option.value}
                checked={interval === option.value}
                onChange={() => setChoice(option.value)}
                className="sr-only"
              />
              <span className="flex items-center justify-between gap-2 text-sm font-semibold text-ink">
                {option.title}
                {option.value === 'yearly' && saving > 0 && (
                  <span className="rounded-full bg-success px-2 py-0.5 text-xs font-medium text-white">{option.note}</span>
                )}
              </span>
              <span className="mt-1 font-display text-xl font-semibold text-ink">{option.price}</span>
              <span className="text-xs text-ink-faint">
                {option.value === 'yearly' ? 'Charged once a year' : option.note} by autopay, GST included{also(option.value)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-4 sm:text-right">
        <VerifiedCheckout
          key={interval}
          label={prices ? 'Pay and start' : `Pay ${formatMoney(chosen.total, chosen.currency)} and start`}
          description={`Verified plan for ${companyName}, ${interval}`}
          name={name}
          email={email}
          prices={prices ? { INR: formatWhole(prices.INR[interval].total, 'INR'), USD: formatWhole(prices.USD[interval].total, 'USD') } : undefined}
          priceNote={period}
          start={(currency) => startVerifiedPlan(interval, currency)}
        />
      </div>
    </div>
  );
}
