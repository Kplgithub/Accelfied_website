import Link from 'next/link';
import type { ReactNode } from 'react';
import { Container } from '../ui/container';

/*
 * Pages where someone fills in a form or works in their account render <FocusPageMarker />.
 * A footer of 40+ links under a short form only pulls people away from it, so on those pages
 * CSS (see "Focus pages" in globals.css) swaps the full footer for one row of key links.
 * Done in CSS rather than with usePathname, so every page shell still prerenders.
 */
export function FocusPageMarker({ app = false }: { app?: boolean }) {
  return <span hidden data-focus-page="" {...(app ? { 'data-app-page': '' } : {})} />;
}

const LEGAL: Array<{ href: string; label: string }> = [
  { href: '/how-reviews-work', label: 'How reviews work' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy policy' },
  { href: '/terms', label: 'Terms of use' },
  { href: '/refund-policy', label: 'Refund policy' },
];

/** The link-heavy part of the footer, plus the slim row that replaces it on focus pages. */
export function FooterMain({ children }: { children: ReactNode }) {
  return (
    <>
      <div data-footer-full="">{children}</div>
      <div data-footer-slim="">
        <Container>
          <nav aria-label="Footer links" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-6 text-sm sm:justify-start">
            {LEGAL.map((link) => (
              <Link key={link.href} prefetch={false} href={link.href} className="footer-link">
                {link.label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>
    </>
  );
}
