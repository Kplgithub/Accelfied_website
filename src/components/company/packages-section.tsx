'use client';

import { Check, Clock, Minus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { CompanyPackage } from '@/lib/types';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const TIER_STYLES = ['bg-success/10 text-success', 'bg-accent-tint text-accent', 'bg-night text-paper'] as const;

export function FeatureValue({ value }: { value: string }) {
  const text = value.trim();
  if (!text) return <Minus className="mx-auto size-4 text-line-strong" aria-label="Not included" />;
  if (/^(yes|y|✓|included|true)$/i.test(text)) return <Check className="mx-auto size-4 text-success" strokeWidth={3} aria-label="Included" />;
  return <span className="text-sm text-ink">{text}</span>;
}

/** Small, Medium and Large price cards for each package, with a full feature comparison. */
export function PackagesSection({ packages, companySlug }: { packages: CompanyPackage[]; companySlug: string }) {
  const [active, setActive] = useState(0);
  const [compare, setCompare] = useState(false);
  const pkg = packages[Math.min(active, packages.length - 1)];
  if (!pkg) return null;
  const keyFeatures = pkg.features.slice(0, 5);
  return (
    <div>
      {packages.length > 1 && (
        <div role="tablist" aria-label="Packages" className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {packages.map((item, index) => (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={index === active}
              onClick={() => setActive(index)}
              className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${index === active ? 'border-ink bg-ink text-paper' : 'border-line-strong text-ink-soft hover:border-ink hover:text-ink'}`}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase">{pkg.serviceName}</p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-ink">{pkg.title}</h3>
            {pkg.description && <p className="mt-1 max-w-2xl text-ink-soft">{pkg.description}</p>}
          </div>
          {pkg.features.length > 0 && (
            <div className="inline-flex rounded-full bg-paper-deep p-1 text-sm" role="group" aria-label="Feature view">
              {[
                { value: false, label: 'Key features' },
                { value: true, label: 'Compare all features' },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  aria-pressed={compare === option.value}
                  onClick={() => setCompare(option.value)}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 transition-[background-color,color,box-shadow] ${compare === option.value ? 'bg-surface font-medium text-ink shadow-sm' : 'text-ink-soft hover:text-ink'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {compare ? (
          <div key="compare" className="-mx-5 mt-6 animate-rise overflow-x-auto sm:mx-0">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-5 py-3 text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase sm:px-3">Features</th>
                  {pkg.tiers.map((tier, index) => (
                    <th key={tier.name} className="px-3 py-3 text-center">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${TIER_STYLES[index]}`}>{tier.name}</span>
                      <span className="mt-1 block font-display text-xl font-semibold text-ink tabular-nums">{usd.format(tier.price)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {pkg.features.map((feature) => (
                  <tr key={feature.label} className="transition-colors hover:bg-paper/70">
                    <th scope="row" className="px-5 py-3 text-sm font-normal text-ink-soft sm:px-3">
                      {feature.label}
                    </th>
                    {pkg.tiers.map((tier, index) => (
                      <td key={tier.name} className="px-3 py-3 text-center">
                        <FeatureValue value={feature.values[index] ?? ''} />
                      </td>
                    ))}
                  </tr>
                ))}
                {pkg.tiers.some((tier) => tier.duration) && (
                  <tr>
                    <th scope="row" className="px-5 py-3 text-sm font-normal text-ink-soft sm:px-3">
                      Delivery
                    </th>
                    {pkg.tiers.map((tier) => (
                      <td key={tier.name} className="px-3 py-3 text-center text-sm text-ink">
                        {tier.duration || '–'}
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div key="cards" className="mt-6 grid gap-4 md:grid-cols-3">
            {pkg.tiers.map((tier, index) => (
              <div
                key={tier.name}
                className={`group flex flex-col rounded-2xl border p-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] ${index === 1 ? 'border-accent/50 bg-accent-tint/40' : 'border-line bg-surface'}`}
                style={{ animation: `rise 600ms cubic-bezier(0.2,0.7,0.2,1) ${index * 90}ms both` }}
              >
                <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${TIER_STYLES[index]}`}>{tier.name}</span>
                <p className="mt-3 font-display text-3xl font-semibold text-ink tabular-nums">{usd.format(tier.price)}</p>
                {tier.duration && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
                    <Clock className="size-3.5" aria-hidden="true" />
                    {tier.duration}
                  </p>
                )}
                {tier.summary && <p className="mt-3 text-sm text-ink-soft">{tier.summary}</p>}
                {keyFeatures.length > 0 && (
                  <ul className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                    {keyFeatures.map((feature) => {
                      const value = (feature.values[index] ?? '').trim();
                      const included = Boolean(value);
                      const tick = /^(yes|y|✓|included|true)$/i.test(value);
                      return (
                        <li key={feature.label} className={`flex items-start gap-2 ${included ? 'text-ink' : 'text-ink-faint line-through decoration-line-strong'}`}>
                          {included ? <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" /> : <Minus className="mt-0.5 size-4 shrink-0" aria-hidden="true" />}
                          <span>
                            {feature.label}
                            {included && !tick ? `: ${value}` : ''}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="mt-auto pt-5">
                  <Link
                    href={`/get-a-quote?company=${companySlug}`}
                    className="inline-flex h-10 w-full items-center justify-center rounded-full border border-line-strong text-sm font-medium text-ink transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-paper"
                  >
                    Request a quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-5 text-xs text-ink-faint">Prices in US dollars, set by the company. The final price depends on your exact scope.</p>
      </div>
    </div>
  );
}
