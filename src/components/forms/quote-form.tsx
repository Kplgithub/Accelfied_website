'use client';

import { useActionState } from 'react';
import { requestQuote } from '@/app/actions';
import { initialFormState } from '@/lib/form-state';
import { BUDGETS, TIMELINES } from '@/lib/labels';
import type { ServiceGroup } from '@/lib/types';
import { ButtonLink } from '../ui/button';
import { Field, Input, Select, Textarea } from '../ui/field';
import { FormAlert, FormSection, Honeypot, SubmitButton, SuccessPanel } from './form-bits';
import { formFields } from './use-form-fields';

interface Props {
  groups: ServiceGroup[];
  company?: { slug: string; name: string; services: Array<{ slug: string }> };
  account: { name: string; email: string };
  /** Answers carried over from the step-by-step brief. */
  initial?: Partial<Record<'serviceSlug' | 'budget' | 'timeline' | 'preferredLocation' | 'description', string>>;
}

export function QuoteForm({ groups, company, account, initial = {} }: Props) {
  const [state, action] = useActionState(requestQuote, initialFormState);
  const fields = formFields(state);
  const { error } = fields;
  // After a failed submit the echoed values win; before that, the carried-over brief.
  const value = (name: string) => fields.value(name) || (state.status === 'idle' ? (initial[name as keyof typeof initial] ?? '') : '');

  if (state.status === 'success') {
    return (
      <SuccessPanel title="Brief sent" message={state.message}>
        <ButtonLink href="/dashboard/requests">Track it in your dashboard</ButtonLink>
        <ButtonLink href={company ? `/profile/${company.slug}` : '/agencies'} variant="secondary">
          {company ? `Back to ${company.name}` : 'Keep browsing'}
        </ButtonLink>
      </SuccessPanel>
    );
  }

  const defaultService = value('serviceSlug') || company?.services[0]?.slug || '';

  return (
    <form key={state.nonce} action={action} className="relative space-y-8" noValidate>
      <Honeypot />
      {company && <input type="hidden" name="companySlug" value={company.slug} />}
      <FormAlert state={state} />

      <FormSection title="Your project" description="A clear brief gets faster, more accurate quotes.">
        <Field label="Service needed" name="serviceSlug" error={error('serviceSlug')}>
          {(ids) => (
            <Select id={ids.id} name="serviceSlug" defaultValue={defaultService} required aria-invalid={ids.invalid} aria-describedby={ids.describedBy}>
              <option value="" disabled>
                Choose a service
              </option>
              {groups.map((group) => (
                <optgroup key={group.slug} label={group.name}>
                  {group.services.map((service) => (
                    <option key={service.slug} value={service.slug}>
                      {service.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Budget" name="budget" error={error('budget')}>
          {(ids) => (
            <Select id={ids.id} name="budget" defaultValue={value('budget')} required aria-invalid={ids.invalid} aria-describedby={ids.describedBy}>
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
        <Field label="When do you want to start?" name="timeline" error={error('timeline')}>
          {(ids) => (
            <Select id={ids.id} name="timeline" defaultValue={value('timeline')} required aria-invalid={ids.invalid} aria-describedby={ids.describedBy}>
              <option value="" disabled>
                Choose a timeline
              </option>
              {TIMELINES.map((timeline) => (
                <option key={timeline.value} value={timeline.value}>
                  {timeline.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Preferred partner location" name="preferredLocation" optional error={error('preferredLocation')}>
          {(ids) => <Input id={ids.id} name="preferredLocation" defaultValue={value('preferredLocation')} placeholder="e.g. India or anywhere" aria-describedby={ids.describedBy} />}
        </Field>
        <div className="sm:col-span-2">
          <Field
            label="Describe your project"
            name="description"
            hint="What are you building, who is it for, and what does success look like? At least 30 characters."
            error={error('description')}
          >
            {(ids) => (
              <Textarea id={ids.id} name="description" defaultValue={value('description')} required minLength={30} rows={6} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />
            )}
          </Field>
        </div>
      </FormSection>

      <FormSection title="Your details" description="Shared only with the companies you contact. Replies come to your account email.">
        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-paper px-4 py-3 text-sm">
          <span className="text-ink-soft">
            Signed in as <span className="font-medium text-ink">{account.email}</span>
          </span>
        </div>
        <Field label="Full name" name="contact.name" error={error('contact.name')}>
          {(ids) => <Input id={ids.id} name="contact.name" autoComplete="name" defaultValue={value('contact.name') || account.name} required aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
        <Field label="Phone" name="contact.phone" optional error={error('contact.phone')}>
          {(ids) => <Input id={ids.id} type="tel" name="contact.phone" autoComplete="tel" defaultValue={value('contact.phone')} aria-describedby={ids.describedBy} />}
        </Field>
        <Field label="Company" name="contact.companyName" optional error={error('contact.companyName')}>
          {(ids) => <Input id={ids.id} name="contact.companyName" autoComplete="organization" defaultValue={value('contact.companyName')} aria-describedby={ids.describedBy} />}
        </Field>
      </FormSection>

      <div className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft">By sending, you agree to be contacted about this project.</p>
        <SubmitButton>Send my brief</SubmitButton>
      </div>
    </form>
  );
}
