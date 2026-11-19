'use client';

import { Code2, Download, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { CopySnippet } from './copy-snippet';

export interface KitItem {
  id: string;
  group: 'seal' | 'compact' | 'award' | 'banner';
  title: string;
  note: string;
  width: number;
  height: number;
  pngWidths: number[];
  /** Badge file URLs without the extension, light and dark. */
  base: { light: string; dark: string };
  /** Embed HTML for light and dark backgrounds. Empty for banners. */
  embed: { light: string; dark: string };
}

type Theme = 'light' | 'dark';

/** Previews, downloads and embed code for every badge the company holds. */
export function BadgeKit({ items }: { items: KitItem[] }) {
  const [theme, setTheme] = useState<Theme>('light');
  const badges = items.filter((item) => item.group !== 'banner');
  const banners = items.filter((item) => item.group === 'banner');
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[15px] text-ink-soft">Pick the version that suits your website or post background.</p>
        <div role="radiogroup" aria-label="Badge colour" className="inline-flex rounded-full border border-line bg-surface p-1">
          {(['light', 'dark'] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={theme === value}
              onClick={() => setTheme(value)}
              className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors ${theme === value ? 'bg-night text-paper' : 'text-ink-soft hover:text-ink'}`}
            >
              {value === 'light' ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
              {value === 'light' ? 'For light backgrounds' : 'For dark backgrounds'}
            </button>
          ))}
        </div>
      </div>

      <section aria-labelledby="kit-badges">
        <h2 id="kit-badges" className="mb-4 font-display text-xl font-semibold text-ink">
          Badges
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {badges.map((item) => (
            <KitCard key={item.id} item={item} theme={theme} />
          ))}
        </div>
      </section>

      {banners.length > 0 && (
        <section aria-labelledby="kit-banners">
          <h2 id="kit-banners" className="mb-1 font-display text-xl font-semibold text-ink">
            Banners
          </h2>
          <p className="mb-4 text-[15px] text-ink-soft">Ready-made images with your company name and live rating, for social posts, emails and your website.</p>
          <div className="grid gap-5 lg:grid-cols-2">
            {banners
              .filter((item) => item.width > item.height)
              .map((item) => (
                <KitCard key={item.id} item={item} theme={theme} />
              ))}
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {banners
              .filter((item) => item.width <= item.height)
              .map((item) => (
                <KitCard key={item.id} item={item} theme={theme} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}

function KitCard({ item, theme }: { item: KitItem; theme: Theme }) {
  const [showCode, setShowCode] = useState(false);
  const base = item.base[theme];
  const banner = item.group === 'banner';
  return (
    <article className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-card)]">
      <div
        className={`flex items-center justify-center p-6 ${theme === 'dark' ? 'bg-night' : 'bg-paper-deep'} ${banner ? '' : 'min-h-56'}`}
        style={banner ? undefined : { backgroundImage: theme === 'dark' ? undefined : 'radial-gradient(rgba(23,49,59,.06) 1px, transparent 1px)', backgroundSize: '14px 14px' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- live SVG from our own badge route */}
        <img
          src={`${base}.svg`}
          alt={`Preview: ${item.title}`}
          width={item.width}
          height={item.height}
          loading="lazy"
          className={banner ? 'h-auto w-full rounded-lg shadow-sm' : 'h-auto max-h-48 w-auto max-w-full drop-shadow-sm'}
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-ink">{item.title}</h3>
        <p className="mt-1 text-sm text-ink-soft">{item.note}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <DownloadLink href={`${base}.svg?download=1`} label="SVG" />
          {item.pngWidths.map((w) => (
            <DownloadLink key={w} href={`${base}.png?download=1&w=${w}`} label={`PNG ${w}px`} />
          ))}
        </div>
        {item.embed[theme] && (
          <div className="mt-4 border-t border-line pt-4">
            <button
              type="button"
              onClick={() => setShowCode((v) => !v)}
              aria-expanded={showCode}
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              <Code2 className="size-4" aria-hidden="true" />
              {showCode ? 'Hide website code' : 'Get website code'}
            </button>
            {showCode && (
              <div className="mt-3">
                <p className="mb-3 text-[13px] text-ink-soft">Paste it into your website. The badge links to your Accelfied profile and stays up to date on its own.</p>
                <CopySnippet code={item.embed[theme]} label={`Website code for ${item.title}`} />
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function DownloadLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      download
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-[13px] font-medium text-ink transition-colors hover:border-accent hover:text-accent"
    >
      <Download className="size-3.5" aria-hidden="true" />
      {label}
    </a>
  );
}
