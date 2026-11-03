import Link from 'next/link';

/** Wordmark with a rising-arrow "A" mark. */
export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const text = tone === 'dark' ? 'text-ink' : 'text-paper';
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${text}`} aria-label="Accelfied home">
      <svg viewBox="0 0 36 36" className="size-9 shrink-0" aria-hidden="true">
        <rect width="36" height="36" rx="10" className="fill-brand" />
        <path
          d="M9.5 26.5L18 9.5l8.5 17"
          fill="none"
          stroke="#f7f4ee"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 21.2c3.6-1.6 7.6-1.9 12.4-.6"
          fill="none"
          className="stroke-saffron transition-transform duration-300 group-hover:-translate-y-0.5"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-display text-[1.45rem] leading-none font-semibold tracking-[-0.02em]">Accelfied</span>
    </Link>
  );
}
