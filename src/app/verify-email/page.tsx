import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { logout } from '@/app/auth-actions';
import { AuthShell } from '@/components/auth/auth-shell';
import { EmailOtpForm } from '@/components/auth/email-otp-form';
import { TokenConfirm } from '@/components/auth/token-confirm';
import { getCurrentUser, loginHref, safeNext } from '@/lib/session';
import { testOtpEnabled } from '@/lib/test-otp';

export const metadata: Metadata = {
  title: 'Confirm your email',
  robots: { index: false },
};

export default function VerifyEmailPage({ searchParams }: PageProps<'/verify-email'>) {
  return (
    <Suspense fallback={<AuthShell eyebrow="Account" title="Confirm your email"><div className="h-64" /></AuthShell>}>
      <Content searchParams={searchParams} />
    </Suspense>
  );
}

async function Content({ searchParams }: Pick<PageProps<'/verify-email'>, 'searchParams'>) {
  const { token, next, send } = await searchParams;
  // Links from older confirmation emails still work.
  if (typeof token === 'string' && token.length >= 20) {
    return (
      <AuthShell eyebrow="Account" title="Confirm your email" intro="One click, so companies and clients know your account is real.">
        <TokenConfirm kind="email" token={token} label="Confirm my email" next={{ href: '/dashboard', label: 'Go to my dashboard' }} />
      </AuthShell>
    );
  }

  const destination = safeNext(typeof next === 'string' ? next : undefined);
  const user = await getCurrentUser();
  if (!user) redirect(loginHref(`/verify-email?next=${encodeURIComponent(destination)}`));
  if (user.emailVerified) redirect(destination);

  return (
    <AuthShell
      eyebrow="One last step"
      title="Check your email"
      intro="Type the code we just sent you. It keeps your account safe and shows companies and clients that you are real."
    >
      <EmailOtpForm email={user.email} next={destination} autoSend={send === '1'} testCode={await testOtpEnabled()} />
      <form action={logout} className="mt-6 border-t border-line pt-5 text-sm text-ink-soft">
        Wrong email?{' '}
        <button type="submit" className="cursor-pointer font-medium text-accent underline-offset-4 hover:underline">
          Sign out and start again
        </button>
        <span className="mt-2 block">
          Need help?{' '}
          <Link href="/contact" className="font-medium text-accent underline-offset-4 hover:underline">
            Contact us
          </Link>
        </span>
      </form>
    </AuthShell>
  );
}
