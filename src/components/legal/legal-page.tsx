import type { ReactNode } from 'react';
import Link from 'next/link';
import { Container } from '../ui/container';
import { formatDay } from '@/lib/format';
import type { SiteSettings } from '@/lib/types';

/** Values the admin panel fills in, with neutral wording until it does. */
export function legalDetails(settings: SiteSettings) {
  const { legal, contact } = settings;
  return {
    /** "Accelfied is run by …", only once the registered name is set. */
    runBy: legal.companyName ? `, run by ${legal.companyName},` : '',
    officer: legal.grievanceOfficer || 'our Grievance Officer',
    grievanceEmail: legal.grievanceEmail || contact.email,
    supportEmail: contact.email,
    address: contact.address,
    city: legal.jurisdictionCity,
    updatedOn: legal.updatedOn ? formatDay(`${legal.updatedOn}T00:00:00+05:30`) : '',
  };
}

export function LegalPage({ eyebrow = 'Legal', title, intro, updatedOn, children }: { eyebrow?: string; title: string; intro?: ReactNode; updatedOn?: string; children: ReactNode }) {
  return (
    <Container className="max-w-3xl py-14 lg:py-20">
      <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">{eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-ink sm:text-5xl">{title}</h1>
      {updatedOn && <p className="mt-3 text-sm text-ink-faint">Last updated {updatedOn}</p>}
      {intro && <p className="mt-5 text-lg leading-relaxed text-ink-soft">{intro}</p>}
      <div className="prose-post mt-10">{children}</div>
      <p className="mt-14 border-t border-line pt-6 text-sm text-ink-faint">
        Questions about this page? <Link href="/contact" className="font-medium text-accent underline-offset-4 hover:underline">Contact us</Link>.
      </p>
    </Container>
  );
}

/** An email link, or a pointer to the contact page while no address is set. */
export function MailOrContact({ email }: { email: string }) {
  return email ? <a href={`mailto:${email}`}>{email}</a> : <Link href="/contact">our contact page</Link>;
}
