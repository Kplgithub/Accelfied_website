'use client';

import { ArrowLeft, ArrowRight, Check, MapPin, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId, useMemo, useRef, useState } from 'react';
import { COUNTRIES, countryName } from '@/lib/countries';
import { type Brief, matchedHref } from '@/lib/brief';
import { BUDGETS, budgetLabel, TIMELINES, timelineLabel } from '@/lib/labels';
import type { Service, ServiceGroup } from '@/lib/types';
import { startNavigationProgress } from '../layout/navigation-progress';

const STEPS = ['Service', 'Location', 'Budget', 'Timeline', 'Project', 'Review'] as const;
const MIN_BRIEF = 30;
const MAX_BRIEF = 1500;

/**
 * Step-by-step brief: service, location, budget, timeline and a short
 * description. The last step opens /get-matched, which shows matching
 * companies and sends the brief once the visitor is signed in.
 */
export function GetMatchedWizard({ groups, tone = 'dark' }: { groups: ServiceGroup[]; tone?: 'dark' | 'light' }) {
  const router = useRouter();
  const baseId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [data, setData] = useState<Brief>({ service: '', country: '', budget: '', timeline: '', brief: '' });

  const compact = tone === 'dark';
  const services = useMemo(() => groups.flatMap((group) => group.services), [groups]);
  const serviceName = services.find((service) => service.slug === data.service)?.name ?? '';
  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list: Service[] = term
      ? services.filter((service) => `${service.name} ${service.group}`.toLowerCase().includes(term))
      : services.filter((service) => service.popular);
    // The hero card shows six so the whole card fits on a laptop screen without scrolling.
    return list.slice(0, compact ? 6 : 8);
  }, [query, services, compact]);

  function go(next: number) {
    setError('');
    setStep(next);
    // Keep focus on the new question for keyboard and screen reader users.
    requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  }

  function pick<K extends keyof Brief>(key: K, value: Brief[K]) {
    setData((current) => ({ ...current, [key]: value }));
    go(step + 1);
  }

  function nextFromBrief() {
    const length = data.brief.trim().length;
    if (length < MIN_BRIEF) {
      setError(`Add a little more detail (${MIN_BRIEF - length} more characters).`);
      return;
    }
    go(step + 1);
  }

  const dark = tone === 'dark';
  const option =
    `group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 text-left text-[15px] transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 focus-visible:outline-2 ${compact ? 'py-2.5' : 'py-3'}`;
  const optionIdle = 'border-line bg-surface text-ink hover:border-accent';
  const optionActive = 'border-accent bg-accent-tint text-ink';

  return (
    <div
      className={`w-full rounded-[1.75rem] p-5 ${compact ? 'sm:p-6' : 'sm:p-7'} ${
        dark ? 'bg-surface shadow-[0_30px_80px_-30px_rgb(0_0_0/0.55)]' : 'border border-line bg-surface shadow-[var(--shadow-card)]'
      }`}
    >
      {/* Progress */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </p>
        {step > 0 && (
          <button
            type="button"
            onClick={() => go(step - 1)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 text-sm font-medium text-ink-soft hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Back
          </button>
        )}
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {STEPS.map((label, index) => (
          <span key={label} className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
            <span
              className="block h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
              style={{ width: index <= step ? '100%' : '0%' }}
            />
          </span>
        ))}
      </div>

      <div key={step} className={`${compact ? 'mt-5' : 'mt-6'} animate-rise`}>
        <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-semibold text-ink outline-none sm:text-[1.7rem]">
          {
            [
              'What do you need help with?',
              'Where should your partner be?',
              'What is your budget?',
              'When do you want to start?',
              'Tell us about the project',
              'Check your brief',
            ][step]
          }
        </h2>

        {step === 0 && (
          <div className="mt-5">
            <label className="flex items-center gap-3 rounded-xl border border-line-strong bg-paper px-4 py-3 focus-within:border-accent">
              <Search className="size-5 shrink-0 text-accent" aria-hidden="true" />
              <span className="sr-only">Search services</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try “mobile app” or “SEO”"
                className="w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-faint"
              />
            </label>
            <p className="mt-4 text-xs font-medium tracking-wide text-ink-faint uppercase">{query ? 'Matching services' : 'Popular services'}</p>
            {matches.length ? (
              <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {matches.map((service) => (
                  <li key={service.slug}>
                    <button
                      type="button"
                      onClick={() => pick('service', service.slug)}
                      className={`${option} ${data.service === service.slug ? optionActive : optionIdle}`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{service.name}</span>
                        <span className="block truncate text-xs text-ink-faint">{service.group}</span>
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 rounded-xl bg-paper px-4 py-3 text-sm text-ink-soft">No service matches that. Try a shorter word.</p>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="mt-5 space-y-3">
            <button type="button" onClick={() => pick('country', '')} className={`${option} ${optionIdle}`}>
              <span className="font-medium">Anywhere in the world</span>
              <ArrowRight className="size-4 text-ink-faint" aria-hidden="true" />
            </button>
            <label htmlFor={`${baseId}-country`} className="block text-sm text-ink-soft">
              Or pick a country
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-line-strong bg-paper px-4 py-3 focus-within:border-accent">
              <MapPin className="size-5 shrink-0 text-accent" aria-hidden="true" />
              <select
                id={`${baseId}-country`}
                value={data.country}
                onChange={(event) => event.target.value && pick('country', event.target.value)}
                className="w-full cursor-pointer appearance-none bg-transparent text-[16px] text-ink outline-none"
              >
                <option value="">Choose a country</option>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {BUDGETS.map((budget) => (
              <li key={budget.value}>
                <button type="button" onClick={() => pick('budget', budget.value)} className={`${option} ${data.budget === budget.value ? optionActive : optionIdle}`}>
                  <span className="font-medium">{budget.label}</span>
                  {data.budget === budget.value && <Check className="size-4 text-accent" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
        )}

        {step === 3 && (
          <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {TIMELINES.map((timeline) => (
              <li key={timeline.value}>
                <button type="button" onClick={() => pick('timeline', timeline.value)} className={`${option} ${data.timeline === timeline.value ? optionActive : optionIdle}`}>
                  <span className="font-medium">{timeline.label}</span>
                  {data.timeline === timeline.value && <Check className="size-4 text-accent" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
        )}

        {step === 4 && (
          <div className="mt-5">
            <label htmlFor={`${baseId}-brief`} className="sr-only">
              Project description
            </label>
            <textarea
              id={`${baseId}-brief`}
              value={data.brief}
              maxLength={MAX_BRIEF}
              rows={5}
              onChange={(event) => {
                setData((current) => ({ ...current, brief: event.target.value }));
                setError('');
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={`${baseId}-brief-help`}
              placeholder="What are you building, who is it for, and what does success look like?"
              className="w-full resize-y rounded-xl border border-line-strong bg-paper px-4 py-3 text-[16px] leading-relaxed text-ink outline-none placeholder:text-ink-faint focus:border-accent"
            />
            <div id={`${baseId}-brief-help`} className="mt-2 flex justify-between gap-4 text-sm">
              <span role={error ? 'alert' : undefined} className={error ? 'font-medium text-danger' : 'text-ink-faint'}>
                {error || `At least ${MIN_BRIEF} characters.`}
              </span>
              <span className="text-ink-faint tabular-nums">
                {data.brief.length}/{MAX_BRIEF}
              </span>
            </div>
            <button
              type="button"
              onClick={nextFromBrief}
              className="mt-5 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand font-medium text-white transition-colors hover:bg-brand-strong sm:w-auto sm:px-8"
            >
              Continue <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="mt-5">
            <dl className="divide-y divide-line overflow-hidden rounded-xl border border-line">
              {[
                ['Service', serviceName, 0],
                ['Location', data.country ? countryName(data.country) : 'Anywhere in the world', 1],
                ['Budget', budgetLabel(data.budget), 2],
                ['Timeline', timelineLabel(data.timeline), 3],
                ['Project', data.brief.trim(), 4],
              ].map(([label, value, target]) => (
                <div key={label} className="flex items-start justify-between gap-4 bg-paper/60 px-4 py-3 text-sm">
                  <div className="min-w-0">
                    <dt className="text-ink-faint">{label}</dt>
                    <dd className="mt-0.5 line-clamp-2 font-medium break-words text-ink">{value}</dd>
                  </div>
                  <button type="button" onClick={() => go(target as number)} className="shrink-0 cursor-pointer font-medium text-accent hover:underline">
                    Edit
                  </button>
                </div>
              ))}
            </dl>
            <button
              type="button"
              onClick={() => {
                startNavigationProgress();
                router.push(matchedHref({ ...data, brief: data.brief.trim() }));
              }}
              className="mt-5 inline-flex h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand font-medium text-white transition-colors hover:bg-brand-strong"
            >
              See matching companies <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            <p className="mt-3 text-center text-xs text-ink-faint">Nothing is sent until you confirm on the next page.</p>
          </div>
        )}
      </div>
    </div>
  );
}
