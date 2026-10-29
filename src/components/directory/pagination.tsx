import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  const last = Math.min(totalPages, 100);
  const pages = new Set([1, last, page - 1, page, page + 1].filter((p) => p >= 1 && p <= last));
  const list = [...pages].sort((a, b) => a - b);

  const cell = 'inline-flex size-11 items-center justify-center rounded-full text-[15px] transition-colors';
  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={`${cell} hover:bg-ink/5`} aria-label="Previous page">
          <ChevronLeft className="size-5" />
        </Link>
      ) : (
        <span className={`${cell} text-ink-faint/50`} aria-hidden="true">
          <ChevronLeft className="size-5" />
        </span>
      )}
      {list.map((p, index) => (
        <span key={p} className="flex items-center gap-1.5">
          {index > 0 && p - list[index - 1]! > 1 && <span className="px-1 text-ink-faint">…</span>}
          <Link
            href={hrefFor(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`${cell} ${p === page ? 'bg-ink font-medium text-paper' : 'hover:bg-ink/5'}`}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < last ? (
        <Link href={hrefFor(page + 1)} className={`${cell} hover:bg-ink/5`} aria-label="Next page">
          <ChevronRight className="size-5" />
        </Link>
      ) : (
        <span className={`${cell} text-ink-faint/50`} aria-hidden="true">
          <ChevronRight className="size-5" />
        </span>
      )}
    </nav>
  );
}
