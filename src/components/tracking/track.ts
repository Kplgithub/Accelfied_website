'use client';

export type TrackPayload =
  | { type: 'impressions'; page: string; items: Array<{ slug: string; position: number }> }
  | { type: 'view'; slug: string; from?: string }
  | { type: 'website'; slug: string };

/** Sends a company event without delaying anything the visitor does. Automated browsers are skipped. */
export function track(payload: TrackPayload): void {
  if (typeof navigator === 'undefined' || navigator.webdriver) return;
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon?.('/api/track', new Blob([body], { type: 'application/json' }))) return;
  } catch {
    // Fall through to fetch.
  }
  void fetch('/api/track', { method: 'POST', body, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(() => undefined);
}

const LAST_LIST = 'af_last_list';

/** Lists call this, so a profile opened from them can credit the list. */
export function rememberListPage(path: string): void {
  try {
    sessionStorage.setItem(LAST_LIST, path);
  } catch {
    // Private mode: the profile view is still counted, just not credited.
  }
}

/**
 * The page the visitor came from, when it was on this site. In-app navigation
 * does not update `document.referrer`, so the last list seen in this tab wins.
 */
export function internalReferrer(): string | undefined {
  try {
    const list = sessionStorage.getItem(LAST_LIST);
    if (list) return list;
    if (!document.referrer) return undefined;
    const url = new URL(document.referrer);
    return url.origin === window.location.origin ? url.pathname : undefined;
  } catch {
    return undefined;
  }
}
