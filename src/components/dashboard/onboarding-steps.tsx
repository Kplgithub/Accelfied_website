import { Check } from 'lucide-react';
import Link from 'next/link';
import type { OwnedCompany } from '@/lib/types';

interface Step {
  title: string;
  text: string;
  done: boolean;
  href?: string;
  cta?: string;
}

export function companySteps(company: OwnedCompany | null): Step[] {
  const profileComplete = Boolean(company && company.logoUrl && company.tagline && company.portfolio.length > 0);
  return [
    { title: 'Create your account', text: 'You are signed in and ready.', done: true },
    {
      title: 'Add your company details',
      text: 'Services, rates, locations and what makes your team good at it.',
      done: Boolean(company),
      href: '/get-listed',
      cta: 'Add details',
    },
    {
      title: 'Our team checks your listing',
      text:
        company?.status === 'rejected'
          ? 'We could not approve this listing. Reply to our email or contact support to fix it.'
          : 'Usually within two working days. We email you when it is live.',
      done: company?.status === 'published',
    },
    {
      title: 'Complete your profile',
      text: 'A logo, a one-line tagline and at least one portfolio project.',
      done: profileComplete,
      href: company ? (company.portfolio.length ? '/dashboard/company' : '/dashboard/company/portfolio') : undefined,
      cta: 'Finish profile',
    },
    {
      title: 'Collect your first client review',
      text: 'Send past clients your review link. Every review is checked before it counts.',
      done: (company?.rating.count ?? 0) > 0,
      href: company?.status === 'published' ? '/dashboard/company/reviews' : undefined,
      cta: 'Get review link',
    },
  ];
}

export function OnboardingSteps({ steps }: { steps: Step[] }) {
  const done = steps.filter((step) => step.done).length;
  const current = steps.findIndex((step) => !step.done);
  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper-deep" role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={done} aria-label="Setup progress">
          <div className="h-full rounded-full bg-brand transition-[width] duration-700" style={{ width: `${(done / steps.length) * 100}%` }} />
        </div>
        <span className="text-sm font-medium text-ink-soft tabular-nums">
          {done} of {steps.length} done
        </span>
      </div>
      <ol className="space-y-1">
        {steps.map((step, index) => {
          const isCurrent = index === current;
          return (
            <li key={step.title} className={`flex gap-4 rounded-2xl p-3.5 ${isCurrent ? 'bg-paper' : ''}`}>
              <span
                className={`mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  step.done ? 'bg-brand text-white' : isCurrent ? 'bg-saffron text-night' : 'bg-paper-deep text-ink-faint'
                }`}
              >
                {step.done ? <Check className="size-4" aria-hidden="true" /> : index + 1}
              </span>
              <div className="flex-1">
                <p className={`font-medium ${step.done ? 'text-ink-soft line-through decoration-ink-faint/50' : 'text-ink'}`}>
                  {step.title}
                  {step.done && <span className="sr-only"> (done)</span>}
                </p>
                {!step.done && <p className="mt-0.5 text-sm text-ink-soft">{step.text}</p>}
              </div>
              {isCurrent && step.href && step.cta && (
                <Link href={step.href} className="self-center rounded-full bg-brand px-4 py-2 text-sm font-medium whitespace-nowrap text-white hover:bg-brand-strong">
                  {step.cta}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
