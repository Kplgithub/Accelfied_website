'use client';

import { Check, Globe, ImageIcon, LayoutList, MapPin, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

const STEPS = [
  { icon: Globe, text: (host: string) => `Opening ${host}` },
  { icon: LayoutList, text: () => 'Reading your homepage and about page' },
  { icon: ImageIcon, text: () => 'Finding your logo' },
  { icon: MapPin, text: () => 'Picking up your services and location' },
  { icon: Phone, text: () => 'Collecting contact details and social links' },
];
const STEP_MS = 1700;

/** Shown while we read the company website, usually 3 to 10 seconds. */
export function AutofillLoader({ host, done }: { host: string; done: boolean }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(4);

  useEffect(() => {
    if (done) return;
    const stepper = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), STEP_MS);
    // Eases toward 94% and waits there until the answer arrives.
    const filler = setInterval(() => setProgress((p) => p + (94 - p) * 0.06), 200);
    return () => {
      clearInterval(stepper);
      clearInterval(filler);
    };
  }, [done]);

  const current = done ? STEPS.length : step;
  const shown = done ? 100 : Math.round(progress);

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-lift)] sm:p-10 lg:p-12">
      <div className="pointer-events-none absolute -top-24 -right-16 size-72 animate-pulse rounded-full bg-accent-tint blur-3xl motion-reduce:animate-none" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-28 -left-16 size-64 animate-pulse rounded-full bg-brand-tint blur-3xl [animation-delay:900ms] motion-reduce:animate-none" aria-hidden="true" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        {/* A small browser window being read line by line. */}
        <div className="mx-auto hidden w-full max-w-sm sm:block lg:max-w-none" aria-hidden="true">
          <div className="relative overflow-hidden rounded-2xl border border-line bg-paper shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3">
              <span className="size-2.5 rounded-full bg-brand/70" />
              <span className="size-2.5 rounded-full bg-saffron/80" />
              <span className="size-2.5 rounded-full bg-accent/70" />
              <span className="ml-3 flex-1 truncate rounded-full bg-paper px-3 py-1 font-mono text-xs text-ink-soft">{host}</span>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <span className={`size-11 shrink-0 rounded-xl transition-colors duration-700 ${current > 2 ? 'bg-brand' : 'af-shimmer'}`} />
                <div className="flex-1 space-y-2">
                  <span className={`block h-3 w-2/3 rounded-full transition-colors duration-700 ${current > 1 ? 'bg-ink/80' : 'af-shimmer'}`} />
                  <span className="af-shimmer block h-2.5 w-1/2 rounded-full" />
                </div>
              </div>
              {[92, 84, 70, 88, 60].map((width, index) => (
                <span key={index} className="af-shimmer block h-2.5 rounded-full" style={{ width: `${width}%`, animationDelay: `${index * 120}ms` }} />
              ))}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[0, 1, 2].map((index) => (
                  <span key={index} className={`h-12 rounded-lg transition-colors duration-700 ${current > 3 ? 'bg-accent-tint ring-1 ring-accent/30' : 'af-shimmer'}`} />
                ))}
              </div>
            </div>
            {!done && <span className="af-scan pointer-events-none absolute inset-x-0 top-0 h-16" />}
          </div>
        </div>

        <div aria-live="polite">
          {/* Phones: a compact moving mark instead of the browser window. */}
          <div className="relative mb-5 flex size-14 items-center justify-center sm:hidden" aria-hidden="true">
            <span className="absolute inset-0 animate-ping rounded-2xl bg-accent/15 motion-reduce:animate-none" />
            <span className="relative flex size-14 items-center justify-center overflow-hidden rounded-2xl bg-accent-tint text-accent">
              <Globe className="size-6" />
              {!done && <span className="af-scan absolute inset-x-0 top-0 h-6" />}
            </span>
          </div>
          <p className="text-sm font-semibold tracking-[0.14em] text-brand uppercase">{done ? 'All set' : 'Please wait'}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {done ? 'Your details are ready' : 'Fetching your company details'}
          </h2>
          <p className="mt-2 text-[15px] text-ink-soft">{done ? 'Opening your listing form…' : 'This takes a few seconds. Please keep this page open.'}</p>

          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-paper-deep" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={shown} aria-label="Reading your website">
            <div className="h-full rounded-full bg-gradient-to-r from-accent to-brand transition-[width] duration-500 ease-out" style={{ width: `${shown}%` }} />
          </div>

          <ol className="mt-6 space-y-3">
            {STEPS.map(({ icon: Icon, text }, index) => {
              const state = index < current ? 'done' : index === current ? 'active' : 'waiting';
              return (
                <li
                  key={index}
                  className={`flex items-center gap-3 text-[15px] transition-all duration-500 ${
                    state === 'waiting' ? 'translate-x-1 text-ink-faint opacity-60' : 'text-ink'
                  }`}
                >
                  <span
                    className={`relative inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${
                      state === 'done' ? 'bg-accent text-white' : state === 'active' ? 'bg-brand-tint text-brand' : 'bg-paper text-ink-faint'
                    }`}
                  >
                    {state === 'active' && <span className="absolute inset-0 animate-ping rounded-full bg-brand/20 motion-reduce:animate-none" aria-hidden="true" />}
                    {state === 'done' ? <Check className="size-4" aria-hidden="true" /> : <Icon className="relative size-4" aria-hidden="true" />}
                  </span>
                  <span className={state === 'active' ? 'font-medium' : ''}>{text(host)}</span>
                </li>
              );
            })}
          </ol>
          <span className="sr-only">{done ? 'Done.' : STEPS[current]?.text(host)}</span>
        </div>
      </div>
    </div>
  );
}
