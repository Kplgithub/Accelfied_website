'use client';

import { Heart } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';

/**
 * One shared copy of the visitor's saved companies, loaded once per page and
 * kept in step across every save button on it.
 */
interface ShortlistState {
  signedIn: boolean | null;
  slugs: Set<string>;
}
let state: ShortlistState = { signedIn: null, slugs: new Set() };
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit(next: ShortlistState) {
  state = next;
  for (const listener of listeners) listener();
}

function load(): Promise<void> {
  loading ??= fetch('/api/shortlist', { cache: 'no-store' })
    .then((res) => res.json() as Promise<{ signedIn: boolean; slugs: string[] }>)
    .then((data) => emit({ signedIn: data.signedIn, slugs: new Set(data.slugs) }))
    .catch(() => emit({ signedIn: false, slugs: new Set() }));
  return loading;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const SERVER_STATE: ShortlistState = { signedIn: null, slugs: new Set() };

export function SaveButton({ slug, name, variant = 'icon' }: { slug: string; name: string; variant?: 'icon' | 'button' }) {
  const current = useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    void load();
  }, []);
  const saved = current.slugs.has(slug);

  async function toggle() {
    if (current.signedIn === false) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    const next = !saved;
    const slugs = new Set(state.slugs);
    if (next) slugs.add(slug);
    else slugs.delete(slug);
    emit({ ...state, slugs });
    setBusy(true);
    const res = await fetch('/api/shortlist', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug, saved: next }),
    }).catch(() => null);
    setBusy(false);
    if (res?.status === 401) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!res?.ok) {
      // Put it back as it was.
      const undo = new Set(state.slugs);
      if (next) undo.delete(slug);
      else undo.add(slug);
      emit({ ...state, slugs: undo });
    }
  }

  const label = saved ? `Remove ${name} from your shortlist` : `Save ${name} to your shortlist`;
  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={() => void toggle()}
        disabled={busy}
        aria-pressed={saved}
        aria-label={label}
        className={`inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border px-5 text-[15px] font-medium transition-colors disabled:opacity-60 ${
          saved ? 'border-brand/30 bg-brand/8 text-brand' : 'border-line-strong bg-surface text-ink hover:border-ink/40'
        }`}
      >
        <Heart className={`size-4 transition-transform ${saved ? 'scale-110 fill-current' : ''}`} aria-hidden="true" />
        {saved ? 'Saved' : 'Save'}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void toggle();
      }}
      disabled={busy}
      aria-pressed={saved}
      aria-label={label}
      title={saved ? 'Saved to your shortlist' : 'Save to shortlist'}
      className={`relative z-10 grid size-9 cursor-pointer place-items-center rounded-full border transition-colors disabled:opacity-60 ${
        saved ? 'border-brand/30 bg-brand/8 text-brand' : 'border-line bg-surface text-ink-faint hover:border-ink/30 hover:text-brand'
      }`}
    >
      <Heart className={`size-4 transition-transform ${saved ? 'scale-110 fill-current' : ''}`} aria-hidden="true" />
    </button>
  );
}
