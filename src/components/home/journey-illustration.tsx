import { FileText, Handshake, MessagesSquare } from 'lucide-react';

/** Decorative hero art: three paper cards on a hand-drawn route. Carries no data. */
export function JourneyIllustration() {
  const cards = [
    { icon: FileText, title: 'Share your brief', note: 'Budget, timeline, goals', className: 'top-2 left-4 -rotate-3' },
    { icon: MessagesSquare, title: 'Read real reviews', note: 'From verified clients', className: 'top-[38%] right-0 rotate-2' },
    { icon: Handshake, title: 'Hire with confidence', note: 'The right fit, first time', className: 'bottom-0 left-10 -rotate-1' },
  ];
  return (
    <div className="relative mx-auto aspect-[5/6] w-full max-w-md" aria-hidden="true">
      <div className="absolute inset-6 rounded-[2.5rem] bg-brand-tint" />
      <div className="absolute top-10 right-6 size-24 rounded-full bg-saffron-tint" />
      <svg viewBox="0 0 400 480" className="absolute inset-0 size-full" fill="none">
        <path
          d="M120 110c120 10 190 40 170 120-18 72-150 60-170 140-8 34 10 56 40 70"
          stroke="var(--brand)"
          strokeWidth="2.5"
          strokeDasharray="2 10"
          strokeLinecap="round"
        />
        <circle cx="120" cy="110" r="6" fill="var(--saffron)" />
        <circle cx="290" cy="230" r="6" fill="var(--saffron)" />
        <circle cx="160" cy="440" r="6" fill="var(--saffron)" />
      </svg>
      {cards.map(({ icon: Icon, title, note, className }, index) => (
        <div
          key={title}
          className={`absolute w-60 animate-rise rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-lift)] ${className}`}
          style={{ animationDelay: `${250 + index * 160}ms` }}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand text-paper">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="font-display text-[17px] font-semibold text-ink">{title}</p>
              <p className="text-[13px] text-ink-soft">{note}</p>
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="block h-1.5 w-full rounded-full bg-paper-deep" />
            <span className="block h-1.5 w-2/3 rounded-full bg-paper-deep" />
          </div>
        </div>
      ))}
    </div>
  );
}
