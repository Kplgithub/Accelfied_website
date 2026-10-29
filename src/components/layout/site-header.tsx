import Link from 'next/link';
import { ButtonLink } from '../ui/button';
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
          <ButtonLink href="/get-a-quote" size="sm" className="hidden sm:inline-flex">
            Get a quote
          </ButtonLink>
          <MobileMenu links={NAV_LINKS} />
        </div>
      </Container>
    </header>
  );
}
