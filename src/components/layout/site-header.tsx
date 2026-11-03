import Link from 'next/link';
import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/session';
import { ButtonLink } from '../ui/button';
import { AccountMenu } from './account-menu';
import { Container } from '../ui/container';
import { Logo } from './logo';
import { MobileMenu } from './mobile-menu';

export const NAV_LINKS = [
  { href: '/services', label: 'Browse services' },
  { href: '/agencies', label: 'All companies' },
  { href: '/write-a-review', label: 'Write a review' },
  { href: '/get-listed', label: 'For companies' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/85 backdrop-blur-md supports-[backdrop-filter]:bg-paper/75">
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-[15px] text-ink-soft transition-colors duration-150 hover:bg-ink/5 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Suspense
            fallback={
              <>
                <QuoteButton />
                <MobileMenu links={NAV_LINKS} />
              </>
            }
          >
            <AccountActions />
          </Suspense>
        </div>
      </Container>
    </header>
  );
}

/** Reads the session cookie, so it streams in after the static header. */
async function AccountActions() {
  const user = await getCurrentUser();
  return (
    <>
      {user ? (
        <AccountMenu firstName={user.firstName} lastName={user.lastName} email={user.email} />
      ) : (
        <Link
          href="/login"
          className="hidden rounded-full px-3.5 py-2 text-[15px] font-medium text-ink transition-colors duration-150 hover:bg-ink/5 lg:inline-flex"
        >
          Log in
        </Link>
      )}
      <QuoteButton />
      <MobileMenu links={NAV_LINKS} account={user ? { firstName: user.firstName, email: user.email } : null} />
    </>
  );
}

function QuoteButton() {
  return (
    <ButtonLink href="/get-a-quote" size="sm" className="hidden sm:inline-flex">
      Get a quote
    </ButtonLink>
  );
}
