import { Mail, MapPin, Phone } from 'lucide-react';
import { cacheLife } from 'next/cache';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/data';
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
      { href: '/blog', label: 'Blog and interviews' },
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
      { href: '/company-faq', label: 'Help for companies' },
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
    title: 'Company',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy', label: 'Privacy policy' },
      { href: '/terms', label: 'Terms of use' },
      { href: '/refund-policy', label: 'Refund policy' },
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
    <footer className="grain mt-auto bg-night print:hidden text-paper/80">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.4fr_repeat(5,1fr)]">
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
          <FooterContact />
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

/** Contact details set in the admin panel; nothing shows until they are filled in. */
async function FooterContact() {
  const { contact } = await getSiteSettings();
  if (!contact.email && !contact.phone && !contact.address) return null;
  return (
    <address className="mt-7 space-y-2 text-[15px] not-italic text-paper/70">
      {contact.email && (
        <a href={`mailto:${contact.email}`} className="flex items-center gap-2 transition-colors hover:text-white">
          <Mail className="size-4 shrink-0 text-accent-soft" aria-hidden="true" /> {contact.email}
        </a>
      )}
      {contact.phone && (
        <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-2 transition-colors hover:text-white">
          <Phone className="size-4 shrink-0 text-accent-soft" aria-hidden="true" /> {contact.phone}
        </a>
      )}
      {contact.address && (
        <p className="flex items-start gap-2">
          <MapPin className="mt-1 size-4 shrink-0 text-accent-soft" aria-hidden="true" /> {contact.address}
        </p>
      )}
    </address>
  );
}

async function CopyrightYear() {
  'use cache';
  cacheLife('days');
  return new Date().getFullYear();
}
