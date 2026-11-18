import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SignInPrompt } from '@/components/auth/sign-in-prompt';
import { BriefWizard } from '@/components/brief/brief-wizard';
import { Container } from '@/components/ui/container';
import { getServiceGroups } from '@/lib/data';
import { getCurrentUser } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Create a project brief',
  description: 'Answer seven short questions. We write your project brief and send it to up to five verified companies that fit.',
  alternates: { canonical: '/project-brief' },
};

export default function ProjectBriefPage({ searchParams }: PageProps<'/project-brief'>) {
  return (
    <section className="grain min-h-[80vh] border-b border-line">
      <Container className="py-12 lg:py-16">
        <Suspense fallback={<div className="mx-auto h-[520px] max-w-2xl animate-pulse rounded-[var(--radius-card)] bg-surface" />}>
          <BriefContent searchParams={searchParams} />
        </Suspense>
      </Container>
    </section>
  );
}

async function BriefContent({ searchParams }: Pick<PageProps<'/project-brief'>, 'searchParams'>) {
  const { service } = await searchParams;
  const [user, groups] = await Promise.all([getCurrentUser(), getServiceGroups()]);
  const returnTo = `/project-brief${typeof service === 'string' && service ? `?service=${encodeURIComponent(service)}` : ''}`;
  if (!user) {
    return (
      <div className="mx-auto max-w-2xl">
        <SignInPrompt
          title="Build your project brief in minutes"
          text="Log in or create a free account. We keep your brief safe and send it only to the companies you approve."
          returnTo={returnTo}
        />
      </div>
    );
  }
  return <BriefWizard groups={groups} initialService={typeof service === 'string' ? service : ''} />;
}
