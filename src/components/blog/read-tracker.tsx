'use client';

import { useEffect } from 'react';

const DEPTH_MARKS = [25, 50, 75, 100] as const;
const TIME_MARKS = [10, 30, 60, 180, 300, 600] as const;
/** No scroll, key or pointer for this long and the reader counts as away. */
const IDLE_MS = 45_000;
/** First report after this much reading, so the view counts even if the leave report is lost. */
const FIRST_REPORT_S = 5;
/** While someone keeps reading, report at least this often. */
const REPORT_EVERY_S = 120;
const SEEN_KEY = 'af_read_posts';
const SEEN_MAX = 300;

const SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|yandex|baidu|ecosia|startpage|brave)\./;
const SOCIAL = /(^|\.)(facebook|fb|instagram|linkedin|lnkd|twitter|t|x|youtube|reddit|whatsapp|pinterest|quora|telegram|threads)\.(com|co|me|net|in|org)$/;

function sourceOf(referrer: string): 'direct' | 'search' | 'social' | 'internal' | 'other' {
  if (!referrer) return 'direct';
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '');
    if (host === window.location.hostname.replace(/^www\./, '')) return 'internal';
    if (SEARCH.test(host)) return 'search';
    if (SOCIAL.test(host)) return 'social';
    return 'other';
  } catch {
    return 'other';
  }
}

function deviceOf(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth;
  const touch = window.matchMedia('(pointer: coarse)').matches;
  if (width < 640) return 'mobile';
  if (touch && width < 1100) return 'tablet';
  return 'desktop';
}

/** True the first time this browser opens the post. Remembered in local storage. */
function isNewReader(slug: string): boolean {
  try {
    const seen: string[] = JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]');
    if (seen.includes(slug)) return false;
    localStorage.setItem(SEEN_KEY, JSON.stringify([slug, ...seen].slice(0, SEEN_MAX)));
    return true;
  } catch {
    return false;
  }
}

function post(body: unknown) {
  const data = JSON.stringify(body);
  if (navigator.sendBeacon?.('/api/blog-read', new Blob([data], { type: 'application/json' }))) return;
  void fetch('/api/blog-read', { method: 'POST', body: data, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(() => undefined);
}

/**
 * Measures one read of a blog post: whether it was opened, how long it was
 * actively read (tab visible, reader not idle) and how far down the post body
 * the reader got. Sends small reports with only what changed since the last one.
 * Renders nothing.
 */
export function ReadTracker({ slug, bodyId }: { slug: string; bodyId: string }) {
  useEffect(() => {
    if (navigator.webdriver) return;
    let firstSent = false;
    let newReader: boolean | null = null;
    let active = 0;
    let sentActive = 0;
    let lastActivity = Date.now();
    let maxDepth = 0;
    const sentDepth = new Set<number>();
    const sentTime = new Set<number>();
    const source = sourceOf(document.referrer);
    const device = deviceOf();

    const measureDepth = () => {
      const body = document.getElementById(bodyId);
      if (!body) return;
      const rect = body.getBoundingClientRect();
      const seen = window.innerHeight - rect.top;
      const percent = rect.height > 0 ? Math.min(100, Math.max(0, (seen / rect.height) * 100)) : 100;
      if (percent > maxDepth) maxDepth = percent;
    };

    const report = () => {
      const seconds = active - sentActive;
      const depth = DEPTH_MARKS.filter((mark) => maxDepth >= mark && !sentDepth.has(mark));
      const time = TIME_MARKS.filter((mark) => active >= mark && !sentTime.has(mark));
      // A view counts only once the post was actually read for a moment in a visible tab.
      if (!firstSent && active < 1) return;
      if (firstSent && !seconds && !depth.length && !time.length) return;
      const first = !firstSent;
      if (first) newReader = isNewReader(slug);
      post({ slug, first, newReader: first ? newReader : false, seconds, depth, time, ...(first ? { device, source } : {}) });
      firstSent = true;
      sentActive = active;
      depth.forEach((mark) => sentDepth.add(mark));
      time.forEach((mark) => sentTime.add(mark));
    };

    const onActivity = () => {
      lastActivity = Date.now();
    };
    const onScroll = () => {
      onActivity();
      measureDepth();
    };
    const onHide = () => {
      if (document.visibilityState === 'hidden') report();
    };

    measureDepth();
    const tick = window.setInterval(() => {
      if (document.visibilityState !== 'visible' || Date.now() - lastActivity > IDLE_MS) return;
      active += 1;
      if (!firstSent ? active === FIRST_REPORT_S : active - sentActive >= REPORT_EVERY_S) report();
    }, 1000);

    const passive = { passive: true } as const;
    window.addEventListener('scroll', onScroll, passive);
    window.addEventListener('resize', measureDepth, passive);
    for (const type of ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'] as const) window.addEventListener(type, onActivity, passive);
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', report);

    return () => {
      // Leaving to another page inside the site does not fire pagehide.
      report();
      window.clearInterval(tick);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measureDepth);
      for (const type of ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'] as const) window.removeEventListener(type, onActivity);
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', report);
    };
  }, [slug, bodyId]);

  return null;
}
