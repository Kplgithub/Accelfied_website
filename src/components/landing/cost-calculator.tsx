'use client';

import { useId, useState } from 'react';
import type { Modifier, ProjectType, RangeOption } from '@/lib/landing/types';

interface Props {
  unit: 'project' | 'month';
  typesLabel: string;
  types: ProjectType[];
  addonsLabel: string;
  addons: RangeOption[];
  modifiers: Modifier[];
  note: string;
}

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

/** Rounds to a figure a person would quote: nearest ₹1,000 below a lakh, nearest ₹5,000 above. */
function round(value: number): number {
  const step = value >= 1_00_000 ? 5_000 : 1_000;
  return Math.max(step, Math.round(value / step) * step);
}

function weeksLabel([low, high]: [number, number]): string {
  if (high <= 8) return `${low} to ${high} weeks`;
  const months = (weeks: number) => Math.round((weeks / 4.33) * 2) / 2;
  return `${months(low)} to ${months(high)} months`;
}

/** Interactive estimate: base range of the chosen type, plus each ticked add-on, times the team and location factors. */
export function CostCalculator({ unit, typesLabel, types, addonsLabel, addons, modifiers, note }: Props) {
  const id = useId();
  const [typeId, setTypeId] = useState(types[Math.min(1, types.length - 1)].id);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [choices, setChoices] = useState<Record<string, number>>(() => Object.fromEntries(modifiers.map((m) => [m.id, m.initial])));

  const type = types.find((t) => t.id === typeId) ?? types[0];
  const scale = type.scale ?? 1;
  const factor = modifiers.reduce((total, m) => total * m.options[choices[m.id]].factor, 1);
  const chosen = addons.filter((a) => picked.has(a.id));
  const low = round((type.low + chosen.reduce((sum, a) => sum + a.low * scale, 0)) * factor);
  const high = round((type.high + chosen.reduce((sum, a) => sum + a.high * scale, 0)) * factor);
  const per = unit === 'month' ? ' a month' : '';

  const toggle = (addon: string) =>
    setPicked((current) => {
      const next = new Set(current);
      if (next.has(addon)) next.delete(addon);
      else next.add(addon);
      return next;
    });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="space-y-8">
        <fieldset>
          <legend className="font-display text-xl font-semibold text-ink">{typesLabel}</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {types.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer gap-3 rounded-2xl bg-surface p-4 ring-1 ring-line transition-shadow duration-200 hover:ring-line-strong has-[:checked]:ring-2 has-[:checked]:ring-accent"
              >
                <input
                  type="radio"
                  name={`${id}-type`}
                  value={option.id}
                  checked={option.id === typeId}
                  onChange={() => setTypeId(option.id)}
                  className="mt-1 size-4 accent-[var(--accent)]"
                />
                <span>
                  <span className="block font-semibold text-ink">{option.label}</span>
                  <span className="mt-0.5 block text-sm text-ink-soft">{option.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-xl font-semibold text-ink">{addonsLabel}</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {addons.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer gap-3 rounded-2xl bg-surface p-4 ring-1 ring-line transition-shadow duration-200 hover:ring-line-strong has-[:checked]:ring-2 has-[:checked]:ring-accent"
              >
                <input
                  type="checkbox"
                  checked={picked.has(option.id)}
                  onChange={() => toggle(option.id)}
                  className="mt-1 size-4 accent-[var(--accent)]"
                />
                <span>
                  <span className="block font-semibold text-ink">{option.label}</span>
                  <span className="mt-0.5 block text-sm text-ink-soft">{option.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {modifiers.map((modifier) => (
          <fieldset key={modifier.id}>
            <legend className="font-display text-xl font-semibold text-ink">{modifier.label}</legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {modifier.options.map((option, index) => (
                <label
                  key={option.label}
                  className="cursor-pointer rounded-full bg-surface px-4 py-2 text-sm text-ink ring-1 ring-line transition-colors duration-200 hover:ring-line-strong has-[:checked]:bg-night has-[:checked]:text-white has-[:checked]:ring-night has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent"
                >
                  <input
                    type="radio"
                    name={`${id}-${modifier.id}`}
                    checked={choices[modifier.id] === index}
                    onChange={() => setChoices((current) => ({ ...current, [modifier.id]: index }))}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <aside className="rounded-[var(--radius-card)] bg-night p-6 text-white shadow-[var(--shadow-lift)] lg:sticky lg:top-32">
        <p className="text-sm font-semibold tracking-[0.14em] text-accent-soft uppercase">Your estimate</p>
        <p aria-live="polite" className="mt-3 font-display text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
          <span key={`${low}-${high}`} className="inline-block animate-rise">
            {inr.format(low)} to {inr.format(high)}
            {per && <span className="text-xl font-normal text-white/80">{per}</span>}
          </span>
        </p>
        <dl className="mt-5 space-y-2 border-t border-white/15 pt-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-white/70">{typesLabel}</dt>
            <dd className="text-right font-medium">{type.label}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-white/70">{addonsLabel}</dt>
            <dd className="text-right font-medium">{chosen.length ? chosen.length : 'None'}</dd>
          </div>
          {type.weeks && (
            <div className="flex justify-between gap-4">
              <dt className="text-white/70">Typical timeline</dt>
              <dd className="text-right font-medium">{weeksLabel(type.weeks)}</dd>
            </div>
          )}
        </dl>
        <p className="mt-5 text-sm leading-relaxed text-white/75">{note} Prices exclude GST.</p>
      </aside>
    </div>
  );
}
