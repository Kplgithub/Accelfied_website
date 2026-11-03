const STAR_PATH =
  'M10 1.6l2.47 5.2 5.66.7-4.17 3.9 1.07 5.62L10 14.3l-5.03 2.72 1.07-5.62L1.87 7.5l5.66-.7L10 1.6z';

/** Read-only star row. Partial stars are drawn by clipping a filled copy. */
export function Stars({ value, size = 16, className = '' }: { value: number; size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((index) => {
        const fill = Math.max(0, Math.min(1, value - index));
        return (
          <svg key={index} width={size} height={size} viewBox="0 0 20 20" className="shrink-0">
            <path d={STAR_PATH} className="fill-line-strong" />
            {fill > 0 && (
              <path d={STAR_PATH} className="fill-saffron" style={{ clipPath: `inset(0 ${100 - fill * 100}% 0 0)` }} />
            )}
          </svg>
        );
      })}
    </span>
  );
}
