import { BadgeCheck } from 'lucide-react';
import type { ReactNode } from 'react';

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
        className="inline-flex items-center gap-1 rounded-full bg-night px-2.5 py-1 text-xs font-medium text-paper"
        title="Verified, with 10 or more client reviews averaging 4.5 or higher"
      >
        <BadgeCheck className="size-3.5 text-saffron" aria-hidden="true" />
        Premier Verified
      </span>
    );
  }
  return (
    <Badge tone="brand">
      <BadgeCheck className="size-3.5" aria-hidden="true" />
      {label}
    </Badge>
  );
}
