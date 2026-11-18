'use client';

import { useEffect, useRef } from 'react';

/** Keeps the newest message in view when the thread opens and when a new one arrives. */
export function ScrollToEnd({ marker }: { marker: string }) {
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' });
  }, [marker]);
  return <div ref={end} aria-hidden="true" />;
}
