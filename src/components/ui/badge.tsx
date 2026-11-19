import type { ReactNode } from 'react';
import { SealIcon } from './seal-icon';

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'brand' | 'saffron' }) {
  const tones = {
    neutral: 'bg-paper-deep text-ink-soft',
    brand: 'bg-accent-tint text-accent',
    saffron: 'bg-saffron-tint text-saffron-ink',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function VerifiedBadge({ label = 'Verified', premier = false }: { label?: string; premier?: boolean }) {
  if (premier) {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full bg-night py-1 pr-2.5 pl-1.5 text-xs font-semibold text-paper"
        title="Verified, with 10 or more client reviews averaging 4.5 or higher"
      >
        <SealIcon premier className="size-4" />
        Premier Verified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent-tint py-1 pr-2.5 pl-1.5 text-xs font-semibold text-accent" title="This company is on the Verified plan">
      <SealIcon className="size-4" />
      {label}
    </span>
  );
}
