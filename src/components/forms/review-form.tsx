'use client';

import { useActionState, useState } from 'react';
import { submitReview } from '@/app/actions';
import { initialFormState } from '@/lib/form-state';
import { BUDGETS, INDUSTRIES, TEAM_SIZES } from '@/lib/labels';
import type { ServiceGroup } from '@/lib/types';
import { ButtonLink } from '../ui/button';
import { Field, Input, Select, Textarea } from '../ui/field';
import { FormAlert, FormSection, Honeypot, SubmitButton, SuccessPanel } from './form-bits';
import { StarInput } from './star-input';
import { formFields } from './use-form-fields';

interface Props {
  company: { slug: string; name: string; services: Array<{ slug: string; name: string }> };
  groups: ServiceGroup[];
  account: { name: string; email: string };
}

const STORY = [
  { name: 'content.background', label: 'Background', hint: 'Who are you, and what did you hire them for?' },
  { name: 'content.challenge', label: 'The challenge', hint: 'What problem were you trying to solve?' },
  { name: 'content.solution', label: 'The solution', hint: 'What did the team do, and how did they work with you?' },
  { name: 'content.results', label: 'Results', hint: 'What changed? Share outcomes, numbers or feedback if you can.' },
];

const SCORES = [
  { name: 'ratings.overall', label: 'Overall' },
  { name: 'ratings.quality', label: 'Quality of work' },
  { name: 'ratings.schedule', label: 'Kept to schedule' },
  { name: 'ratings.cost', label: 'Value for money' },
  { name: 'ratings.willingToRefer', label: 'Likely to refer them' },
];

export function ReviewForm({ company, groups, account }: Props) {
  const [state, action] = useActionState(submitReview, initialFormState);
  const { value, error, checked } = formFields(state);
  const [ongoing, setOngoing] = useState(checked('project.ongoing'));
  const thisMonth = new Date().toISOString().slice(0, 7);

  if (state.status === 'success') {
    return (
      <SuccessPanel title="Review received" message={state.message}>
        <ButtonLink href={`/profile/${company.slug}`} variant="secondary">
          Back to {company.name}
        </ButtonLink>
      </SuccessPanel>
    );
  }

  const otherServices = groups.flatMap((g) => g.services).filter((s) => !company.services.some((c) => c.slug === s.slug));

  return (
    <form key={state.nonce} action={action} className="relative space-y-8" noValidate>
      <Honeypot />
      <input type="hidden" name="companySlug" value={company.slug} />
      <FormAlert state={state} />

      <FormSection title="The project" description="Context helps other clients judge if the company fits them.">
        <div className="sm:col-span-2">
          <Field label="Project name" name="project.title" hint="e.g. Loyalty app for our retail stores" error={error('project.title')}>
            {(ids) => <Input id={ids.id} name="project.title" defaultValue={value('project.title')} required aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
          </Field>
        </div>
        <Field label="Service provided" name="project.serviceSlug" error={error('project.serviceSlug')}>
          {(ids) => (
            <Select id={ids.id} name="project.serviceSlug" defaultValue={value('project.serviceSlug') || company.services[0]?.slug || ''} aria-invalid={ids.invalid} aria-describedby={ids.describedBy}>
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
        <Field label="Project budget" name="project.budget" error={error('project.budget')}>
          {(ids) => (
            <Select id={ids.id} name="project.budget" defaultValue={value('project.budget')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy}>
              <option value="" disabled>
                Choose a range
              </option>
              {BUDGETS.map((budget) => (
                <option key={budget.value} value={budget.value}>
                  {budget.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Started" name="project.startedOn" error={error('project.startedOn')}>
          {(ids) => <Input id={ids.id} type="month" name="project.startedOn" max={thisMonth} defaultValue={value('project.startedOn')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
        <div className="flex flex-col gap-2">
          <Field label="Ended" name="project.endedOn" error={error('project.endedOn')}>
            {(ids) => (
              <Input id={ids.id} type="month" name="project.endedOn" max={thisMonth} disabled={ongoing} defaultValue={value('project.endedOn')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />
            )}
          </Field>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" name="project.ongoing" checked={ongoing} onChange={(e) => setOngoing(e.target.checked)} className="size-4 accent-[var(--brand)]" />
            Still working together
          </label>
        </div>
      </FormSection>

      <FormSection title="Your ratings" description="1 is poor, 5 is excellent.">
        {SCORES.map((score) => (
          <StarInput
            key={score.name}
            name={score.name}
            label={score.label}
            defaultValue={Number(value(score.name)) || undefined}
            error={error(score.name) ? 'Please choose a rating.' : undefined}
          />
        ))}
      </FormSection>

      <FormSection title="Your story" description="Specific details make a review useful. At least 40 characters each.">
        {STORY.map((item) => (
          <div key={item.name} className="sm:col-span-2">
            <Field label={item.label} name={item.name} hint={item.hint} error={error(item.name)}>
              {(ids) => <Textarea id={ids.id} name={item.name} rows={4} defaultValue={value(item.name)} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
            </Field>
          </div>
        ))}
      </FormSection>

      <FormSection title="About you" description="We use your account email only to confirm the review is genuine. It is never shown.">
        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-paper px-4 py-3 text-sm">
          <span className="text-ink-soft">
            Signed in as <span className="font-medium text-ink">{account.email}</span>
          </span>
        </div>
        <Field label="Full name" name="reviewer.name" error={error('reviewer.name')}>
          {(ids) => <Input id={ids.id} name="reviewer.name" autoComplete="name" defaultValue={value('reviewer.name') || account.name} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
        <Field label="Job title" name="reviewer.jobTitle" error={error('reviewer.jobTitle')}>
          {(ids) => <Input id={ids.id} name="reviewer.jobTitle" autoComplete="organization-title" defaultValue={value('reviewer.jobTitle')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
        <Field label="Your company" name="reviewer.companyName" error={error('reviewer.companyName')}>
          {(ids) => <Input id={ids.id} name="reviewer.companyName" autoComplete="organization" defaultValue={value('reviewer.companyName')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
        <Field label="Company size" name="reviewer.companySize" error={error('reviewer.companySize')}>
          {(ids) => (
            <Select id={ids.id} name="reviewer.companySize" defaultValue={value('reviewer.companySize')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy}>
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
            <Select id={ids.id} name="reviewer.industry" defaultValue={value('reviewer.industry')} aria-describedby={ids.describedBy}>
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
          {(ids) => <Input id={ids.id} name="reviewer.location" placeholder="City, country" defaultValue={value('reviewer.location')} aria-describedby={ids.describedBy} />}
        </Field>
        <label className="flex cursor-pointer items-start gap-3 self-end rounded-xl bg-paper px-4 py-3 text-sm text-ink-soft">
          <input type="checkbox" name="reviewer.anonymous" defaultChecked={checked('reviewer.anonymous')} className="mt-0.5 size-4 accent-[var(--brand)]" />
          Hide my name and company. Only my job title and industry are shown.
        </label>
      </FormSection>

      <div className="space-y-5 border-t border-line pt-8">
        <label className="flex cursor-pointer items-start gap-3 text-[15px] text-ink">
          <input type="checkbox" name="consent" defaultChecked={checked('consent')} className="mt-1 size-4 accent-[var(--brand)]" />
          <span>
            I worked with {company.name} on this project, and this review is my honest opinion. I have no business ties to
            them beyond this project.
          </span>
        </label>
        {error('consent') && (
          <p role="alert" className="text-[13px] font-medium text-danger">
            Please confirm the review is truthful.
          </p>
        )}
        <SubmitButton>Submit review</SubmitButton>
      </div>
    </form>
  );
}
