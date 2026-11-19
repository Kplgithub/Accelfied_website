'use client';

import { useState } from 'react';
import type { ServiceGroup } from '@/lib/types';
import { GetMatchedWizard } from './get-matched-wizard';
import { HeroSearch } from './hero-search';

const TABS = [
  { id: 'match', label: 'Get a shortlist' },
  { id: 'browse', label: 'Browse on your own' },
] as const;

/** Hero switcher: a guided brief or a plain search. */
export function HeroTabs({ groups }: { groups: ServiceGroup[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('match');
  return (
    <div>
      <div role="tablist" aria-label="How do you want to find a company?" className="inline-flex rounded-full bg-white/10 p-1 ring-1 ring-white/15 backdrop-blur">
        {TABS.map((item) => (
          <button
            key={item.id}
            id={`hero-tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            aria-controls={`hero-panel-${item.id}`}
            onClick={() => setTab(item.id)}
            className={`cursor-pointer rounded-full px-3 py-2 text-[13px] font-medium whitespace-nowrap min-[360px]:px-4 min-[360px]:text-sm transition-colors duration-200 sm:px-5 ${
              tab === item.id ? 'bg-paper text-night shadow-sm' : 'text-paper/75 hover:text-paper'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {/* Both panels share one grid cell, so the hero keeps the height of the taller one and
          switching tabs never pushes the rest of the page up or down. */}
      <div className="mt-5 grid">
        <div
          id="hero-panel-match"
          role="tabpanel"
          aria-labelledby="hero-tab-match"
          inert={tab !== 'match'}
          className={`[grid-area:1/1] ${tab === 'match' ? '' : 'invisible'}`}
        >
          <GetMatchedWizard groups={groups} />
        </div>
        <div
          id="hero-panel-browse"
          role="tabpanel"
          aria-labelledby="hero-tab-browse"
          inert={tab !== 'browse'}
          className={`[grid-area:1/1] ${tab === 'browse' ? 'animate-rise' : 'invisible'}`}
        >
          <HeroSearch groups={groups} />
          <p className="mt-4 pl-2 text-sm text-paper/60">Pick a service and a location to see every matching company, ranked by real reviews.</p>
        </div>
      </div>
    </div>
  );
}
