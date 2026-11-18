'use client';

import { useId, useMemo, useState } from 'react';
import type { CompanyAnalytics } from '@/lib/types';

type Metric = 'impressions' | 'views' | 'websiteClicks' | 'leads';
type Row = CompanyAnalytics['series'][number];

const METRICS: Array<{ key: Metric; label: string }> = [
  { key: 'impressions', label: 'Seen in lists' },
  { key: 'views', label: 'Profile views' },
  { key: 'websiteClicks', label: 'Website clicks' },
  { key: 'leads', label: 'Briefs' },
];

// Brand blue teal, nudged for enough colour to read as a data mark on white.
const SERIES = '#0F79A6';
const W = 720;
const H = 240;
const PAD = { top: 16, right: 12, bottom: 28, left: 40 };

const dayLabel = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const whole = new Intl.NumberFormat('en-IN');
const label = (day: string) => dayLabel.format(new Date(`${day}T00:00:00Z`));

/** Rounds the top of the axis up to a friendly number. */
function niceMax(value: number): number {
  if (value <= 4) return 4;
  const step = 10 ** Math.floor(Math.log10(value));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * step >= value) return m * step;
  return 10 * step;
}

/** One measure at a time over the chosen days, with a hover read-out and a table view. */
export function TrendChart({ series }: { series: Row[] }) {
  const [metric, setMetric] = useState<Metric>('views');
  const [hover, setHover] = useState<number | null>(null);
  const id = useId();
  const current = METRICS.find((m) => m.key === metric)!;

  const { points, max, ticks } = useMemo(() => {
    const top = niceMax(Math.max(0, ...series.map((row) => row[metric])));
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const step = series.length > 1 ? innerW / (series.length - 1) : 0;
    return {
      max: top,
      ticks: [0, top / 2, top],
      points: series.map((row, index) => ({
        x: PAD.left + index * step,
        y: PAD.top + innerH - (row[metric] / top) * innerH,
        row,
      })),
    };
  }, [series, metric]);

  const line = points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const base = H - PAD.bottom;
  const area = points.length ? `${line} L${points.at(-1)!.x.toFixed(1)},${base} L${points[0]!.x.toFixed(1)},${base} Z` : '';
  const labelEvery = Math.ceil(series.length / 6);
  const active = hover === null ? null : points[hover];

  function onMove(event: React.PointerEvent<SVGRectElement>) {
    const box = event.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * W;
    let nearest = 0;
    for (let i = 1; i < points.length; i++) if (Math.abs(points[i]!.x - x) < Math.abs(points[nearest]!.x - x)) nearest = i;
    setHover(nearest);
  }

  return (
    <div>
      <div role="tablist" aria-label="Measure" className="mb-5 flex flex-wrap gap-2">
        {METRICS.map((m) => (
          <button
            key={m.key}
            type="button"
            role="tab"
            aria-selected={m.key === metric}
            onClick={() => setMetric(m.key)}
            className={`cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              m.key === metric ? 'bg-night text-paper' : 'bg-paper text-ink-soft ring-1 ring-line hover:text-ink'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby={`${id}-title`}>
          <title id={`${id}-title`}>{`${current.label} per day`}</title>
          <defs>
            <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={SERIES} stopOpacity="0.16" />
              <stop offset="100%" stopColor={SERIES} stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((tick) => {
            const y = PAD.top + (H - PAD.top - PAD.bottom) * (1 - tick / max);
            return (
              <g key={tick}>
                <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="var(--line)" strokeWidth="1" />
                <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="var(--ink-faint)">
                  {whole.format(tick)}
                </text>
              </g>
            );
          })}
          {points.map((p, i) =>
            i % labelEvery === 0 || i === points.length - 1 ? (
              <text key={p.row.day} x={p.x} y={H - 8} textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'} fontSize="11" fill="var(--ink-faint)">
                {label(p.row.day)}
              </text>
            ) : null,
          )}
          <path d={area} fill={`url(#${id}-fill)`} />
          <path d={line} fill="none" stroke={SERIES} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {active && (
            <>
              <line x1={active.x} x2={active.x} y1={PAD.top} y2={base} stroke="var(--ink-faint)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={active.x} cy={active.y} r="5" fill={SERIES} stroke="var(--surface)" strokeWidth="2" />
            </>
          )}
          <rect
            x={PAD.left}
            y={PAD.top}
            width={W - PAD.left - PAD.right}
            height={base - PAD.top}
            fill="transparent"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          />
        </svg>
        {active && (
          <div
            className="pointer-events-none absolute top-0 rounded-xl border border-line bg-surface px-3 py-2 text-sm shadow-[var(--shadow-card)]"
            style={{ left: `${(active.x / W) * 100}%`, transform: `translateX(${active.x > W / 2 ? '-110%' : '10%'})` }}
          >
            <p className="text-[12px] text-ink-faint">{label(active.row.day)}</p>
            <p className="font-medium text-ink tabular-nums">
              {whole.format(active.row[metric])} <span className="font-normal text-ink-soft">{current.label.toLowerCase()}</span>
            </p>
          </div>
        )}
      </div>
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-medium text-accent">Show as a table</summary>
        <div className="mt-3 max-h-72 overflow-auto rounded-xl border border-line">
          <table className="w-full text-left tabular-nums">
            <thead className="sticky top-0 bg-paper text-ink-soft">
              <tr>
                <th className="px-3 py-2 font-medium">Day</th>
                {METRICS.map((m) => (
                  <th key={m.key} className="px-3 py-2 text-right font-medium">
                    {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[...series].reverse().map((row) => (
                <tr key={row.day}>
                  <td className="px-3 py-1.5 text-ink">{label(row.day)}</td>
                  {METRICS.map((m) => (
                    <td key={m.key} className="px-3 py-1.5 text-right text-ink">
                      {whole.format(row[m.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
