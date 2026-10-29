import type { ReactNode } from 'react';
import { Container } from '../ui/container';

interface Props {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}

/** Two-column frame shared by join, login and password pages. */
export function AuthShell({ eyebrow, title, intro, aside, children }: Props) {
  return (
    <section className="grain border-b border-line">
      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_minmax(0,480px)] lg:items-start lg:gap-16 lg:py-20">
        <div className="lg:pt-6">
          <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.08] font-semibold tracking-tight text-ink sm:text-5xl">{title}</h1>
          {intro && <div className="mt-5 max-w-lg text-lg text-ink-soft">{intro}</div>}
          {aside && <div className="mt-10 hidden lg:block">{aside}</div>}
        </div>
        <div className="animate-rise rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-lift)] sm:p-9">
          {children}
        </div>
      </Container>
    </section>
  );
}
