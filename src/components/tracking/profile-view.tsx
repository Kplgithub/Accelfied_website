'use client';

import { useEffect } from 'react';
import { internalReferrer, track } from './track';

/** Counts one profile open per browser tab session. Renders nothing. */
export function ProfileView({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `af_viewed:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      // Private mode: count it anyway.
    }
    track({ type: 'view', slug, from: internalReferrer() });
  }, [slug]);
  return null;
}
