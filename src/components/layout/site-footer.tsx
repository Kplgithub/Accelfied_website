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
      { href: '/get-a-quote', label: 'Get a quote' },
      { href: '/write-a-review', label: 'Write a review' },
    ],
  },
  {
    title: 'For companies',
    links: [
      { href: '/get-listed', label: 'Get listed' },
      { href: '/how-reviews-work', label: 'How reviews work' },
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
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo tone="light" />
          <p className="mt-5 text-[15px] leading-relaxed text-paper/65">
            Find the right agency for your next project, judged by what their clients actually say.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className="text-xs font-semibold tracking-[0.14em] text-saffron uppercase">{column.title}</h2>
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
