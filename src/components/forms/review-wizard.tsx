'use client';

import { ArrowLeft, ArrowRight, Check, LogOut, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { submitReview } from '@/app/actions';
import { discardReviewDraft, saveReviewDraft, type DraftAnswers } from '@/app/review-draft-actions';
import { initialFormState } from '@/lib/form-state';
import { BUDGETS, INDUSTRIES, TEAM_SIZES } from '@/lib/labels';
import type { ReviewDraft, ServiceGroup } from '@/lib/types';
import { Button, ButtonLink } from '../ui/button';
import { Field, Input, Select, Textarea } from '../ui/field';
import { FormAlert, Honeypot, SubmitButton, SuccessPanel } from './form-bits';
import { StarInput } from './star-input';

interface Props {
  company: { slug: string; name: string; services: Array<{ slug: string; name: string }> };
  groups: ServiceGroup[];
  account: { name: string; email: string };
  invite?: string;
  draft: ReviewDraft | null;
}

const MIN_STORY = 40;

const SCORES = [
  { name: 'ratings.overall', label: 'Overall experience' },
  { name: 'ratings.quality', label: 'Quality of work' },
  { name: 'ratings.schedule', label: 'Kept to schedule' },
  { name: 'ratings.cost', label: 'Value for money' },
  { name: 'ratings.willingToRefer', label: 'Likely to refer them' },
];

const STORY = [
  { name: 'content.background', title: 'Tell us about your business', hint: 'Who are you, and what did you hire them for?', placeholder: 'We are a chain of 40 stores and needed…' },
  { name: 'content.challenge', title: 'What challenge were you facing?', hint: 'What problem were you trying to solve?', placeholder: 'Our customers could not…' },
  { name: 'content.solution', title: 'How did they solve it?', hint: 'What did the team do, and how did they work with you?', placeholder: 'The team ran a discovery week, then…' },
  { name: 'content.results', title: 'What results did you see?', hint: 'What changed? Share outcomes, numbers or feedback if you can.', placeholder: 'Within three months…' },
];

const STEPS = [
  { title: 'Your project', fields: ['project.title', 'project.serviceSlug', 'project.budget'] },
  { title: 'Project dates', fields: ['project.startedOn', 'project.endedOn'] },
  { title: 'Your ratings', fields: SCORES.map((s) => s.name) },
  ...STORY.map((s) => ({ title: s.title, fields: [s.name] })),
  { title: 'About you', fields: ['reviewer.name', 'reviewer.jobTitle', 'reviewer.companyName', 'reviewer.companySize', 'reviewer.industry', 'reviewer.location'] },
  { title: 'Review and submit', fields: ['consent'] },
];
const LAST = STEPS.length - 1;
const SKIP = new Set(['companySlug', 'invite', 'companyFax']);

/** Reads the whole form, including steps that are not on screen. */
function snapshot(form: HTMLFormElement): DraftAnswers {
  const answers: DraftAnswers = {};
  for (const [key, value] of new FormData(form)) {
    if (SKIP.has(key) || typeof value !== 'string') continue;
    answers[key] = value === 'on' ? true : value;
  }
  return answers;
}

function check(step: number, a: DraftAnswers): Record<string, string> {
  const s = (key: string) => (typeof a[key] === 'string' ? (a[key] as string).trim() : '');
  const errors: Record<string, string> = {};
  if (step === 0) {
    if (s('project.title').length < 4) errors['project.title'] = 'Give the project a short name, at least 4 characters.';
    if (!s('project.budget')) errors['project.budget'] = 'Choose the budget range.';
  } else if (step === 1) {
    if (!s('project.startedOn')) errors['project.startedOn'] = 'Choose the month the project started.';
    if (!a['project.ongoing']) {
      if (!s('project.endedOn')) errors['project.endedOn'] = 'Add an end month, or tick "Still working together".';
      else if (s('project.startedOn') && s('project.endedOn') < s('project.startedOn')) errors['project.endedOn'] = 'The end month must be after the start.';
    }
  } else if (step === 2) {
    for (const score of SCORES) if (!s(score.name)) errors[score.name] = 'Please choose a rating.';
  } else if (step >= 3 && step <= 6) {
    const name = STORY[step - 3]!.name;
    if (s(name).length < MIN_STORY) errors[name] = `Please write at least ${MIN_STORY} characters.`;
  } else if (step === 7) {
    if (s('reviewer.name').length < 2) errors['reviewer.name'] = 'Add your full name.';
    if (s('reviewer.jobTitle').length < 2) errors['reviewer.jobTitle'] = 'Add your job title.';
    if (s('reviewer.companyName').length < 2) errors['reviewer.companyName'] = 'Add your company name.';
    if (!s('reviewer.companySize')) errors['reviewer.companySize'] = 'Choose your company size.';
  } else if (step === LAST && !a.consent) {
    errors.consent = 'Please confirm the review is truthful.';
  }
  return errors;
}

export function ReviewWizard({ company, groups, account, invite, draft }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useActionState(submitReview, initialFormState);
  const saved = draft?.answers ?? {};
  const str = (key: string) => (typeof saved[key] === 'string' ? (saved[key] as string) : '');
  const [step, setStep] = useState(() => Math.min(Math.max(draft?.step ?? 0, 0), LAST));
  const [direction, setDirection] = useState(1);
  const [ongoing, setOngoing] = useState(saved['project.ongoing'] === true);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [lengths, setLengths] = useState<Record<string, number>>(() => Object.fromEntries(STORY.map((s) => [s.name, str(s.name).length])));
  const [summary, setSummary] = useState<DraftAnswers>({});
  const [confirmExit, setConfirmExit] = useState(false);
  const [exiting, startExit] = useTransition();
  const [exitFailed, setExitFailed] = useState(false);
  const thisMonth = new Date().toISOString().slice(0, 7);

  // A server error sends the reviewer back to the first step that needs fixing.
  const [seen, setSeen] = useState(state);
  if (seen !== state) {
    setSeen(state);
    const first = state.status === 'error' ? STEPS.findIndex((s) => s.fields.some((field) => state.errors?.[field])) : -1;
    if (first >= 0) {
      setDirection(-1);
      setStep(first);
    }
  }

  useEffect(() => {
    if (state.status === 'success') void discardReviewDraft(company.slug);
  }, [state.status, company.slug]);

  if (state.status === 'success') {
    return (
      <SuccessPanel title="Waiting for review to be published" message={state.message} steps={['Submitted', 'Our team is verifying', 'Published on the profile']}>
        <ButtonLink href={`/profile/${company.slug}`} variant="secondary">
          Back to {company.name}
        </ButtonLink>
        <ButtonLink href="/dashboard/reviews">My reviews</ButtonLink>
      </SuccessPanel>
    );
  }

  const error = (name: string) => clientErrors[name] ?? state.errors?.[name];
  const otherServices = groups.flatMap((g) => g.services).filter((s) => !company.services.some((c) => c.slug === s.slug));

  const go = (next: number) => {
    const form = formRef.current;
    if (!form) return;
    const answers = snapshot(form);
    if (next > step) {
      const errors = check(step, answers);
      setClientErrors(errors);
      if (Object.keys(errors).length) {
        form.querySelector<HTMLElement>(`[data-step="${step}"] [aria-invalid="true"], [data-step="${step}"] input[type=radio]`)?.focus();
        return;
      }
      // Quietly keep progress, so a closed tab never loses the review.
      void saveReviewDraft(company.slug, next, answers);
    } else {
      setClientErrors({});
    }
    if (next === LAST) setSummary(answers);
    setDirection(next > step ? 1 : -1);
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveAndExit = () => {
    const form = formRef.current;
    if (!form) return;
    setExitFailed(false);
    startExit(async () => {
      const result = await saveReviewDraft(company.slug, step, snapshot(form));
      if (result.ok) router.push('/dashboard?saved=review');
      else setExitFailed(true);
    });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const errors = check(LAST, snapshot(event.currentTarget));
    setClientErrors(errors);
    if (Object.keys(errors).length) event.preventDefault();
  };

  const progress = Math.round(((step + 1) / STEPS.length) * 100);
  const average =
    SCORES.reduce((sum, score) => sum + (Number(summary[score.name]) || 0), 0) / SCORES.length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <p className="text-sm text-ink-soft">
          Step <span className="font-semibold text-ink">{step + 1}</span> of {STEPS.length}
          <span className="hidden sm:inline"> · {STEPS[step]!.title}</span>
        </p>
        <button
          type="button"
          onClick={() => setConfirmExit(true)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper hover:text-ink"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Save &amp; exit
        </button>
      </div>
      <div
        className="mb-10 h-1.5 overflow-hidden rounded-full bg-paper-deep"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label="Review progress"
      >
        <div className="h-full rounded-full bg-gradient-to-r from-brand to-saffron transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {draft && step > 0 && (
        <p className="mb-6 rounded-xl bg-accent-tint px-4 py-3 text-sm text-accent">
          Welcome back. We kept your answers, so you can carry on where you left off.
        </p>
      )}

      <form ref={formRef} action={action} onSubmit={onSubmit} className="relative" noValidate onInput={(event) => {
        const target = event.target as HTMLTextAreaElement;
        if (target.name?.startsWith('content.')) setLengths((prev) => ({ ...prev, [target.name]: target.value.trim().length }));
      }} onChange={(event) => {
        // Clear a field's message as soon as the reviewer fixes it.
        const name = (event.target as unknown as HTMLInputElement).name;
        if (name && clientErrors[name]) {
          setClientErrors((prev) => {
            const next = { ...prev };
            delete next[name];
            return next;
          });
        }
      }}>
        <Honeypot />
        <input type="hidden" name="companySlug" value={company.slug} />
        {invite && <input type="hidden" name="invite" value={invite} />}
        <div className="mb-6">
          <FormAlert state={state} />
        </div>

        {STEPS.map((meta, index) => (
          <section
            key={meta.title}
            data-step={index}
            hidden={index !== step}
            aria-labelledby={`review-step-${index}`}
            style={index === step ? { animation: `${direction === 1 ? 'brief-in-right' : 'brief-in-left'} 420ms cubic-bezier(0.2,0.7,0.2,1) both` } : undefined}
          >
            <h2 id={`review-step-${index}`} className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {meta.title}
            </h2>

            {index === 0 && (
              <div className="mt-8 grid gap-5">
                <Field label="What was the project called?" name="project.title" hint="e.g. Loyalty app for our retail stores" error={error('project.title')}>
                  {(ids) => <Input id={ids.id} name="project.title" defaultValue={str('project.title')} maxLength={140} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
                </Field>
                <Field label="Which service did they provide?" name="project.serviceSlug" error={error('project.serviceSlug')}>
                  {(ids) => (
                    <Select id={ids.id} name="project.serviceSlug" defaultValue={str('project.serviceSlug') || company.services[0]?.slug || ''} aria-describedby={ids.describedBy}>
                      <optgroup label={`${company.name} services`}>
                        {company.services.map((service) => (
                          <option key={service.slug} value={service.slug}>
                            {service.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Other services">
                        {otherServices.map((service) => (
                          <option key={service.slug} value={service.slug}>
                            {service.name}
                          </option>
                        ))}
                      </optgroup>
                    </Select>
                  )}
                </Field>
                <fieldset>
                  <legend className="text-sm font-medium text-ink">What was the budget?</legend>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {BUDGETS.map((budget) => (
                      <label key={budget.value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink transition-colors hover:border-ink/30 has-[:checked]:border-brand has-[:checked]:bg-brand/5">
                        <input type="radio" name="project.budget" value={budget.value} defaultChecked={str('project.budget') === budget.value} className="size-4 accent-[var(--brand)]" />
                        {budget.label}
                      </label>
                    ))}
                  </div>
                  {error('project.budget') && (
                    <p role="alert" className="mt-2 text-[13px] font-medium text-danger">
                      {error('project.budget')}
                    </p>
                  )}
                </fieldset>
              </div>
            )}

            {index === 1 && (
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field label="Started" name="project.startedOn" error={error('project.startedOn')}>
                  {(ids) => <Input id={ids.id} type="month" name="project.startedOn" max={thisMonth} defaultValue={str('project.startedOn')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
                </Field>
                <Field label="Ended" name="project.endedOn" error={error('project.endedOn')}>
                  {(ids) => (
                    <Input id={ids.id} type="month" name="project.endedOn" max={thisMonth} disabled={ongoing} defaultValue={str('project.endedOn')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />
                  )}
                </Field>
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink-soft sm:col-span-2">
                  <input type="checkbox" name="project.ongoing" checked={ongoing} onChange={(e) => setOngoing(e.target.checked)} className="size-4 accent-[var(--brand)]" />
                  We are still working together
                </label>
              </div>
            )}

            {index === 2 && (
              <div className="mt-8 grid gap-6 rounded-2xl bg-paper p-5 sm:p-6">
                <p className="text-sm text-ink-soft">1 is poor, 5 is excellent.</p>
                {SCORES.map((score) => (
                  <StarInput key={score.name} name={score.name} label={score.label} defaultValue={Number(saved[score.name]) || undefined} error={error(score.name)} />
                ))}
              </div>
            )}

            {index >= 3 && index <= 6 && (() => {
              const item = STORY[index - 3]!;
              const count = lengths[item.name] ?? 0;
              return (
                <div className="mt-3">
                  <p className="text-ink-soft">{item.hint}</p>
                  <div className="mt-6">
                    <Field label={item.title} name={item.name} error={error(item.name)}>
                      {(ids) => (
                        <Textarea id={ids.id} name={item.name} rows={7} maxLength={4000} placeholder={item.placeholder} defaultValue={str(item.name)} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />
                      )}
                    </Field>
                    <p className={`mt-2 text-right text-xs ${count >= MIN_STORY ? 'text-success' : 'text-ink-faint'}`} aria-live="polite">
                      {count >= MIN_STORY ? (
                        <span className="inline-flex items-center gap-1">
                          <Check className="size-3.5" aria-hidden="true" />
                          Looks good
                        </span>
                      ) : (
                        `${MIN_STORY - count} more characters`
                      )}
                    </p>
                  </div>
                </div>
              );
            })()}

            {index === 7 && (
              <div className="mt-3">
                <p className="text-ink-soft">
                  We use your account email (<span className="font-medium text-ink">{account.email}</span>) only to confirm the review is genuine. It is never shown.
                </p>
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" name="reviewer.name" error={error('reviewer.name')}>
                    {(ids) => <Input id={ids.id} name="reviewer.name" autoComplete="name" defaultValue={str('reviewer.name') || account.name} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
                  </Field>
                  <Field label="Job title" name="reviewer.jobTitle" error={error('reviewer.jobTitle')}>
                    {(ids) => <Input id={ids.id} name="reviewer.jobTitle" autoComplete="organization-title" defaultValue={str('reviewer.jobTitle')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
                  </Field>
                  <Field label="Your company" name="reviewer.companyName" error={error('reviewer.companyName')}>
                    {(ids) => <Input id={ids.id} name="reviewer.companyName" autoComplete="organization" defaultValue={str('reviewer.companyName')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
                  </Field>
                  <Field label="Company size" name="reviewer.companySize" error={error('reviewer.companySize')}>
                    {(ids) => (
                      <Select id={ids.id} name="reviewer.companySize" defaultValue={str('reviewer.companySize')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy}>
                        <option value="" disabled>
                          Choose a size
                        </option>
                        {TEAM_SIZES.map((size) => (
                          <option key={size.value} value={size.value}>
                            {size.label}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>
                  <Field label="Industry" name="reviewer.industry" optional error={error('reviewer.industry')}>
                    {(ids) => (
                      <Select id={ids.id} name="reviewer.industry" defaultValue={str('reviewer.industry')} aria-describedby={ids.describedBy}>
                        <option value="">Choose an industry</option>
                        {INDUSTRIES.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>
                  <Field label="Location" name="reviewer.location" optional error={error('reviewer.location')}>
                    {(ids) => <Input id={ids.id} name="reviewer.location" placeholder="City, country" defaultValue={str('reviewer.location')} aria-describedby={ids.describedBy} />}
                  </Field>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-paper px-4 py-3 text-sm text-ink-soft sm:col-span-2">
                    <input type="checkbox" name="reviewer.anonymous" defaultChecked={saved['reviewer.anonymous'] === true} className="mt-0.5 size-4 accent-[var(--brand)]" />
                    Hide my name and company. Only my job title and industry are shown.
                  </label>
                </div>
              </div>
            )}

            {index === LAST && (
              <div className="mt-6 space-y-6">
                <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase">Project</p>
                      <p className="mt-1 font-medium text-ink">{String(summary['project.title'] ?? '')}</p>
                      <p className="text-sm text-ink-soft">
                        {BUDGETS.find((b) => b.value === summary['project.budget'])?.label}
                        {summary['project.startedOn'] ? ` · ${String(summary['project.startedOn'])} to ${summary['project.ongoing'] ? 'now' : String(summary['project.endedOn'] ?? '')}` : ''}
                      </p>
                    </div>
                    {average > 0 && (
                      <div className="text-right">
                        <p className="text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase">Your rating</p>
                        <p className="mt-1 inline-flex items-center gap-1.5 font-display text-2xl font-semibold text-ink">
                          <Star className="size-5 fill-saffron text-saffron" aria-hidden="true" />
                          {average.toFixed(1)}
                        </p>
                      </div>
                    )}
                  </div>
                  <dl className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
                    {STORY.map((item, storyIndex) => (
                      <div key={item.name}>
                        <dt className="flex items-center justify-between text-sm font-medium text-ink">
                          {item.title}
                          <button type="button" onClick={() => go(3 + storyIndex)} className="cursor-pointer text-xs font-medium text-accent hover:underline">
                            Edit
                          </button>
                        </dt>
                        <dd className="mt-1 line-clamp-3 text-sm text-ink-soft">{String(summary[item.name] ?? '')}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <label className="flex cursor-pointer items-start gap-3 text-[15px] text-ink">
                  <input type="checkbox" name="consent" defaultChecked={false} className="mt-1 size-4 accent-[var(--brand)]" />
                  <span>
                    I worked with {company.name} on this project, and this review is my honest opinion. I have no business ties to them beyond this project.
                  </span>
                </label>
                {error('consent') && (
                  <p role="alert" className="text-[13px] font-medium text-danger">
                    {error('consent')}
                  </p>
                )}
              </div>
            )}
          </section>
        ))}

        <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={() => go(step - 1)}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back
            </Button>
          ) : (
            <span />
          )}
          {step < LAST ? (
            <Button type="button" size="lg" onClick={() => go(step + 1)}>
              Continue
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          ) : (
            <SubmitButton pendingLabel="Submitting…">Submit review</SubmitButton>
          )}
        </div>
      </form>

      {confirmExit && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-night/50 p-4 backdrop-blur-sm sm:items-center" role="presentation" onClick={() => !exiting && setConfirmExit(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-exit-title"
            className="w-full max-w-md animate-rise rounded-[var(--radius-card)] bg-surface p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.key === 'Escape' && !exiting && setConfirmExit(false)}
          >
            <h2 id="save-exit-title" className="font-display text-2xl font-semibold text-ink">
              Save your review and exit?
            </h2>
            <p className="mt-2 text-ink-soft">
              We will keep your answers for 60 days. Come back to this page any time to finish your review of {company.name}.
            </p>
            {exitFailed && (
              <p role="alert" className="mt-4 text-sm font-medium text-danger">
                We could not save just now. Please try again.
              </p>
            )}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" autoFocus onClick={() => setConfirmExit(false)} disabled={exiting}>
                Keep writing
              </Button>
              <Button type="button" onClick={saveAndExit} disabled={exiting}>
                {exiting ? 'Saving…' : 'Save & exit'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
