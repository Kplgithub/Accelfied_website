import type { SVGProps } from 'react';

/** Small illustrations for the Join role chooser. Line art in deep teal with brand-colour fills. */

export function HireArt(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <circle cx="27" cy="27" r="17" fill="var(--accent-tint)" />
      <circle cx="27" cy="23" r="5.5" fill="var(--accent)" />
      <path d="M17.5 36.5c1.8-4.6 5.4-7 9.5-7s7.7 2.4 9.5 7" fill="var(--accent)" />
      <circle cx="27" cy="27" r="17" stroke="var(--ink)" strokeWidth="2.6" />
      <path d="M39.5 39.5 53 53" stroke="var(--brand)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function GetListedArt(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <rect x="8" y="12" width="36" height="40" rx="4" fill="var(--accent-tint)" stroke="var(--ink)" strokeWidth="2.6" />
      <path d="M8 22h36" stroke="var(--ink)" strokeWidth="2.6" />
      <path
        d="m20 29.5 1.9 3.9 4.3.6-3.1 3 .7 4.3-3.8-2-3.8 2 .7-4.3-3.1-3 4.3-.6 1.9-3.9Z"
        fill="var(--saffron)"
      />
      <path d="M30 32h8M30 38h6" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M15 46h22" stroke="var(--ink-faint)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="48" cy="46" r="10" fill="var(--brand)" />
      <path d="M48 41v10M43 46h10" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}
