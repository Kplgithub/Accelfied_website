import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthShell } from '@/components/auth/auth-shell';
import { TokenConfirm } from '@/components/auth/token-confirm';

export const metadata: Metadata = {
  title: 'Confirm your claim',
  robots: { index: false },
};

export default function ConfirmClaimPage({ searchParams }: PageProps<'/claim/confirm'>) {
  return (
    <AuthShell eyebrow="Claim a company" title="Confirm your claim" intro="This shows us you can read email at the company's own address.">
      <Suspense fallback={<div className="h-24" />}>
        <Content searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}

async function Content({ searchParams }: Pick<PageProps<'/claim/confirm'>, 'searchParams'>) {
  const { token } = await searchParams;
  if (typeof token !== 'string' || token.length < 20) {
    return <p className="text-ink-soft">This link is missing its code. Open the link from your email again.</p>;
  }
  return <TokenConfirm kind="claim" token={token} label="Yes, confirm my claim" next={{ href: '/dashboard', label: 'See my claim in the dashboard' }} />;
}
