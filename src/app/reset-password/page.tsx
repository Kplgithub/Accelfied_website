import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { AuthShell } from '@/components/auth/auth-shell';
import { ResetWithCodeForm } from '@/components/auth/code-forms';
import { ResetPasswordForm } from '@/components/auth/password-forms';
import { testOtpEnabled } from '@/lib/test-otp';

export const metadata: Metadata = {
  title: 'Set a new password',
  robots: { index: false },
};

export default function ResetPasswordPage({ searchParams }: PageProps<'/reset-password'>) {
  return (
    <AuthShell eyebrow="Account help" title="Set a new password" intro="Choose a password you do not use anywhere else. Every device will be logged out.">
      <Suspense fallback={<div className="h-64" />}>
        <ResetContent searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}

async function ResetContent({ searchParams }: Pick<PageProps<'/reset-password'>, 'searchParams'>) {
  const { token, email } = await searchParams;
  // Test mode: forgot password sends people here with their email, to type the code.
  if (typeof email === 'string' && email.includes('@') && email.length <= 200 && (await testOtpEnabled())) {
    return <ResetWithCodeForm email={email} />;
  }
  if (typeof token !== 'string' || token.length < 20) {
    return (
      <div className="space-y-4">
        <p className="text-ink-soft">This link is missing its code. Open the link from your email again, or ask for a new one.</p>
        <Link href="/forgot-password" className="font-medium text-accent underline-offset-4 hover:underline">
          Send me a new link
        </Link>
      </div>
    );
  }
  return <ResetPasswordForm token={token} />;
}
