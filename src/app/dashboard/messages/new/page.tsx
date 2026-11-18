import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CompanyLogo } from '@/components/company/company-logo';
import { DashboardHeader, Panel } from '@/components/dashboard/bits';
import { NewMessageForm } from '@/components/messages/new-message-form';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { getMyCompany } from '@/lib/account-data';
import { getCompany } from '@/lib/data';
import { requireUser } from '@/lib/session';

export const metadata: Metadata = { title: 'New message' };

export default async function NewMessagePage({ searchParams }: PageProps<'/dashboard/messages/new'>) {
  const raw = (await searchParams).company;
  const slug = typeof raw === 'string' && /^[a-z0-9-]{1,120}$/.test(raw) ? raw : '';
  const returnTo = `/dashboard/messages/new${slug ? `?company=${slug}` : ''}`;
  await requireUser(returnTo);
  if (!slug) {
    return (
      <EmptyState title="Choose a company first" action={<ButtonLink href="/agencies">Browse companies</ButtonLink>}>
        Open a company profile and choose “Send a message”.
      </EmptyState>
    );
  }
  const [company, mine] = await Promise.all([getCompany(slug), getMyCompany(returnTo)]);
  if (!company) notFound();
  if (mine?.slug === slug) {
    return (
      <EmptyState title="This is your own company" action={<ButtonLink href="/dashboard/messages?as=company">Open your inbox</ButtonLink>}>
        Clients write to you from your profile. Their messages arrive in your company inbox.
      </EmptyState>
    );
  }
  return (
    <>
      <DashboardHeader eyebrow="Messages" title={`Write to ${company.name}`} />
      <Panel>
        <div className="mb-6 flex items-center gap-4 border-b border-line pb-6">
          <CompanyLogo name={company.name} logoUrl={company.logoUrl} size={56} />
          <div className="min-w-0">
            <p className="font-medium text-ink">{company.name}</p>
            {company.tagline && <p className="line-clamp-1 text-sm text-ink-soft">{company.tagline}</p>}
            <Link href={`/profile/${company.slug}`} className="text-sm font-medium text-accent underline-offset-4 hover:underline">
              View profile
            </Link>
          </div>
        </div>
        <NewMessageForm companySlug={company.slug} companyName={company.name} />
        <p className="mt-6 text-[13px] text-ink-faint">
          Have a full project in mind?{' '}
          <Link href={`/get-a-quote?company=${company.slug}`} className="font-medium text-accent underline-offset-4 hover:underline">
            Send a brief instead
          </Link>{' '}
          so they see your budget and timeline.
        </p>
      </Panel>
    </>
  );
}
