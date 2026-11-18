'use client';

import { useEffect, useState } from 'react';

/** A half-ring meter from red through saffron to teal, with an animated needle. */
export function HealthGauge({ score, label }: { score: number; label: string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setValue(score));
    return () => cancelAnimationFrame(frame);
  }, [score]);
  const angle = -90 + (value / 100) * 180;
  return (
    <div className="relative h-[76px] w-[136px] shrink-0" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} aria-label={`Profile health ${score} out of 100, ${label}`}>
      <svg viewBox="0 0 136 76" className="size-full" aria-hidden="true">
        <defs>
          <linearGradient id="health-arc" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#c7362f" />
            <stop offset="50%" stopColor="#f0a531" />
            <stop offset="100%" stopColor="#1b7499" />
          </linearGradient>
        </defs>
        <path d="M 12 68 A 56 56 0 0 1 124 68" fill="none" stroke="var(--paper-deep)" strokeWidth="12" strokeLinecap="round" />
        <path
          d="M 12 68 A 56 56 0 0 1 124 68"
          fill="none"
          stroke="url(#health-arc)"
          strokeWidth="12"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${value} 100`}
          className="transition-[stroke-dasharray] duration-1000 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
        />
        <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: '68px 68px' }} className="transition-transform duration-1000 ease-[cubic-bezier(0.2,0.7,0.2,1)]">
          <line x1="68" y1="68" x2="68" y2="24" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx="68" cy="68" r="6" fill="var(--ink)" />
      </svg>
    </div>
  );
}
