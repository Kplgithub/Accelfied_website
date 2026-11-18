import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthShell } from '@/components/auth/auth-shell';
import { TokenConfirm } from '@/components/auth/token-confirm';

export const metadata: Metadata = {
  title: 'Stop invitation emails',
  robots: { index: false },
};

export default function UnsubscribePage({ searchParams }: PageProps<'/unsubscribe'>) {
  return (
    <AuthShell eyebrow="Email settings" title="Stop invitation emails" intro="One click and we will not email you about joining Accelfied again.">
      <Suspense fallback={<div className="h-24" />}>
        <Content searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}

async function Content({ searchParams }: Pick<PageProps<'/unsubscribe'>, 'searchParams'>) {
  const { token } = await searchParams;
  if (typeof token !== 'string' || token.length < 20) {
    return <p className="text-ink-soft">This link is missing its code. Please open the link from the email again.</p>;
  }
  return <TokenConfirm kind="unsubscribe" token={token} label="Stop these emails" next={{ href: '/', label: 'Go to Accelfied' }} />;
}
