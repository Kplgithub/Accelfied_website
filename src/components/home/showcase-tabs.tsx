'use client';

import { useId, useState, type KeyboardEvent, type ReactNode } from 'react';

/**
 * Category tabs for the home page "top rated" section. Panels are rendered on the server and all
 * stay in the page (hidden ones get `hidden`), so search engines see every company link.
 */
export function ShowcaseTabs({ label, tabs }: { label: string; tabs: Array<{ id: string; label: string; content: ReactNode }> }) {
  const base = useId();
  const [active, setActive] = useState(0);
  if (!tabs.length) return null;

  function onKey(event: KeyboardEvent<HTMLButtonElement>) {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + tabs.length) % tabs.length;
    setActive(next);
    document.getElementById(`${base}-tab-${next}`)?.focus();
  }

  return (
    <div>
      <div className="-mx-4 flex overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:justify-center sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div role="tablist" aria-label={label} className="inline-flex shrink-0 gap-1 rounded-full border border-line bg-paper p-1.5 shadow-[inset_0_1px_2px_rgb(23_49_59/0.06)]">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              id={`${base}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-controls={`${base}-panel-${index}`}
              tabIndex={index === active ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={onKey}
              className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-300 sm:px-5 ${
                index === active ? 'bg-night text-paper shadow-[0_6px_16px_-8px_rgb(23_49_59/0.7)]' : 'text-ink-soft hover:bg-surface hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          id={`${base}-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${index}`}
          hidden={index !== active}
          className="mt-8 animate-rise"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
