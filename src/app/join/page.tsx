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
  title: 'Create an account',
  description: 'Join Accelfied to hire a trusted company or to list your own company and collect client reviews.',
  alternates: { canonical: '/join' },
};

const ROLES: Array<{ value: AccountType; icon: typeof Search; title: string; text: string }> = [
  {
    value: 'client',
    icon: Search,
    title: 'Hire a business partner',
    text: 'Compare companies by real reviews, send your brief and review the people you worked with.',
  },
  {
    value: 'provider',
    icon: Building2,
    title: 'Get my company listed',
    text: 'Create a free profile, collect reviews from past clients and receive project requests.',
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
        intro="Pick one to get started. You can always do both later from the same account."
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
          ? 'Next you will add your company details. Our team checks every new listing before it goes live.'
          : 'Save time on every project: send briefs, track replies and share reviews from one place.'
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
