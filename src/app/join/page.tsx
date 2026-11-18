import { ArrowRight, Building2, Search } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { AuthShell } from '@/components/auth/auth-shell';
import { JoinForm } from '@/components/auth/join-form';
import { OAuthNotice, SocialSignIn } from '@/components/auth/social-sign-in';
import { getCurrentUser, safeNext } from '@/lib/session';
import type { AccountType } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Join Free: Hire an Agency or List Your Company',
  description: 'Create a free Accelfied account to find a trusted agency in India, or to list your own company and collect reviews from past clients.',
  alternates: { canonical: '/join' },
};

const ROLES: Array<{ value: AccountType; icon: typeof Search; title: string; text: string }> = [
  {
    value: 'client',
    icon: Search,
    title: 'I want to hire a company',
    text: 'Compare agencies on approved reviews, send one brief to several of them, and rate the team you end up working with.',
  },
  {
    value: 'provider',
    icon: Building2,
    title: 'I run an agency or firm',
    text: 'Set up a free profile, gather reviews from clients you have already delivered for, and receive project briefs.',
  },
];

const one = (value: string | string[] | undefined) => (typeof value === 'string' ? value : undefined);

export default function JoinPage({ searchParams }: PageProps<'/join'>) {
  return (
    <Suspense fallback={<div className="h-[720px]" />}>
      <JoinContent searchParams={searchParams} />
    </Suspense>
  );
}

async function JoinContent({ searchParams }: Pick<PageProps<'/join'>, 'searchParams'>) {
  const params = await searchParams;
  const next = typeof params.next === 'string' ? safeNext(params.next, '') || undefined : undefined;
  if (await getCurrentUser()) redirect(next ?? '/dashboard');

  const role = params.as === 'client' || params.as === 'provider' ? params.as : null;
  const withNext = (path: string) => (next ? `${path}${path.includes('?') ? '&' : '?'}next=${encodeURIComponent(next)}` : path);

  if (!role) {
    return (
      <AuthShell
        eyebrow="Join Accelfied"
        title={
          <>
            What brings you <span className="scribble italic">here</span>?
          </>
        }
        intro="Pick the one that fits today. The same account can do both later."
      >
        <ul className="space-y-4">
          {ROLES.map(({ value, icon: Icon, title, text }) => (
            <li key={value}>
              <Link
                href={withNext(`/join?as=${value}`)}
                className="group flex items-start gap-4 rounded-2xl border border-line p-5 transition-[border-color,box-shadow] duration-200 hover:border-accent hover:shadow-[var(--shadow-card)]"
              >
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-tint text-accent">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="flex items-center justify-between gap-2 font-medium text-ink">
                    {title}
                    <ArrowRight className="size-4 text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden="true" />
                  </span>
                  <span className="mt-1 block text-sm text-ink-soft">{text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have an account?{' '}
          <Link href={withNext('/login')} className="font-medium text-accent underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </AuthShell>
    );
  }

  const isProvider = role === 'provider';
  return (
    <AuthShell
      eyebrow={isProvider ? 'For companies' : 'For clients'}
      title={isProvider ? 'Create your company account' : 'Create your account'}
      intro={
        isProvider
          ? 'After this you add your company details. Someone on our team checks every new listing before it goes live.'
          : 'One account for every project: send briefs, keep track of replies and leave reviews, all in one place.'
      }
      aside={
        <Link href={withNext('/join')} className="text-sm font-medium text-accent underline-offset-4 hover:underline">
          {isProvider ? 'Looking to hire instead?' : 'Want to list your company instead?'}
        </Link>
      }
    >
      <OAuthNotice reason={one(params.oauth)} provider={one(params.provider)} />
      <SocialSignIn from="join" accountType={role} next={next} />
      <JoinForm accountType={role} next={next} />
      <p className="mt-5 text-center text-sm lg:hidden">
        <Link href={withNext('/join')} className="font-medium text-accent underline-offset-4 hover:underline">
          {isProvider ? 'Looking to hire instead?' : 'Want to list your company instead?'}
        </Link>
      </p>
    </AuthShell>
  );
}
