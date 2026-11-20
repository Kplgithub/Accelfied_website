import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { cacheLife } from 'next/cache';
import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';
import { getServicePlaces, getSiteSettings } from '@/lib/data';
import { getStatePlaces, isIndexable, placePath } from '@/lib/places';
import type { ServicePlace } from '@/lib/types';
import { Container } from '../ui/container';
import { FooterMain } from './footer-main';
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
      { href: '/get-verified', label: 'Get Accelfied' },
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

/*
 * Footer links are not prefetched. The footer is on every page and holds 40+ links, and
 * prefetching them all made each visit ask the server for pages most people never open.
 */
/*
 * Footer links are not prefetched. The footer is on every page and holds 40+ links, and
 * prefetching them all made each visit ask the server for pages most people never open.
 */
export function SiteFooter() {
  return (
    <footer className="relative mt-auto border-t border-line bg-surface text-ink print:hidden">
      {/* A brick-red rule with a teal tail marks where the page ends. */}
      <div className="footer-rule" aria-hidden="true" />
      <FooterMain>
      <Container>
        <div className="grid gap-x-10 gap-y-12 py-14 lg:grid-cols-[1.3fr_2.7fr] lg:py-16">
          <Reveal className="max-w-sm">
            <Logo />
            <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
              India’s directory of software, design and marketing companies, rated only on what their clients actually say.
            </p>
            <Link
              prefetch={false}
              href="/how-reviews-work"
              className="group mt-6 flex items-start gap-3 rounded-2xl border border-line bg-paper p-4 transition-colors hover:border-accent/40"
            >
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <span className="text-sm leading-relaxed text-ink-soft">
                Every review is read by our team before it goes live.{' '}
                <span className="font-medium whitespace-nowrap text-accent group-hover:underline">How reviews work</span>
              </span>
            </Link>
            <FooterContact />
          </Reveal>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {COLUMNS.map((column, index) => (
              <Reveal key={column.title} delay={70 * (index + 1)}>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <span className="h-3.5 w-[3px] rounded-full bg-brand" aria-hidden="true" />
                  {column.title}
                </h2>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link prefetch={false} href={link.href} className="footer-link text-[15px]">
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

        <div className="flex flex-col gap-4 border-t border-line py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Link
              prefetch={false}
              href="/get-matched"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
            >
              Get a free shortlist
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              prefetch={false}
              href="/join?as=provider"
              className="group inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-sm font-medium text-ink transition-colors hover:border-ink"
            >
              List your company
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
          </div>
          <p className="text-sm text-ink-faint">Made in India · All times in IST</p>
        </div>
      </Container>
      </FooterMain>

      <div className="bg-night text-paper/60">
        <Container className="flex flex-col gap-6 py-7 text-[13px] lg:flex-row lg:items-center lg:justify-between">
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
              <a key={business.name} href={business.href} target="_blank" rel="noopener" aria-label={business.name} className="footer-business">
                {/* eslint-disable-next-line @next/next/no-img-element -- tiny fixed logo, no resizing needed */}
                <img src={business.logo} alt={`${business.name} logo`} width={business.width} height={business.height} loading="lazy" decoding="async" />
              </a>
            ))}
          </div>
        </Container>
      </div>
    </footer>
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
    <Reveal className="border-t border-line py-12">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Explore companies across India</h2>
        <Link prefetch={false} href="/agencies" className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
          See every company <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <div key={row.title} className="min-w-0">
            <h3 className="text-xs font-semibold tracking-[0.16em] text-ink-faint uppercase">{row.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {row.links.map((link) => (
                <li key={link.href} className="max-sm:[&:nth-child(n+7)]:hidden">
                  <Link prefetch={false} href={link.href} className="footer-index-link">
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

/** Contact details set in the admin panel; nothing shows until they are filled in. */
async function FooterContact() {
  const { contact } = await getSiteSettings();
  if (!contact.email && !contact.phone && !contact.address) return null;
  return (
    <address className="mt-6 space-y-2.5 text-[15px] not-italic text-ink-soft">
      {contact.email && (
        <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 transition-colors hover:text-accent">
          <Mail className="size-4 shrink-0 text-accent" aria-hidden="true" /> {contact.email}
        </a>
      )}
      {contact.phone && (
        <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-2.5 transition-colors hover:text-accent">
          <Phone className="size-4 shrink-0 text-accent" aria-hidden="true" /> {contact.phone}
        </a>
      )}
      {contact.address && (
        <p className="flex items-start gap-2.5">
          <MapPin className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" /> {contact.address}
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
