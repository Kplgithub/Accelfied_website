import type { CSSProperties } from 'react';

/**
 * Grey placeholders shaped like the content that is loading, shown until real
 * data arrives. Screen readers hear one "Loading" instead of empty shapes.
 */
export function Bone({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return <span aria-hidden="true" className={`skeleton block ${className}`} style={style} />;
}

export function SkeletonStatus({ label = 'Loading' }: { label?: string }) {
  return (
    <span role="status" className="sr-only">
      {label}…
    </span>
  );
}

/** A few lines of text, the last one shorter. */
export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <span className={`block space-y-2.5 ${className}`}>
      {Array.from({ length: lines }, (_, index) => (
        <Bone key={index} className="h-3.5" style={{ width: index === lines - 1 ? '62%' : `${100 - index * 6}%` }} />
      ))}
    </span>
  );
}

export function SkeletonCard({ className = '', lines = 3, media = false }: { className?: string; lines?: number; media?: boolean }) {
  return (
    <div className={`rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6 ${className}`}>
      {media && <Bone className="mb-5 aspect-[16/9] w-full rounded-xl" />}
      <div className="mb-4 flex items-center gap-3">
        <Bone className="size-11 shrink-0 rounded-xl" />
        <span className="block flex-1 space-y-2">
          <Bone className="h-4 w-2/3" />
          <Bone className="h-3 w-1/3" />
        </span>
      </div>
      <SkeletonText lines={lines} />
    </div>
  );
}

export function SkeletonStats({ count = 3 }: { count?: number }) {
  return (
    <div className={`grid gap-4 ${count >= 4 ? 'grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'}`}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="rounded-2xl border border-line bg-surface p-5">
          <Bone className="h-3.5 w-24" />
          <Bone className="mt-3 h-8 w-16" />
          <Bone className="mt-2 h-3 w-28" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-4 px-5 py-4">
          <Bone className="size-9 shrink-0 rounded-full" />
          <span className="block flex-1 space-y-2">
            <Bone className="h-3.5" style={{ width: `${70 - (index % 3) * 12}%` }} />
            <Bone className="h-3 w-1/3" />
          </span>
          <Bone className="hidden h-7 w-20 rounded-full sm:block" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-7">
      <Bone className="mb-6 h-5 w-40" />
      <div className="flex h-44 items-end gap-1.5">
        {Array.from({ length: 24 }, (_, index) => (
          <Bone key={index} className="flex-1 rounded-md" style={{ height: `${30 + ((index * 37) % 60)}%` }} />
        ))}
      </div>
    </div>
  );
}

/** The usual dashboard page: heading, numbers, then a list or chart. */
export function DashboardSkeleton({ variant = 'list' }: { variant?: 'list' | 'stats' | 'cards' | 'form' }) {
  return (
    <div aria-busy="true">
      <SkeletonStatus />
      <div className="mb-8 space-y-3">
        <Bone className="h-3.5 w-28" />
        <Bone className="h-9 w-72 max-w-full" />
        <Bone className="h-4 w-96 max-w-full" />
      </div>
      {variant === 'stats' && (
        <div className="space-y-6">
          <SkeletonStats count={4} />
          <SkeletonChart />
          <SkeletonRows rows={4} />
        </div>
      )}
      {variant === 'list' && (
        <div className="space-y-6">
          <SkeletonCard lines={2} />
          <SkeletonRows rows={5} />
        </div>
      )}
      {variant === 'cards' && (
        <div className="space-y-6">
          <SkeletonStats count={3} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <SkeletonCard key={index} lines={2} />
            ))}
          </div>
        </div>
      )}
      {variant === 'form' && (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} className="block space-y-2">
                <Bone className="h-3.5 w-24" />
                <Bone className="h-11 w-full rounded-xl" />
              </span>
            ))}
          </div>
          <Bone className="mt-6 h-11 w-36 rounded-full" />
        </div>
      )}
    </div>
  );
}
