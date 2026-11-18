import type { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import { SignInPrompt } from '@/components/auth/sign-in-prompt';
import { BriefWizard } from '@/components/brief/brief-wizard';
import { Container } from '@/components/ui/container';
import { getServiceGroups } from '@/lib/data';
import { getCurrentUser } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Free project brief: get quotes from top companies in India',
  description: 'Answer seven quick questions about your project. We turn them into a clear brief you can send to up to five software, app or marketing companies in India.',
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
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
        <Image
          src="/images/pages/brief.webp"
          alt="A team planning a new project on a glass board"
          width={1200}
          height={800}
          priority
          sizes="(min-width: 1024px) 480px, 100vw"
          className="aspect-[4/3] w-full animate-rise rounded-[1.75rem] object-cover shadow-[var(--shadow-lift)]"
        />
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
