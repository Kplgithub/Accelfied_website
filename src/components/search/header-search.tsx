'use client';

import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CompanySearch } from './company-search';

/** Header search button. Opens a search panel; Ctrl+K, ⌘K or "/" open it from anywhere. */
export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.closest('input, textarea, select, [contenteditable="true"]');
      if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typing)) {
        event.preventDefault();
        setOpen(true);
      } else if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      wasOpen.current = true;
      return () => {
        document.body.style.overflow = '';
      };
    }
    // Give focus back to the button the panel was opened from.
    if (wasOpen.current) trigger.current?.focus();
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Search companies"
        className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 hover:text-accent lg:size-10"
      >
        <Search className="size-5" aria-hidden="true" />
      </button>
      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Search companies">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close search"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-night/45 backdrop-blur-[3px] animate-[fade-in_160ms_ease-out]"
          />
          <div className="relative mx-auto mt-3 w-[calc(100%-1.5rem)] max-w-2xl animate-[search-pop_200ms_cubic-bezier(0.2,0.7,0.2,1)] rounded-3xl bg-paper p-3 shadow-[var(--shadow-lift)] sm:mt-[12vh] sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <p className="font-display text-lg font-semibold text-ink">Find a company</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
                aria-label="Close search"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <CompanySearch autoFocus inline placeholder="Type a company name" onDone={() => setOpen(false)} />
            <p className="mt-3 hidden px-1 text-xs text-ink-faint sm:block">
              Use <kbd className="rounded border border-line bg-surface px-1">↑</kbd> <kbd className="rounded border border-line bg-surface px-1">↓</kbd> to move,{' '}
              <kbd className="rounded border border-line bg-surface px-1">Enter</kbd> to open, <kbd className="rounded border border-line bg-surface px-1">Esc</kbd> to close.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
