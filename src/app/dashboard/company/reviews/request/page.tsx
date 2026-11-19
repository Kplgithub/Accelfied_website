import type { Metadata } from 'next';
import { ArrowLeft, ClipboardCheck, Mail, PenLine, ShieldCheck, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Panel } from '@/components/dashboard/bits';
import { CopyLink } from '@/components/dashboard/copy-link';
import { NoCompany } from '@/components/dashboard/no-company';
import { ReviewInviteForm } from '@/components/dashboard/review-invites';
import { Reveal } from '@/components/motion/reveal';
import { EmptyState } from '@/components/ui/empty-state';
import { getMyCompany } from '@/lib/account-data';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = { title: 'Request a client review' };

const HERE = '/dashboard/company/reviews/request';
const BACK = '/dashboard/company/reviews';

const STEPS: Array<{ icon: LucideIcon; title: string; text: string }> = [
  { icon: PenLine, title: 'Add your client', text: 'Enter the name and email of a client you finished a project with.' },
  { icon: Mail, title: 'We email them', text: 'Your client gets a private link to a short review form, sent by Accelfied.' },
  { icon: ClipboardCheck, title: 'They write the review', text: 'About ten minutes: the project, the results and a rating out of five.' },
  { icon: ShieldCheck, title: 'We check and publish', text: 'Our team confirms the client is real, then the review shows on your profile.' },
];

export default async function RequestReviewPage() {
  const company = await getMyCompany(HERE);
  if (!company || company.status === 'rejected') return <NoCompany />;
  const live = company.status === 'published';
  return (
    <>
      <Link href={BACK} className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Client reviews
      </Link>
      <header className="mb-8">
        <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">{company.name}</p>
        <h1 className="mt-2 font-display text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-4xl">Request a client review</h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Clients trust what other clients say. Ask the people you have worked with, and each honest review lifts your place in the directory.
        </p>
      </header>

      <section aria-labelledby="how-it-works" className="mb-8">
        <h2 id="how-it-works" className="sr-only">
          How it works
        </h2>
        <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 70} className="relative rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent-tint text-accent">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-display text-sm font-semibold text-ink-faint tabular-nums">Step {index + 1}</span>
              </div>
              <p className="mt-4 font-display text-lg font-semibold text-ink">{step.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {live ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Panel title="Your client's details">
            <ReviewInviteForm companyName={company.name} />
          </Panel>
          <div className="space-y-6">
            <Panel title="Or share your link">
              <p className="mb-4 text-sm text-ink-soft">Send it on WhatsApp or in your own email. It opens the review form for {company.name}.</p>
              <CopyLink url={`${SITE_URL}/write-a-review?company=${company.slug}`} />
            </Panel>
            <div className="rounded-[var(--radius-card)] border border-line bg-paper-deep/60 p-5 sm:p-6">
              <p className="font-display text-lg font-semibold text-ink">Who to ask</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                <li>• Clients whose project finished in the last two years.</li>
                <li>• The person who managed the work with you, not a friend of the team.</li>
                <li>• Use their work email. It helps our team confirm the review faster.</li>
              </ul>
              <Link href={`${BACK}?tab=requests`} className="mt-4 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline">
                See requests you sent
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState title="Your profile is not live yet">You can request reviews as soon as our team approves your profile.</EmptyState>
      )}
    </>
  );
}
