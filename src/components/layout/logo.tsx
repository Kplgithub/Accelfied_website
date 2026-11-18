import Link from 'next/link';
import {
  LOGO_HEIGHT,
  LOGO_WIDTH,
  MARK_ARROW_BOTTOM,
  MARK_ARROW_TOP,
  MARK_TILE,
  WORDMARK_DOT,
  WORDMARK_PATH,
} from './brand-mark';

/** Accelfied logo: red tile with rising arrows, plus the "accelfied" wordmark with a red i-dot. */
export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const text = tone === 'dark' ? 'text-ink' : 'text-paper';
  return (
    <Link href="/" className={`group inline-flex shrink-0 items-center ${text}`} aria-label="Accelfied home">
      <svg
        viewBox={`0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}`}
        className="h-8 w-auto lg:h-9"
        role="img"
        aria-hidden="true"
      >
        <path d={MARK_TILE} className="fill-brand" />
        <g
          fill="none"
          stroke="#ffffff"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 ease-out group-hover:-translate-y-[3px] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
        >
          <path d={MARK_ARROW_TOP} />
          <path d={MARK_ARROW_BOTTOM} strokeOpacity="0.6" />
        </g>
        <path d={WORDMARK_PATH} fill="currentColor" />
        <circle cx={WORDMARK_DOT.cx} cy={WORDMARK_DOT.cy} r={WORDMARK_DOT.r} className="fill-brand" />
      </svg>
    </Link>
  );
}
