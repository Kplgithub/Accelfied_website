import { Check } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { AuthShell } from '@/components/auth/auth-shell';
import { GetListedArt, HireArt } from '@/components/auth/role-art';
import { JoinForm } from '@/components/auth/join-form';
import { OAuthNotice, SocialSignIn } from '@/components/auth/social-sign-in';
import { Container } from '@/components/ui/container';
import { getCurrentUser, safeNext } from '@/lib/session';
import { dashboardUrl } from '@/lib/site';
import type { AccountType } from '@/lib/types';
import { AuthSkeleton } from '@/components/skeleton/public';

export const metadata: Metadata = {
  title: 'Join Free: Hire an Agency or List Your Company',
  description: 'Create a free Accelfied account to find a trusted agency in India, or to list your own company and collect reviews from past clients.',
  alternates: { canonical: '/join' },
};

const ROLES: Array<{ value: AccountType; Art: typeof HireArt; title: string; text: string }> = [
  {
    value: 'client',
    Art: HireArt,
    title: 'Hire a company',
    text: 'I want to find a trusted agency, compare real client reviews and hire the right team for my project.',
  },
  {
    value: 'provider',
    Art: GetListedArt,
    title: 'Get listed on Accelfied',
    text: 'I want to list my company, collect reviews from past clients and win new projects.',
  },
]

const JOIN_POINTS = [
  'Free to join, for clients and companies',
  'Every listing and review is checked by our team',
  'Sign in with Google, LinkedIn or your work email',
];

const one = (value: string | string[] | undefined) => (typeof value === 'string' ? value : undefined);

export default function JoinPage({ searchParams }: PageProps<'/join'>) {
  return (
    <Suspense fallback={<AuthSkeleton tall />}>
      <JoinContent searchParams={searchParams} />
    </Suspense>
  );
}

async function JoinContent({ searchParams }: Pick<PageProps<'/join'>, 'searchParams'>) {
  const params = await searchParams;
  const next = typeof params.next === 'string' ? safeNext(params.next, '') || undefined : undefined;
  if (await getCurrentUser()) redirect(dashboardUrl(next ?? '/dashboard'));

  const role = params.as === 'client' || params.as === 'provider' ? params.as : null;
  const withNext = (path: string) => (next ? `${path}${path.includes('?') ? '&' : '?'}next=${encodeURIComponent(next)}` : path);

  if (!role) {
    return (
      <section className="grain border-b border-line">
        <Container className="grid grid-cols-1 gap-10 py-12 lg:grid-cols-[1fr_minmax(0,560px)] lg:items-start lg:gap-16 lg:py-20">
          {/* Same two-column frame as log in. Phones go straight to the choice. */}
          <div className="hidden lg:block lg:pt-6">
            <p className="text-sm font-semibold tracking-[0.16em] text-brand uppercase">Join free</p>
            <p className="mt-3 font-display text-5xl leading-[1.08] font-semibold tracking-tight text-ink">
              One account, <span className="scribble italic">two ways</span> to use it
            </p>
            <p className="mt-5 max-w-lg text-lg text-ink-soft">Hire a company you can trust, or list your own and let past clients speak for you.</p>
            <ul className="mt-8 space-y-3 text-[15px] text-ink-soft">
              {JOIN_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent">
                    <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <form
            action="/join"
            method="get"
            className="animate-rise mx-auto w-full max-w-[600px] rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-lift)] sm:p-10"
          >
            <h1 className="font-display text-[27px] leading-tight font-semibold tracking-tight text-balance text-ink sm:text-[32px]">
              How will you use Accelfied today?
            </h1>
            {next && <input type="hidden" name="next" value={next} />}
            <fieldset className="mt-7 space-y-4">
              <legend className="sr-only">Choose how you will use Accelfied</legend>
              {ROLES.map(({ value, Art, title, text }) => (
                <label
                  key={value}
                  className="group relative flex cursor-pointer items-center gap-4 rounded-xl border border-line-strong bg-surface p-5 transition-[border-color,box-shadow,background-color] duration-200 hover:border-ink/50 has-[:checked]:border-ink has-[:checked]:bg-paper has-[:checked]:shadow-[inset_0_0_0_1px_var(--ink)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2 sm:gap-5 sm:p-6"
                >
                  <input type="radio" name="as" value={value} required className="peer sr-only" />
                  <Art className="size-14 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-has-[:checked]:scale-105 sm:size-16" />
                  <span className="flex-1">
                    <span className="block text-lg leading-snug font-semibold text-ink sm:text-xl">{title}</span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-ink-soft">{text}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute top-3 right-3 inline-flex size-5 scale-75 items-center justify-center rounded-full bg-ink text-white opacity-0 transition-[opacity,transform] duration-200 peer-checked:scale-100 peer-checked:opacity-100"
                  >
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                </label>
              ))}
            </fieldset>
            <button
              type="submit"
              className="mt-7 inline-flex h-13 w-full cursor-pointer items-center justify-center rounded-xl bg-brand text-base font-semibold text-white shadow-[inset_0_-2px_0_rgb(0_0_0/0.18)] transition-[background-color,transform] duration-200 hover:bg-brand-strong focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-px"
            >
              Continue
            </button>
            <p className="mt-6 text-center text-[15px] text-ink-soft">
              Have an account?{' '}
              <Link href={withNext('/login')} className="font-semibold text-accent underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </Container>
      </section>
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
