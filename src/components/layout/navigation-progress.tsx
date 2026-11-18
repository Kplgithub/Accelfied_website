'use client';

import { useEffect } from 'react';

/**
 * A thin bar at the top of the window that starts the moment a visitor clicks a
 * link, so every click answers at once, even when the next page takes a while on
 * a slow phone or network. It finishes when the new address is committed.
 *
 * It works on the DOM directly (no React state), so starting it costs nothing on
 * the click itself.
 */

const BAR_ID = 'nav-progress';
/** Never leave the bar running, even if a navigation is cancelled. */
const GIVE_UP_MS = 12_000;

let running = false;
let giveUp: ReturnType<typeof setTimeout> | undefined;

function bar(): HTMLElement | null {
  return typeof document === 'undefined' ? null : document.getElementById(BAR_ID);
}

/** Starts the bar. Call it before `router.push` in code that navigates without a link. */
export function startNavigationProgress() {
  const el = bar();
  if (!el || running) return;
  running = true;
  el.dataset.state = 'loading';
  clearTimeout(giveUp);
  giveUp = setTimeout(finishNavigationProgress, GIVE_UP_MS);
}

export function finishNavigationProgress() {
  const el = bar();
  clearTimeout(giveUp);
  if (!el || !running) return;
  running = false;
  el.dataset.state = 'done';
  // Let the finishing fade play, then reset for the next navigation.
  setTimeout(() => {
    if (!running) el.dataset.state = 'idle';
  }, 400);
}

/** True when a click on this link starts a navigation inside the site that changes the page. */
function isPageChange(anchor: HTMLAnchorElement, event: MouseEvent): boolean {
  // Not `defaultPrevented`: next/link cancels the browser's own navigation to run its own.
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (anchor.target && anchor.target !== '_self') return false;
  if (anchor.hasAttribute('download')) return false;
  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
  let url: URL;
  try {
    url = new URL(anchor.href, location.href);
  } catch {
    return false;
  }
  if (url.origin !== location.origin) return false;
  // Same page (or only the #hash differs): nothing loads.
  return url.pathname !== location.pathname || url.search !== location.search;
}

export function NavigationProgress() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest?.('a');
      if (anchor instanceof HTMLAnchorElement && isPageChange(anchor, event)) startNavigationProgress();
    }
    // Next.js writes the new address to history when the next page is ready.
    const { pushState, replaceState } = history;
    history.pushState = function (...args: Parameters<History['pushState']>) {
      pushState.apply(this, args);
      finishNavigationProgress();
    };
    history.replaceState = function (...args: Parameters<History['replaceState']>) {
      replaceState.apply(this, args);
      finishNavigationProgress();
    };
    // Capture phase, so the bar starts before any other click handler runs.
    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', finishNavigationProgress);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', finishNavigationProgress);
      history.pushState = pushState;
      history.replaceState = replaceState;
      finishNavigationProgress();
    };
  }, []);

  return <div id={BAR_ID} data-state="idle" aria-hidden="true" className="nav-progress print:hidden" />;
}
