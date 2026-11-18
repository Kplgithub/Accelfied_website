'use client';

import { Search } from 'lucide-react';
import { useDeferredValue, useState } from 'react';
import type { FaqTopic } from '@/lib/company-faq';

/** Topic list on the side, questions on the right, and a search that filters as you type. */
export function FaqBrowser({ topics }: { topics: FaqTopic[] }) {
  const [query, setQuery] = useState('');
  const term = useDeferredValue(query.trim().toLowerCase());
  const shown = topics
    .map((topic) => ({ ...topic, items: term ? topic.items.filter((item) => `${item.q} ${item.a}`.toLowerCase().includes(term)) : topic.items }))
    .filter((topic) => topic.items.length);

  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
      <aside className="lg:sticky lg:top-36 lg:self-start">
        <label htmlFor="faq-search" className="sr-only">
          Search questions
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search questions"
            className="h-11 w-full rounded-full border border-line-strong bg-surface pr-4 pl-10 text-[15px] outline-none focus:border-accent"
          />
        </div>
        <nav aria-label="Topics" className="mt-5 hidden lg:block">
          <ul className="space-y-1">
            {topics.map((topic) => (
              <li key={topic.id}>
                <a href={`#${topic.id}`} className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-surface hover:text-ink">
                  {topic.title}
                  <span className="text-xs text-ink-faint">{topic.items.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="space-y-12">
        {shown.length === 0 && (
          <p role="status" className="rounded-[var(--radius-card)] border border-dashed border-line-strong p-8 text-center text-ink-soft">
            No questions match “{query}”. Try another word, or contact our team.
          </p>
        )}
        {shown.map((topic) => (
          <section key={topic.id} id={topic.id} className="scroll-mt-36">
            <h2 className="font-display text-2xl font-semibold text-ink">{topic.title}</h2>
            <div className="mt-4 divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-card)]">
              {topic.items.map((item) => (
                <details key={item.q} open={Boolean(term)} className="group px-5 py-4 sm:px-6 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
                    {item.q}
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-paper text-ink-soft transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-ink-soft">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
