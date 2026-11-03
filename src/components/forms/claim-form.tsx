'use client';

import { useActionState } from 'react';
import { submitClaim } from '@/app/actions';
import { initialFormState } from '@/lib/form-state';
import { ButtonLink } from '../ui/button';
import { Field, Input, Textarea } from '../ui/field';
import { FormAlert, FormSection, SubmitButton, SuccessPanel } from './form-bits';
import { formFields } from './use-form-fields';

interface Props {
  company: { slug: string; name: string; domain: string };
  account: { name: string; email: string };
}

export function ClaimForm({ company, account }: Props) {
  const [state, action] = useActionState(submitClaim, initialFormState);
  const { value, error, checked } = formFields(state);

  if (state.status === 'success') {
    return (
      <SuccessPanel title="Verifying your claim" message={state.message} steps={['Request sent', 'Our team is verifying', 'Listing moves to you']}>
        <ButtonLink href="/dashboard">Go to your dashboard</ButtonLink>
        <ButtonLink href={`/profile/${company.slug}`} variant="secondary">
          Back to {company.name}
        </ButtonLink>
      </SuccessPanel>
    );
  }

  // A work email on the company's own domain is the strongest proof we can check.
  const suggested = account.email.endsWith(`@${company.domain}`) ? account.email : '';

  return (
    <form key={state.nonce} action={action} className="space-y-8" noValidate>
      <input type="hidden" name="companySlug" value={company.slug} />
      <FormAlert state={state} />
      <FormSection title="Prove you work there" description={`Use your email address at ${company.domain}. Free email addresses cannot be accepted.`}>
        <div className="sm:col-span-2">
          <Field label="Work email" name="workEmail" hint={`For example, you@${company.domain}`} error={error('workEmail')}>
            {(ids) => (
              <Input id={ids.id} type="email" name="workEmail" autoComplete="email" defaultValue={value('workEmail') || suggested} required aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />
            )}
          </Field>
        </div>
        <Field label="Your job title" name="jobTitle" error={error('jobTitle')}>
          {(ids) => <Input id={ids.id} name="jobTitle" autoComplete="organization-title" defaultValue={value('jobTitle')} required aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
        <Field label="Phone" name="phone" optional error={error('phone')}>
          {(ids) => <Input id={ids.id} type="tel" name="phone" autoComplete="tel" defaultValue={value('phone')} aria-describedby={ids.describedBy} />}
        </Field>
        <div className="sm:col-span-2">
          <Field label="Anything our team should know?" name="message" optional error={error('message')}>
            {(ids) => <Textarea id={ids.id} name="message" rows={4} maxLength={1000} defaultValue={value('message')} aria-describedby={ids.describedBy} />}
          </Field>
        </div>
      </FormSection>
      <div className="space-y-5 border-t border-line pt-8">
        <label className="flex cursor-pointer items-start gap-3 text-[15px] text-ink">
          <input type="checkbox" name="confirm" defaultChecked={checked('confirm')} className="mt-1 size-4 accent-accent" />
          <span>I work at {company.name} and I am allowed to manage its listing on Accelfied.</span>
        </label>
        {error('confirm') && (
          <p role="alert" className="text-[13px] font-medium text-danger">
            Please confirm you are allowed to manage this company.
          </p>
        )}
        <SubmitButton>Send claim request</SubmitButton>
      </div>
    </form>
  );
}
