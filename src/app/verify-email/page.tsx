import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { AuthShell } from '@/components/auth/auth-shell';
import { TokenConfirm } from '@/components/auth/token-confirm';

export const metadata: Metadata = {
  title: 'Confirm your email',
  robots: { index: false },
};

export default function VerifyEmailPage({ searchParams }: PageProps<'/verify-email'>) {
  return (
    <AuthShell eyebrow="Account" title="Confirm your email" intro="One click, so companies and clients know your account is real.">
      <Suspense fallback={<div className="h-24" />}>
        <Content searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}

async function Content({ searchParams }: Pick<PageProps<'/verify-email'>, 'searchParams'>) {
  const { token } = await searchParams;
  if (typeof token !== 'string' || token.length < 20) {
    return (
      <p className="text-ink-soft">
        This link is missing its code. Open the link from your email again, or send a new one from your{' '}
        <Link href="/dashboard" className="font-medium text-accent underline-offset-4 hover:underline">
          dashboard
        </Link>
        .
      </p>
    );
  }
  return <TokenConfirm kind="email" token={token} label="Confirm my email" next={{ href: '/dashboard', label: 'Go to my dashboard' }} />;
}
