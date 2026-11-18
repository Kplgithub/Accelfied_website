'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { rememberListPage, track } from './track';

/**
 * Reports which companies a list showed and in which position, once per list.
 * `offset` is the number of results on earlier pages, so positions run on
 * across pages. Renders nothing.
 */
export function ListImpressions({ slugs, offset = 0 }: { slugs: string[]; offset?: number }) {
  const pathname = usePathname();
  const key = `${pathname}|${offset}|${slugs.join(',')}`;
  useEffect(() => {
    if (!slugs.length) return;
    rememberListPage(pathname);
    track({ type: 'impressions', page: pathname, items: slugs.slice(0, 60).map((slug, index) => ({ slug, position: offset + index + 1 })) });
    // `key` covers every input; the list is reported again only when it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return null;
}
