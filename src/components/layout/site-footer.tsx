import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { cacheLife } from 'next/cache';
import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';
import { getServicePlaces, getSiteSettings } from '@/lib/data';
import { getStatePlaces, isIndexable, placePath } from '@/lib/places';
import type { ServicePlace } from '@/lib/types';
import { Container } from '../ui/container';
import { WORDMARK_DOT, WORDMARK_PATH } from './brand-mark';
import { Logo } from './logo';

interface FooterLink {
  href: string;
  label: string;
}

const COLUMNS: Array<{ title: string; links: FooterLink[] }> = [
  {
    title: 'For clients',
    links: [
      { href: '/services', label: 'Browse services' },
      { href: '/agencies', label: 'All companies' },
      { href: '/get-matched', label: 'Get a free shortlist' },
      { href: '/get-a-quote', label: 'Get a quote' },
      { href: '/write-a-review', label: 'Write a review' },
      { href: '/blog', label: 'Guides and blog' },
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
];

/** Shown in "Explore" while few services have listings, so the row is never empty. */
const POPULAR_SERVICES: FooterLink[] = [
  { href: '/agencies/web-development', label: 'Web development' },
  { href: '/agencies/mobile-app-development', label: 'Mobile app development' },
  { href: '/agencies/seo', label: 'SEO' },
  { href: '/agencies/ux-ui-design', label: 'UX/UI design' },
  { href: '/agencies/custom-software-development', label: 'Custom software development' },
  { href: '/agencies/digital-marketing', label: 'Digital marketing' },
];

/** Sister businesses shown in the bottom line, as on their own sites. */
const BUSINESSES = [
  { name: 'MCS', href: 'https://www.mycareersolution.com/', logo: '/business-mcs.webp', width: 278, height: 96 },
  { name: 'PEID', href: 'https://peid.in/', logo: '/business-peid.svg', width: 109.78, height: 36 },
];

const INDIA = 'IN';
const EXPLORE_LIMIT = 10;

export function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-night text-paper/80 print:hidden">
      <div className="footer-sheen" aria-hidden="true" />
      <div className="orb -top-40 -left-32 size-[28rem] bg-brand/20" aria-hidden="true" />
      <div className="orb top-1/3 -right-40 size-[30rem] bg-accent/25" aria-hidden="true" />
      <div className="grain">
        <Container>
          <FooterPromise />

          <div className="grid gap-x-6 gap-y-12 border-t border-white/10 py-14 grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
            <Reveal className="col-span-2 max-w-sm lg:col-span-1">
              <Logo tone="light" />
              <p className="mt-5 text-[15px] leading-relaxed text-paper/65">
                India’s directory of software, design and marketing companies, rated only on what their clients actually say.
              </p>
              <FooterContact />
            </Reveal>
            <nav aria-label="Footer" className="contents">
              {COLUMNS.map((column, index) => (
                <Reveal key={column.title} delay={80 * (index + 1)}>
                  <h2 className="text-xs font-semibold tracking-[0.16em] text-accent-soft uppercase">{column.title}</h2>
                  <ul className="mt-5 space-y-3">
                    {column.links.map((link) => (
                      <li key={link.href + link.label}>
                        <Link href={link.href} className="footer-link text-[15px]">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </nav>
          </div>

          <FooterExplore />
        </Container>

        <FooterWordmark />

        <div className="border-t border-white/10">
          <Container className="flex flex-col gap-6 py-7 text-[13px] text-paper/55 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Logo tone="light" />
              <p className="flex flex-col gap-0.5 leading-relaxed">
                <span>All trademarks are the property of their respective owners</span>
                <span>
                  All rights reserved © <CopyrightYear /> Accelfied
                </span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="w-full text-sm font-medium text-paper/80 sm:w-auto">Our businesses</span>
              {BUSINESSES.map((business) => (
                <a
                  key={business.name}
                  href={business.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={business.name}
                  className="footer-business"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- tiny fixed logo, no resizing needed */}
                  <img src={business.logo} alt={`${business.name} logo`} width={business.width} height={business.height} loading="lazy" decoding="async" />
                </a>
              ))}
            </div>
          </Container>
        </div>
      </div>
    </footer>
  );
}

/** Top band: one promise and the two main actions. */
function FooterPromise() {
  return (
    <div className="grid items-end gap-10 py-16 lg:grid-cols-[1.35fr_1fr] lg:py-20">
      <Reveal>
        <p className="text-sm font-semibold tracking-[0.16em] text-accent-soft uppercase">Hire on proof</p>
        <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.08] font-semibold tracking-tight text-white sm:text-5xl">
          Pick your next tech partner on <span className="footer-scribble">proof</span>, not promises.
        </h2>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/get-matched"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-[15px] font-medium text-white shadow-[0_10px_30px_-10px_rgb(199_54_47/0.8)] transition-colors hover:bg-brand-strong"
          >
            Get a free shortlist
            <ArrowRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
          </Link>
          <Link
            href="/join?as=provider"
            className="group inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-[15px] font-medium text-white transition-colors hover:border-white/50 hover:bg-white/5"
          >
            List your company
            <ArrowUpRight className="size-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
          </Link>
        </div>
      </Reveal>

      <Reveal delay={120} className="grid grid-cols-2 gap-3">
        <div className="footer-tile col-span-2">
          <ShieldCheck className="size-6 text-accent-soft" aria-hidden="true" />
          <p className="mt-3 text-[15px] leading-snug text-paper/80">
            Every review is read by our team before it goes live.{' '}
            <Link href="/how-reviews-work" className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white">
              How reviews work
            </Link>
          </p>
        </div>
      </Reveal>
    </div>
  );
}

/** Links to service, city and state pages that have live listings, busiest first. */
async function FooterExplore() {
  let places: ServicePlace[] = [];
  let states: ServicePlace[] = [];
  try {
    [places, states] = await Promise.all([getServicePlaces(), getStatePlaces()]);
  } catch {
    // The footer is on every page; if the API is down it simply shows fewer links.
  }

  const busiest = (list: ServicePlace[]) => list.filter(isIndexable).sort((a, b) => b.companies - a.companies || a.city.localeCompare(b.city));
  const uniqueBy = (list: ServicePlace[], key: (place: ServicePlace) => string) => {
    const seen = new Set<string>();
    return list.filter((place) => (seen.has(key(place)) ? false : (seen.add(key(place)), true)));
  };

  const listed = new Map<string, FooterLink>();
  for (const place of busiest(places)) listed.set(place.service, { href: `/agencies/${place.service}`, label: place.serviceName });
  for (const link of POPULAR_SERVICES) {
    const slug = link.href.split('/').pop() ?? '';
    if (!listed.has(slug)) listed.set(slug, link);
  }
  const services = [...listed.values()].slice(0, EXPLORE_LIMIT);

  const toLink = (place: ServicePlace): FooterLink => ({ href: placePath(place), label: `${place.serviceName} in ${place.city}` });
  const cities = uniqueBy(busiest(places.filter((p) => p.countryCode === INDIA && p.city)), (p) => p.citySlug).slice(0, EXPLORE_LIMIT).map(toLink);
  const stateLinks = uniqueBy(busiest(states), (p) => p.citySlug).slice(0, EXPLORE_LIMIT).map(toLink);

  const rows = [
    { title: 'Top services', links: services },
    { title: 'Cities', links: cities },
    { title: 'States', links: stateLinks },
  ].filter((row) => row.links.length > 0);

  return (
    <Reveal className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold text-white">Explore companies across India</h2>
        <Link href="/agencies" className="footer-link text-sm text-accent-soft">
          See every company
        </Link>
      </div>
      <div className="mt-6 grid gap-6">
        {rows.map((row) => (
          <div key={row.title} className="grid gap-3 md:grid-cols-[8rem_minmax(0,1fr)] md:gap-6">
            <h3 className="pt-1.5 text-xs font-semibold tracking-[0.16em] text-paper/45 uppercase">{row.title}</h3>
            <ul className="flex min-w-0 flex-wrap gap-2">
              {row.links.map((link) => (
                <li key={link.href} className="max-w-full max-sm:[&:nth-child(n+7)]:hidden">
                  <Link href={link.href} className="footer-chip">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

/** The wordmark set large across the foot of the page; it draws itself in when it scrolls into view. */
function FooterWordmark() {
  return (
    <Reveal className="footer-wordmark pointer-events-none mx-auto mt-14 w-full max-w-7xl px-4 select-none sm:px-6 lg:px-8">
      <svg viewBox="80 14 186 35" className="block h-auto w-full" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="footer-wordmark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.13" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={WORDMARK_PATH} />
        <circle cx={WORDMARK_DOT.cx} cy={WORDMARK_DOT.cy} r={WORDMARK_DOT.r} className="footer-wordmark-dot" />
      </svg>
    </Reveal>
  );
}

/** Contact details set in the admin panel; nothing shows until they are filled in. */
async function FooterContact() {
  const { contact } = await getSiteSettings();
  if (!contact.email && !contact.phone && !contact.address) return null;
  return (
    <address className="mt-7 space-y-2.5 text-[15px] not-italic text-paper/70">
      {contact.email && (
        <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 transition-colors hover:text-white">
          <Mail className="size-4 shrink-0 text-accent-soft" aria-hidden="true" /> {contact.email}
        </a>
      )}
      {contact.phone && (
        <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-2.5 transition-colors hover:text-white">
          <Phone className="size-4 shrink-0 text-accent-soft" aria-hidden="true" /> {contact.phone}
        </a>
      )}
      {contact.address && (
        <p className="flex items-start gap-2.5">
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
