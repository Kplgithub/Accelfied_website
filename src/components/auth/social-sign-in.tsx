import { startOAuth } from '@/app/auth-actions';

interface Props {
  from: 'login' | 'join';
  accountType?: 'client' | 'provider';
  next?: string;
}

const PROVIDERS = [
  { id: 'google', label: 'Continue with Google', icon: GoogleMark },
  { id: 'linkedin', label: 'Continue with LinkedIn', icon: LinkedInMark },
] as const;

/** Google and LinkedIn buttons, then a divider before the email form. */
export function SocialSignIn({ from, accountType = 'client', next }: Props) {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {PROVIDERS.map(({ id, label, icon: Icon }) => (
          <form key={id} action={startOAuth}>
            <input type="hidden" name="provider" value={id} />
            <input type="hidden" name="from" value={from} />
            <input type="hidden" name="accountType" value={accountType} />
            {next && <input type="hidden" name="next" value={next} />}
            <button
              type="submit"
              className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-surface text-[15px] font-medium text-ink ring-1 ring-line-strong transition-[box-shadow,background-color] duration-200 hover:bg-paper hover:ring-ink/40"
            >
              <Icon />
              {label}
            </button>
          </form>
        ))}
      </div>
      <div className="my-6 flex items-center gap-4 text-xs font-medium tracking-[0.14em] text-ink-faint uppercase" role="separator">
        <span className="h-px flex-1 bg-line" />
        or with your work email
        <span className="h-px flex-1 bg-line" />
      </div>
    </div>
  );
}

const NOTICES: Record<string, string> = {
  unavailable: 'sign-in is not switched on yet. Please use your email for now.',
  cancelled: 'sign-in was cancelled. You can try again or use your email.',
  unverified: 'did not confirm your email address. Confirm it there first, or use your email here.',
  expired: 'sign-in took too long. Please try again.',
  failed: 'sign-in did not work. Please try again or use your email.',
};

/** Explains why a Google or LinkedIn sign-in came back without logging in. */
export function OAuthNotice({ reason, provider }: { reason?: string; provider?: string }) {
  if (!reason || !NOTICES[reason]) return null;
  const name = provider === 'linkedin' ? 'LinkedIn' : 'Google';
  return (
    <p role="alert" className="mb-5 rounded-xl border border-saffron/40 bg-saffron-tint px-4 py-3 text-[15px] font-medium text-saffron-ink">
      {name} {NOTICES[reason]}
    </p>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8Z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3a7.2 7.2 0 0 1-10.8-3.8h-4v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8Z" />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M7.1 9.5h-2.7V19h2.7V9.5ZM5.8 5a1.6 1.6 0 1 0 0 3.1 1.6 1.6 0 0 0 0-3.1ZM19.6 13.6c0-2.6-.6-4.4-3.6-4.4-1.5 0-2.4.8-2.8 1.5V9.5h-2.6V19h2.7v-4.7c0-1.2.2-2.4 1.8-2.4 1.5 0 1.5 1.4 1.5 2.5V19h2.7l.3-5.4Z"
      />
    </svg>
  );
}
