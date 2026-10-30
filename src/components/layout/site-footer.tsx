import { cacheLife } from 'next/cache';
import Link from 'next/link';
import { Container } from '../ui/container';
import { Logo } from './logo';

const COLUMNS = [
  {
    title: 'For clients',
    links: [
      { href: '/services', label: 'Browse services' },
      { href: '/agencies', label: 'All companies' },
      { href: '/get-matched', label: 'Get matched' },
      { href: '/get-a-quote', label: 'Get a quote' },
      { href: '/write-a-review', label: 'Write a review' },
    ],
  },
  {
    title: 'For companies',
    links: [
      { href: '/join?as=provider', label: 'List your company' },
      { href: '/get-verified', label: 'Get Verified' },
      { href: '/agencies', label: 'Claim your company' },
      { href: '/how-reviews-work', label: 'How reviews work' },
      { href: '/dashboard', label: 'Company dashboard' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '/join', label: 'Join' },
      { href: '/login', label: 'Log in' },
      { href: '/forgot-password', label: 'Forgot password' },
    ],
  },
  {
    title: 'Popular services',
    links: [
      { href: '/agencies/web-development', label: 'Web development' },
      { href: '/agencies/mobile-app-development', label: 'Mobile app development' },
      { href: '/agencies/seo', label: 'SEO' },
      { href: '/agencies/ux-ui-design', label: 'UX/UI design' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="grain mt-auto bg-night text-paper/80">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="max-w-xs">
          <Logo tone="light" />
          <p className="mt-5 text-[15px] leading-relaxed text-paper/65">
            Find the right agency for your next project, judged by what their clients actually say.
          </p>
          <Link
            href="/get-matched"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-brand px-5 text-[15px] font-medium text-white transition-colors hover:bg-brand-strong"
          >
            Get matched with companies
          </Link>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className="text-xs font-semibold tracking-[0.14em] text-accent-soft uppercase">{column.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[15px] transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-sm text-paper/50 sm:flex-row sm:justify-between">
          <p>
            © <CopyrightYear /> Accelfied. All rights reserved.
          </p>
          <p>All times shown in IST.</p>
        </Container>
      </div>
    </footer>
  );
}

async function CopyrightYear() {
  'use cache';
  cacheLife('days');
  return new Date().getFullYear();
}
