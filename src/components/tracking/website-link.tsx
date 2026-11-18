'use client';

import type { ComponentProps } from 'react';
import { track } from './track';

/** A link to a company's own website that counts the click for the company's analytics. */
export function WebsiteLink({ slug, onClick, ...props }: ComponentProps<'a'> & { slug: string }) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener nofollow"
      onClick={(event) => {
        track({ type: 'website', slug });
        onClick?.(event);
      }}
    />
  );
}
