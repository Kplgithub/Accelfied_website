'use client';

import { ArrowUp } from 'lucide-react';

/** Footer button that glides back to the top of the page. */
export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      }}
      className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-paper/75 transition-colors hover:border-white/35 hover:text-white"
    >
      Back to top
      <ArrowUp
        className="size-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </button>
  );
}
