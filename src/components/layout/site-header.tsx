import { ChevronDown, Target } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { getServiceGroups } from '@/lib/data';
import { getCurrentUser } from '@/lib/session';
import { GroupIcon } from '../home/group-icon';
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
  { href: '/get-verified', label: 'Get Verified' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/85 backdrop-blur-md supports-[backdrop-filter]:bg-paper/75">
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-[68px]">
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
                <GuestActions />
                <MobileMenu links={NAV_LINKS} />
              </>
            }
          >
            <AccountActions />
          </Suspense>
        </div>
      </Container>
      <Suspense fallback={<div className="hidden h-11 border-t border-line/70 lg:block" />}>
        <ServiceBar />
      </Suspense>
    </header>
  );
}

/** Reads the session cookie, so it streams in after the static header. */
async function AccountActions() {
  const user = await getCurrentUser();
  return (
    <>
      {user ? <AccountMenu firstName={user.firstName} lastName={user.lastName} email={user.email} /> : <GuestActions />}
      <MobileMenu links={NAV_LINKS} account={user ? { firstName: user.firstName, email: user.email } : null} />
    </>
  );
}

function GuestActions() {
  return (
    <>
      <Link
        href="/login"
        className="hidden rounded-full px-3.5 py-2 text-[15px] font-medium text-ink transition-colors duration-150 hover:bg-ink/5 sm:inline-flex"
      >
        Log in
      </Link>
      <ButtonLink href="/join" size="sm" className="px-4 sm:px-5">
        Join
      </ButtonLink>
    </>
  );
}

/** Second row on large screens: every service group opens a menu of its services. */
async function ServiceBar() {
  const groups = await getServiceGroups();
  return (
    <div className="hidden border-t border-line/70 lg:block">
      <Container className="flex h-11 items-center justify-between gap-4">
        <ul className="flex items-center gap-1">
          {groups.map((group, index) => (
            <li key={group.slug} className="group/menu relative">
              <Link
                href={`/services#${group.slug}`}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-ink-soft transition-colors hover:text-ink group-focus-within/menu:text-ink"
              >
                {group.name}
                <ChevronDown className="size-3.5 transition-transform duration-200 group-hover/menu:rotate-180" aria-hidden="true" />
              </Link>
              <div className={`invisible absolute top-full ${index < groups.length / 2 ? 'left-0' : 'right-0'} z-50 w-[min(560px,80vw)] translate-y-1 pt-2 opacity-0 transition-[opacity,transform,visibility] duration-200 group-focus-within/menu:visible group-focus-within/menu:translate-y-0 group-focus-within/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:opacity-100`}>
                <div className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-lift)]">
                  <div className="flex items-center gap-3 border-b border-line pb-4">
                    <span className="inline-flex size-9 items-center justify-center rounded-lg bg-accent-tint text-accent">
                      <GroupIcon slug={group.slug} className="size-4.5" />
                    </span>
                    <div>
                      <p className="font-display text-lg font-semibold text-ink">{group.name}</p>
                      <p className="text-xs text-ink-faint">{group.services.length} services</p>
                    </div>
                  </div>
                  <ul className="mt-3 grid grid-cols-2 gap-x-4">
                    {group.services.map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/agencies/${service.slug}`}
                          className="block rounded-lg px-2 py-1.5 text-sm text-ink-soft transition-colors hover:bg-paper hover:text-accent"
                        >
                          {service.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Link
          href="/get-matched"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent-tint"
        >
          <Target className="size-4" aria-hidden="true" />
          Get matched with companies
        </Link>
      </Container>
    </div>
  );
}
