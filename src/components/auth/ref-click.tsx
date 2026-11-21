'use client';

import { useEffect } from 'react';

const REF = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SEEN_KEY = 'af_ref_seen';
let sentThisLoad = false;

/** True the first time this tab opens the link, so a refresh is not counted twice. */
function firstInThisTab(ref: string): boolean {
  try {
    const seen: string[] = JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? '[]');
    if (seen.includes(ref)) return false;
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([ref, ...seen].slice(0, 20)));
  } catch {
    // Storage blocked: count it anyway.
  }
  return true;
}

/**
 * The join page opened from a personal link (www.accelfied.com/join?ref=<company>), which our
 * team sends companies by hand. Tells Accelfied the link was opened, then takes ?ref off the
 * address bar so the visitor just sees /join. Link previews (WhatsApp and the like) do not run
 * this script, so they are never counted.
 */
export function RefClick() {
  useEffect(() => {
    if (sentThisLoad) return;
    const url = new URL(window.location.href);
    const ref = url.searchParams.get('ref')?.trim().toLowerCase() ?? '';
    if (!ref) return;
    sentThisLoad = true;
    if (REF.test(ref) && ref.length <= 100 && firstInThisTab(ref)) {
      const data = JSON.stringify({ ref });
      if (!navigator.sendBeacon?.('/api/ref-click', new Blob([data], { type: 'application/json' }))) {
        void fetch('/api/ref-click', { method: 'POST', body: data, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(() => undefined);
      }
    }
    url.searchParams.delete('ref');
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }, []);
  return null;
}
