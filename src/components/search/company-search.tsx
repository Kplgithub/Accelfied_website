'use client';

import { ArrowRight, BadgeCheck, Building2, Loader2, MapPin, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { CompanyLogo } from '@/components/company/company-logo';
import type { CompanySuggestion } from '@/lib/types';
import { startNavigationProgress } from '../layout/navigation-progress';

const MIN_CHARS = 2;
const DEBOUNCE_MS = 160;
const MAX_CACHED = 60;

/** Answers already fetched in this tab, shared by every search box on the page. */
const answers = new Map<string, CompanySuggestion[]>();

function remember(key: string, items: CompanySuggestion[]) {
  if (answers.size >= MAX_CACHED) answers.delete(answers.keys().next().value!);
  answers.set(key, items);
}

const normalise = (value: string) => value.replace(/\s+/g, ' ').trim();

/** Bolds the part of the name that matches what was typed. */
function Highlight({ name, query }: { name: string; query: string }) {
  const at = name.toLowerCase().indexOf(query.toLowerCase());
  if (!query || at < 0) return <>{name}</>;
  return (
    <>
      {name.slice(0, at)}
      <mark className="bg-transparent font-semibold text-ink">{name.slice(at, at + query.length)}</mark>
      {name.slice(at + query.length)}
    </>
  );
}

interface Props {
  /** `dark` sits on the deep teal hero; `light` on white surfaces. */
  tone?: 'dark' | 'light';
  autoFocus?: boolean;
  placeholder?: string;
  /** Called after the visitor picks a company or asks for all results. */
  onDone?: () => void;
  /** Keeps the result list in the page flow (inside a dialog) instead of floating over content. */
  inline?: boolean;
}

/** Search companies by name with live suggestions. Fully keyboard and screen reader friendly. */
export function CompanySearch({ tone = 'light', autoFocus = false, placeholder = 'Search companies by name', onDone, inline = false }: Props) {
  const router = useRouter();
  const id = useId();
  const listId = `${id}-list`;
  const [value, setValue] = useState('');
  const [result, setResult] = useState<{ key: string; query: string; items: CompanySuggestion[]; failed: boolean } | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const query = normalise(value);
  const ready = query.length >= MIN_CHARS;
  const key = query.toLowerCase();
  const cached = ready ? answers.get(key) : undefined;
  const current = cached ? { query, items: cached, failed: false } : result?.key === key ? result : null;
  // While the next answer loads, keep showing the last one instead of flashing an empty list.
  const shown = ready ? (current ?? result) : null;
  const items = shown?.items ?? [];
  const failed = shown?.failed ?? false;
  const settled = shown?.query ?? '';
  const loading = ready && !current;

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Fetch suggestions a moment after typing stops; answers to older queries are dropped.
  useEffect(() => {
    if (!ready || answers.has(key)) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/company-search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        const data = (await res.json()) as { items?: CompanySuggestion[] };
        if (res.ok) remember(key, data.items ?? []);
        setResult({ key, query, items: data.items ?? [], failed: !res.ok });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setResult({ key, query, items: [], failed: true });
      }
    }, DEBOUNCE_MS);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [key, query, ready]);

  // Close when focus or a click leaves the box.
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const allResultsHref = `/agencies?q=${encodeURIComponent(query)}`;
  const optionCount = items.length + (ready ? 1 : 0);

  function go(href: string) {
    setOpen(false);
    onDone?.();
    startNavigationProgress();
    router.push(href);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!optionCount) return;
      event.preventDefault();
      setOpen(true);
      const step = event.key === 'ArrowDown' ? 1 : -1;
      // Cycles through the options and back to the text box (-1).
      const total = optionCount + 1;
      setActive((current) => ((((current + 1 + step) % total) + total) % total) - 1);
    } else if (event.key === 'Enter') {
      if (!ready) return;
      event.preventDefault();
      if (active >= 0 && active < items.length) go(`/profile/${items[active]!.slug}`);
      else go(allResultsHref);
    } else if (event.key === 'Escape') {
      if (open && value) {
        event.preventDefault();
        setOpen(false);
      }
    }
  }

  const showPanel = open && ready;
  const optionId = (index: number) => `${id}-opt-${index}`;
  const dark = tone === 'dark';

  return (
    <div ref={boxRef} className="relative w-full" role="search">
      <div
        className={`group flex items-center gap-3 rounded-2xl px-4 transition-[box-shadow,background-color] duration-200 ${
          dark
            ? 'h-14 bg-white/10 ring-1 ring-white/15 backdrop-blur focus-within:bg-white/14 focus-within:ring-2 focus-within:ring-accent-soft/70'
            : 'h-13 border border-line bg-surface shadow-[var(--shadow-card)] focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/12'
        }`}
      >
        <Search className={`size-5 shrink-0 ${dark ? 'text-accent-soft' : 'text-accent'}`} aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-label="Search companies by name"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showPanel && active >= 0 ? optionId(active) : undefined}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          maxLength={60}
          value={value}
          placeholder={placeholder}
          onChange={(event) => {
            setValue(event.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={`h-full min-w-0 flex-1 bg-transparent text-[16px] outline-none [&::-webkit-search-cancel-button]:hidden ${
            dark ? 'text-paper placeholder:text-paper/55' : 'text-ink placeholder:text-ink-faint'
          }`}
        />
        {loading && <Loader2 className={`size-4 shrink-0 animate-spin ${dark ? 'text-paper/60' : 'text-ink-faint'}`} aria-hidden="true" />}
        {value && !loading && (
          <button
            type="button"
            onClick={() => {
              setValue('');
              inputRef.current?.focus();
            }}
            className={`inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors ${dark ? 'text-paper/70 hover:bg-white/10' : 'text-ink-faint hover:bg-ink/5 hover:text-ink'}`}
            aria-label="Clear search"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div
        className={`${inline ? 'mt-3' : 'absolute inset-x-0 top-full z-50 mt-2'} ${showPanel ? 'block' : 'hidden'} origin-top animate-[search-pop_180ms_cubic-bezier(0.2,0.7,0.2,1)] overflow-hidden rounded-2xl border border-line bg-surface text-ink shadow-[var(--shadow-lift)]`}
      >
        <ul id={listId} role="listbox" aria-label="Companies" className="max-h-[min(420px,60vh)] overflow-y-auto overscroll-contain p-1.5">
          {items.map((company, index) => (
            <li key={company.slug} id={optionId(index)} role="option" aria-selected={active === index}>
              <Link
                href={`/profile/${company.slug}`}
                prefetch={false}
                onClick={() => {
                  setOpen(false);
                  onDone?.();
                }}
                onMouseEnter={() => setActive(index)}
                className={`flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors ${active === index ? 'bg-accent-tint' : 'hover:bg-paper'}`}
                tabIndex={-1}
              >
                <CompanyLogo name={company.name} logoUrl={company.logoUrl} size={40} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-[15px] text-ink-soft">
                      <Highlight name={company.name} query={settled} />
                    </span>
                    {company.verified && <BadgeCheck className="size-4 shrink-0 text-accent" aria-label="Verified" />}
                  </span>
                  {company.city && (
                    <span className="mt-0.5 flex items-center gap-1 truncate text-[13px] text-ink-faint">
                      <MapPin className="size-3 shrink-0" aria-hidden="true" />
                      {company.city}
                      {company.country ? `, ${company.country}` : ''}
                    </span>
                  )}
                </span>
                {company.rating.count > 0 && (
                  <span className="flex shrink-0 flex-col items-end leading-tight">
                    <span className="flex items-center gap-1 text-sm font-semibold text-ink tabular-nums">
                      {company.rating.average.toFixed(1)}
                      <svg viewBox="0 0 20 20" className="size-3.5 fill-saffron" aria-hidden="true">
                        <path d="M10 1.6l2.47 5.2 5.66.7-4.17 3.9 1.07 5.62L10 14.3l-5.03 2.72 1.07-5.62L1.87 7.5l5.66-.7L10 1.6z" />
                      </svg>
                    </span>
                    <span className="text-xs text-ink-faint tabular-nums">
                      {company.rating.count} {company.rating.count === 1 ? 'review' : 'reviews'}
                    </span>
                  </span>
                )}
              </Link>
            </li>
          ))}
          {!loading && settled && items.length === 0 && (
            <li className="flex items-center gap-3 px-3 py-4 text-sm text-ink-soft" role="presentation">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-paper-deep text-ink-faint">
                <Building2 className="size-5" aria-hidden="true" />
              </span>
              {failed ? 'Search is not answering right now. Please try again.' : `No company name starts with “${settled}”.`}
            </li>
          )}
          {ready && (
            <li id={optionId(items.length)} role="option" aria-selected={active === items.length} className="mt-1 border-t border-line pt-1">
              <Link
                href={allResultsHref}
                prefetch={false}
                onClick={() => {
                  setOpen(false);
                  onDone?.();
                }}
                onMouseEnter={() => setActive(items.length)}
                tabIndex={-1}
                className={`group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-accent transition-colors ${active === items.length ? 'bg-accent-tint' : 'hover:bg-paper'}`}
              >
                <span className="truncate">See all results for “{query}”</span>
                <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          )}
        </ul>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {showPanel && !loading && settled ? `${items.length} ${items.length === 1 ? 'company' : 'companies'} found` : ''}
      </p>
    </div>
  );
}
