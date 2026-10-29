import { BadgeCheck } from 'lucide-react';
import type { ReactNode } from 'react';

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'brand' | 'saffron' }) {
  const tones = {
    neutral: 'bg-paper-deep text-ink-soft',
    brand: 'bg-brand-tint text-brand',
    saffron: 'bg-saffron-tint text-saffron-ink',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function VerifiedBadge({ label = 'Verified' }: { label?: string }) {
  return (
    <Badge tone="brand">
      <BadgeCheck className="size-3.5" aria-hidden="true" />
      {label}
    </Badge>
  );
}
