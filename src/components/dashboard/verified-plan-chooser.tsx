'use client';

import { useState } from 'react';
import { startVerifiedPlan } from '@/app/billing-actions';
import type { BillingInterval, PlanPrice } from '@/lib/types';
import { formatMoney } from '@/lib/verified-plan';
import { VerifiedCheckout } from './verified-checkout';

const whole = (plan: PlanPrice) => formatMoney(plan.total, plan.currency).replace(/\.00$/, '');

/** Monthly or yearly, then pay. Yearly costs ten months, so two months are free. */
export function VerifiedPlanChooser({
  plans,
  companyName,
  name,
  email,
}: {
  plans: Record<BillingInterval, PlanPrice>;
  companyName: string;
  name: string;
  email: string;
}) {
  const [interval, setChoice] = useState<BillingInterval>('monthly');
  const freeMonths = Math.round(12 - plans.yearly.total / plans.monthly.total);
  const options: Array<{ value: BillingInterval; title: string; price: string; note: string }> = [
    { value: 'monthly', title: 'Monthly', price: `${whole(plans.monthly)} / month`, note: 'Charged each month' },
    {
      value: 'yearly',
      title: 'Yearly',
      price: `${whole(plans.yearly)} / year`,
      note: freeMonths > 0 ? `${freeMonths} months free` : 'Charged once a year',
    },
  ];
  const chosen = plans[interval];

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
                {option.value === 'yearly' && freeMonths > 0 && (
                  <span className="rounded-full bg-success px-2 py-0.5 text-xs font-medium text-white">{option.note}</span>
                )}
              </span>
              <span className="mt-1 font-display text-xl font-semibold text-ink">{option.price}</span>
              <span className="text-xs text-ink-faint">{option.value === 'yearly' ? 'Charged once a year' : option.note}, GST included</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-4 sm:text-right">
        <VerifiedCheckout
          key={interval}
          label={`Pay ${formatMoney(chosen.total, chosen.currency)} and start`}
          description={`Verified plan for ${companyName}, ${interval}`}
          name={name}
          email={email}
          start={() => startVerifiedPlan(interval)}
        />
      </div>
    </div>
  );
}
