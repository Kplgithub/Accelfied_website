import { Mail, MapPin, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ContactForm } from '@/components/forms/contact-form';
import { Container } from '@/components/ui/container';
import { getSiteSettings } from '@/lib/data';
import { FormSkeleton } from '@/components/skeleton/public';

export const metadata: Metadata = {
  title: 'Contact the Accelfied Team',
  description: 'Questions about a review, your listing, the Verified plan or an invoice? Write to the Accelfied team. A person replies within one working day.',
  alternates: { canonical: '/contact' },
};

const TOPICS = new Set(['general', 'reviews', 'listing', 'verified', 'billing', 'partnership', 'press', 'other']);

export default function ContactPage({ searchParams }: PageProps<'/contact'>) {
  return (
    <Container className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16 lg:py-20">
      <div>
        <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Contact</p>
        <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">Talk to a real person</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          Stuck on a review, your listing, the Verified plan or an invoice? Drop us a note. Someone on our team reads every message and usually replies within one working day.
        </p>
        <ul className="mt-8 space-y-3 text-[15px] text-ink-soft">
          <li>
            Looking for a company? <Link href="/get-matched" className="font-medium text-accent underline-offset-4 hover:underline">Get a free shortlist</Link> instead.
          </li>
          <li>
            Want to review a company? <Link href="/write-a-review" className="font-medium text-accent underline-offset-4 hover:underline">Write a review</Link>.
          </li>
        </ul>
        <Suspense fallback={null}>
          <ContactDetails />
        </Suspense>
      </div>
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-10">
        <Suspense fallback={<FormSkeleton className="min-h-96" />}>
          <Form searchParams={searchParams} />
        </Suspense>
      </div>
    </Container>
  );
}

async function Form({ searchParams }: Pick<PageProps<'/contact'>, 'searchParams'>) {
  const { topic } = await searchParams;
  return <ContactForm defaultTopic={typeof topic === 'string' && TOPICS.has(topic) ? topic : 'general'} />;
}

async function ContactDetails() {
  const { contact } = await getSiteSettings();
  if (!contact.email && !contact.phone && !contact.address) return null;
  return (
    <address className="mt-10 space-y-3 border-t border-line pt-8 text-[15px] not-italic text-ink">
      {contact.email && (
        <a href={`mailto:${contact.email}`} className="flex items-center gap-3 hover:text-accent">
          <Mail className="size-4 shrink-0 text-accent" aria-hidden="true" /> {contact.email}
        </a>
      )}
      {contact.phone && (
        <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-3 hover:text-accent">
          <Phone className="size-4 shrink-0 text-accent" aria-hidden="true" /> {contact.phone}
        </a>
      )}
      {contact.address && (
        <p className="flex items-start gap-3">
          <MapPin className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" /> {contact.address}
        </p>
      )}
    </address>
  );
}
