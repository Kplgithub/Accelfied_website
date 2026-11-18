'use client';

import { useEffect, useState } from 'react';

export interface DonutSlice {
  label: string;
  value: number;
}

/** Brand-led palette that stays readable side by side. */
export const DONUT_COLORS = ['#1b7499', '#c7362f', '#17313b', '#f0a531', '#8ccbe2', '#5b8f6f', '#a95f99', '#75878f', '#d9826b', '#3d5a80'];

/**
 * A ring chart with a legend. Slices grow in on first paint and animate
 * when the values change, so editors see the split update as they type.
 */
export function Donut({ slices, size = 168, centre, caption }: { slices: DonutSlice[]; size?: number; centre?: string; caption?: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  const total = slices.reduce((sum, slice) => sum + Math.max(0, slice.value), 0);
  const radius = 15.9155; // circumference of 100 makes dash lengths read as percents
  let offset = 0;
  return (
    <figure className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 42 42" className="size-full -rotate-90" role="img" aria-label={caption ?? 'Breakdown'}>
          <circle cx="21" cy="21" r={radius} fill="none" stroke="var(--paper-deep)" strokeWidth="6" />
          {total > 0 &&
            slices.map((slice, index) => {
              const share = (Math.max(0, slice.value) / total) * 100;
              const dash = shown ? share : 0;
              const circle = (
                <circle
                  key={slice.label}
                  cx="21"
                  cy="21"
                  r={radius}
                  fill="none"
                  stroke={DONUT_COLORS[index % DONUT_COLORS.length]}
                  strokeWidth="6"
                  strokeDasharray={`${dash} ${100 - dash}`}
                  strokeDashoffset={-offset}
                  className="transition-[stroke-dasharray,stroke-dashoffset] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
                  style={{ transitionDelay: `${index * 60}ms` }}
                />
              );
              offset += share;
              return circle;
            })}
        </svg>
        {centre && (
          <span className="absolute inset-0 flex items-center justify-center font-display text-2xl font-semibold text-ink tabular-nums">{centre}</span>
        )}
      </div>
      <figcaption className="w-full min-w-0">
        {caption && <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase">{caption}</p>}
        <ul className="space-y-1.5 text-sm">
          {slices.map((slice, index) => (
            <li key={slice.label} className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2 text-ink-soft">
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: DONUT_COLORS[index % DONUT_COLORS.length] }} aria-hidden="true" />
                <span className="truncate">{slice.label}</span>
              </span>
              <span className="font-medium text-ink tabular-nums">{total > 0 ? Math.round((Math.max(0, slice.value) / total) * 100) : 0}%</span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
