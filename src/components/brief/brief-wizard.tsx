'use client';

import { ArrowLeft, ArrowRight, Building2, Check, Globe, Lightbulb, MapPin, Search, Target, Users, Wallet, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createBrief, type BriefAnswers } from '@/app/brief-actions';
import { COUNTRIES, countryName } from '@/lib/countries';
import { BUDGETS, TEAM_SIZES, TIMELINES } from '@/lib/labels';
import type { ServiceGroup } from '@/lib/types';

const STEPS = [
  { key: 'service', icon: Search, title: 'Which service do you need?' },
  { key: 'goal', icon: Target, title: 'What do you need help with, and what are you hoping to achieve?' },
  { key: 'location', icon: MapPin, title: 'What matters to you about a company’s location?' },
  { key: 'website', icon: Globe, title: 'What is your company’s website?' },
  { key: 'company', icon: Building2, title: 'Tell us about your company' },
  { key: 'employees', icon: Users, title: 'How many people work in your organisation?' },
  { key: 'budget', icon: Wallet, title: 'What budget and start date do you have in mind?' },
] as const;

const LOCATION_OPTIONS = [
  { value: 'any', label: 'No preference', text: 'Just looking for the best companies' },
  { value: 'near', label: 'Near me', text: 'For meeting in person' },
  { value: 'countries', label: 'Specific countries', text: 'I have countries in mind' },
] as const;

const MIN_GOAL = 20;

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-[border-color,background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] ${
        selected ? 'border-accent bg-accent-tint text-ink' : 'border-line-strong bg-surface text-ink-soft hover:border-ink/40'
      }`}
    >
      <span className="min-w-0">{children}</span>
      <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${selected ? 'border-accent bg-accent text-white' : 'border-line-strong'}`}>
        {selected && <Check className="size-3" strokeWidth={3} aria-hidden="true" />}
      </span>
    </button>
  );
}

/** A full-screen, one-question-at-a-time project brief. The server writes the draft brief from the answers. */
export function BriefWizard({ groups, initialService = '' }: { groups: ServiceGroup[]; initialService?: string }) {
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const services = useMemo(() => groups.flatMap((group) => group.services), [groups]);
  const [step, setStep] = useState(initialService && services.some((s) => s.slug === initialService) ? 1 : 0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [query, setQuery] = useState('');
  const [countryQuery, setCountryQuery] = useState('');
  const [noWebsite, setNoWebsite] = useState(false);
  const [error, setError] = useState('');
  const [phase, setPhase] = useState<'questions' | 'matching'>('questions');
  const [data, setData] = useState<BriefAnswers>({
    serviceSlug: services.some((s) => s.slug === initialService) ? initialService : '',
    goal: '',
    locationPreference: 'any',
    countries: [],
    nearCity: '',
    website: '',
    companyName: '',
    about: '',
    employees: '',
    budget: '',
    timeline: '',
  });
  const set = <K extends keyof BriefAnswers>(key: K, value: BriefAnswers[K]) => setData((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const serviceName = services.find((service) => service.slug === data.serviceSlug)?.name ?? '';
  const serviceMatches = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (term ? services.filter((s) => `${s.name} ${s.group}`.toLowerCase().includes(term)) : services.filter((s) => s.popular)).slice(0, 9);
  }, [query, services]);
  const countryMatches = useMemo(() => {
    const term = countryQuery.trim().toLowerCase();
    if (!term) return COUNTRIES.filter((c) => ['IN', 'US', 'GB', 'AE', 'SG', 'AU', 'CA', 'DE'].includes(c.code));
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(term)).slice(0, 8);
  }, [countryQuery]);

  function validate(): string {
    const key = STEPS[step]!.key;
    if (key === 'service' && !data.serviceSlug) return 'Choose a service to continue.';
    if (key === 'goal' && data.goal.trim().length < MIN_GOAL) return `Add a little more detail (${MIN_GOAL - data.goal.trim().length} more characters).`;
    if (key === 'location' && data.locationPreference === 'countries' && !data.countries.length) return 'Pick at least one country.';
    if (key === 'website' && !noWebsite && data.website.trim() && !/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(data.website.trim())) return 'Enter a website like yourcompany.com.';
    if (key === 'budget' && (!data.budget || !data.timeline)) return 'Choose a budget and a start date.';
    return '';
  }

  function go(next: number) {
    setError('');
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }

  async function nextStep() {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    if (step < STEPS.length - 1) {
      go(step + 1);
      return;
    }
    setPhase('matching');
    const started = Date.now();
    const result = await createBrief({ ...data, website: noWebsite ? '' : data.website.trim() });
    if (!result.ok) {
      setPhase('questions');
      setError(Object.values(result.errors)[0] ?? result.message);
      return;
    }
    // Let the matching moment breathe; never longer than needed.
    await new Promise((resolve) => setTimeout(resolve, Math.max(0, 1600 - (Date.now() - started))));
    router.push(`/dashboard/briefs/${result.id}`);
  }

  if (phase === 'matching') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center" role="status" aria-live="polite">
        <div className="relative size-24">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
          <span className="absolute inset-3 animate-pulse rounded-full bg-accent/25" />
          <span className="absolute inset-6 flex items-center justify-center rounded-full bg-accent text-white shadow-[var(--shadow-lift)]">
            <Search className="size-6" aria-hidden="true" />
          </span>
        </div>
        <p className="mt-8 font-display text-2xl font-semibold text-ink">Writing your brief and finding verified companies…</p>
        <p className="mt-2 text-ink-soft">This takes a few seconds.</p>
      </div>
    );
  }

  const current = STEPS[step]!;
  const Icon = current.icon;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-10 h-1.5 overflow-hidden rounded-full bg-paper-deep" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Brief progress">
        <div className="h-full rounded-full bg-gradient-to-r from-accent to-success transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void nextStep();
        }}
        noValidate
      >
        <div key={step} className="text-center" style={{ animation: `${direction === 1 ? 'brief-in-right' : 'brief-in-left'} 420ms cubic-bezier(0.2,0.7,0.2,1) both` }}>
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent-tint text-accent">
            <Icon className="size-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-ink-faint uppercase">
            Step {step + 1} of {STEPS.length}
          </p>
          <h1 ref={headingRef} tabIndex={-1} className="mx-auto mt-2 max-w-xl font-display text-3xl leading-tight font-semibold text-ink outline-none sm:text-4xl">
            {current.title}
          </h1>

          <div className="mt-8 text-left">
            {current.key === 'service' && (
              <div>
                <label className="relative block">
                  <span className="sr-only">Search services</span>
                  <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search, for example app development"
                    className="h-12 w-full rounded-2xl border border-line-strong bg-surface pr-4 pl-11 text-[15px] text-ink focus:border-accent focus:ring-4 focus:ring-accent/12 focus:outline-none"
                  />
                </label>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {serviceMatches.map((service) => (
                    <Choice key={service.slug} selected={data.serviceSlug === service.slug} onClick={() => set('serviceSlug', service.slug)}>
                      <span className="block font-medium text-ink">{service.name}</span>
                      <span className="block text-xs text-ink-faint">{service.group}</span>
                    </Choice>
                  ))}
                </div>
                {serviceMatches.length === 0 && <p className="mt-4 text-center text-ink-soft">No service matches that. Try a shorter word.</p>}
              </div>
            )}

            {current.key === 'goal' && (
              <div>
                <div className="relative">
                  <Lightbulb className="pointer-events-none absolute top-4 left-4 size-4 text-saffron" aria-hidden="true" />
                  <textarea
                    value={data.goal}
                    onChange={(event) => set('goal', event.target.value)}
                    rows={6}
                    maxLength={3000}
                    aria-label="What you need help with"
                    placeholder={`Briefly describe the ${serviceName ? serviceName.toLowerCase() : ''} work you need and the result you want from it.`}
                    className="w-full rounded-2xl border border-line-strong bg-surface py-3.5 pr-4 pl-11 text-[15px] leading-relaxed text-ink focus:border-accent focus:ring-4 focus:ring-accent/12 focus:outline-none"
                  />
                </div>
                <p className="mt-2 text-right text-xs text-ink-faint tabular-nums">{data.goal.trim().length} / 3000</p>
              </div>
            )}

            {current.key === 'location' && (
              <div className="space-y-2">
                {LOCATION_OPTIONS.map((option) => (
                  <Choice key={option.value} selected={data.locationPreference === option.value} onClick={() => set('locationPreference', option.value)}>
                    <span className="block font-medium text-ink">{option.label}</span>
                    <span className="block text-sm text-ink-faint">{option.text}</span>
                  </Choice>
                ))}
                {data.locationPreference === 'near' && (
                  <input
                    value={data.nearCity}
                    onChange={(event) => set('nearCity', event.target.value)}
                    placeholder="Your city, for example Jaipur"
                    aria-label="Your city"
                    className="mt-3 h-12 w-full rounded-2xl border border-line-strong bg-surface px-4 text-[15px] focus:border-accent focus:ring-4 focus:ring-accent/12 focus:outline-none"
                  />
                )}
                {data.locationPreference === 'countries' && (
                  <div className="mt-3 rounded-2xl border border-line bg-paper/60 p-4">
                    {data.countries.length > 0 && (
                      <ul className="mb-3 flex flex-wrap gap-2">
                        {data.countries.map((code) => (
                          <li key={code}>
                            <button
                              type="button"
                              onClick={() => set('countries', data.countries.filter((c) => c !== code))}
                              className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-ink px-3 py-1 text-sm text-paper"
                            >
                              {countryName(code)} <X className="size-3.5" aria-label="Remove" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <input
                      value={countryQuery}
                      onChange={(event) => setCountryQuery(event.target.value)}
                      placeholder="Search countries"
                      aria-label="Search countries"
                      className="h-11 w-full rounded-xl border border-line-strong bg-surface px-4 text-[15px] focus:border-accent focus:outline-none"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      {countryMatches
                        .filter((c) => !data.countries.includes(c.code))
                        .map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            disabled={data.countries.length >= 10}
                            onClick={() => set('countries', [...data.countries, country.code])}
                            className="cursor-pointer rounded-full border border-line-strong px-3 py-1 text-sm text-ink-soft hover:border-accent hover:text-accent disabled:opacity-40"
                          >
                            + {country.name}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {current.key === 'website' && (
              <div>
                <input
                  value={noWebsite ? '' : data.website}
                  disabled={noWebsite}
                  onChange={(event) => set('website', event.target.value)}
                  placeholder="www.yourcompany.com"
                  inputMode="url"
                  aria-label="Your company website"
                  className="h-12 w-full rounded-2xl border border-line-strong bg-surface px-4 text-[15px] focus:border-accent focus:ring-4 focus:ring-accent/12 focus:outline-none disabled:bg-paper-deep"
                />
                <label className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
                  <input type="checkbox" checked={noWebsite} onChange={(event) => setNoWebsite(event.target.checked)} className="size-4 accent-[var(--accent)]" />
                  I don’t have a website yet
                </label>
                <p className="mt-3 text-sm text-ink-faint">Companies use it to understand your business before they reply.</p>
              </div>
            )}

            {current.key === 'company' && (
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">Company name</span>
                  <input
                    value={data.companyName}
                    onChange={(event) => set('companyName', event.target.value)}
                    maxLength={120}
                    placeholder="Your company name"
                    className="h-12 w-full rounded-2xl border border-line-strong bg-surface px-4 text-[15px] focus:border-accent focus:ring-4 focus:ring-accent/12 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">What is your business about?</span>
                  <textarea
                    value={data.about}
                    onChange={(event) => set('about', event.target.value)}
                    rows={4}
                    maxLength={1500}
                    placeholder="What you do, who your customers are and what makes you different."
                    className="w-full rounded-2xl border border-line-strong bg-surface px-4 py-3 text-[15px] leading-relaxed focus:border-accent focus:ring-4 focus:ring-accent/12 focus:outline-none"
                  />
                </label>
              </div>
            )}

            {current.key === 'employees' && (
              <div className="grid gap-2 sm:grid-cols-3">
                {TEAM_SIZES.map((size) => (
                  <Choice key={size.value} selected={data.employees === size.value} onClick={() => set('employees', size.value)}>
                    <span className="font-medium text-ink">{size.label}</span>
                  </Choice>
                ))}
              </div>
            )}

            {current.key === 'budget' && (
              <div className="space-y-6">
                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-ink">Budget (US dollars)</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {BUDGETS.map((budget) => (
                      <Choice key={budget.value} selected={data.budget === budget.value} onClick={() => set('budget', budget.value)}>
                        <span className="font-medium text-ink">{budget.label}</span>
                      </Choice>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-ink">When do you want to start?</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {TIMELINES.map((timeline) => (
                      <Choice key={timeline.value} selected={data.timeline === timeline.value} onClick={() => set('timeline', timeline.value)}>
                        <span className="font-medium text-ink">{timeline.label}</span>
                      </Choice>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-center text-sm font-medium text-danger">
            {error}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
          {step > 0 ? (
            <button type="button" onClick={() => go(step - 1)} className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-ink px-6 font-medium text-paper transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-night-soft"
          >
            {step === STEPS.length - 1 ? 'Create my brief' : current.key === 'website' && !data.website && !noWebsite ? 'Skip' : 'Next'}
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}
