'use client';

import { useState, type ReactNode } from 'react';

/** Pill tabs over server-rendered panels. */
export function TabbedPanels({ label, tabs }: { label: string; tabs: Array<{ id: string; label: string; content: ReactNode }> }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find((tab) => tab.id === active) ?? tabs[0];
  if (!current) return null;
  return (
    <div>
      <div role="tablist" aria-label={label} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={tab.id === current.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              tab.id === current.id ? 'bg-ink text-paper' : 'bg-surface text-ink-soft ring-1 ring-line hover:text-ink hover:ring-line-strong'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div key={current.id} id={`panel-${current.id}`} role="tabpanel" aria-labelledby={`tab-${current.id}`} className="mt-8 animate-rise">
        {current.content}
      </div>
    </div>
  );
}
