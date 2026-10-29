import { LockKeyhole } from 'lucide-react';
import { ButtonLink } from '../ui/button';

interface Props {
  title: string;
  text: string;
  returnTo: string;
  /** Which kind of account the join link should start with. */
  joinAs?: 'client' | 'provider';
}

/** Shown in place of a form that needs an account. */
export function SignInPrompt({ title, text, returnTo, joinAs = 'client' }: Props) {
  const next = encodeURIComponent(returnTo);
  return (
    <div className="grain rounded-[var(--radius-card)] border border-line bg-surface p-8 text-center shadow-[var(--shadow-card)] sm:p-12">
      <span className="mx-auto inline-flex size-12 items-center justify-center rounded-2xl bg-brand-tint text-brand">
        <LockKeyhole className="size-5" aria-hidden="true" />
      </span>
      <h2 className="mt-5 font-display text-3xl font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-ink-soft">{text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href={`/login?next=${next}`}>Log in</ButtonLink>
        <ButtonLink href={`/join?as=${joinAs}&next=${next}`} variant="secondary">
          Create a free account
        </ButtonLink>
      </div>
    </div>
  );
}
