import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { AuthShell } from '@/components/auth/auth-shell';
import { LoginForm } from '@/components/auth/login-form';
import { OAuthNotice, SocialSignIn } from '@/components/auth/social-sign-in';
import { getCurrentUser, safeNext } from '@/lib/session';
import { AuthSkeleton } from '@/components/skeleton/public';
import { dashboardUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to your Accelfied account.',
  alternates: { canonical: '/login' },
  robots: { index: false, follow: true },
};

export default function LoginPage({ searchParams }: PageProps<'/login'>) {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginContent({ searchParams }: Pick<PageProps<'/login'>, 'searchParams'>) {
  const params = await searchParams;
  const next = typeof params.next === 'string' ? safeNext(params.next, '') || undefined : undefined;
  if (await getCurrentUser()) redirect(dashboardUrl(next ?? '/dashboard'));

  return (
    <AuthShell
      eyebrow="Welcome back"
      title={
        <>
          Log in to <span className="scribble italic">Accelfied</span>
        </>
      }
      intro={next ? 'Log in to continue where you left off.' : 'Pick up your briefs, reviews and company profile where you left them.'}
    >
      {params.reset === '1' && (
        <p role="status" className="mb-5 rounded-xl border border-accent/25 bg-accent-tint px-4 py-3 text-[15px] font-medium text-accent">
          Your password is changed. Log in with the new one.
        </p>
      )}
      <OAuthNotice reason={typeof params.oauth === 'string' ? params.oauth : undefined} provider={typeof params.provider === 'string' ? params.provider : undefined} />
      <SocialSignIn from="login" next={next} />
      <LoginForm next={next} />
    </AuthShell>
  );
}
