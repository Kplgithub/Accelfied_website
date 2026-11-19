'use client';

import { useActionState } from 'react';
import { saveMyProfile } from '@/app/vendor-tools-actions';
import { FormAlert, FormSaved, FormSection, SubmitButton } from '@/components/forms/form-bits';
import { ImageUpload } from '@/components/forms/image-upload';
import { formFields } from '@/components/forms/use-form-fields';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { initialFormState } from '@/lib/form-state';
import { INDUSTRIES } from '@/lib/labels';
import type { PersonProfile } from '@/lib/vendor-tools';

type Key = keyof PersonProfile;

export function MyProfileForm({ profile }: { profile: PersonProfile }) {
  const [state, action] = useActionState(saveMyProfile, initialFormState);
  const { value, error } = formFields(state);
  // After a failed save keep what was typed; otherwise show what is stored.
  const v = (key: Key) => (state.status === 'error' ? value(key) : profile[key]);
  const text = (key: Key, label: string, options: { type?: string; placeholder?: string; hint?: string; autoComplete?: string; max?: number } = {}) => (
    <Field label={label} name={key} optional hint={options.hint} error={error(key)}>
      {(ids) => (
        <Input
          id={ids.id}
          name={key}
          type={options.type ?? 'text'}
          maxLength={options.max ?? 120}
          placeholder={options.placeholder}
          autoComplete={options.autoComplete}
          defaultValue={v(key)}
          aria-invalid={ids.invalid}
          aria-describedby={ids.describedBy}
        />
      )}
    </Field>
  );
  return (
    <form key={state.nonce} action={action} className="space-y-10" noValidate>
      <div className="space-y-3 empty:hidden">
        <FormAlert state={state} />
        <FormSaved state={state} />
      </div>
      <FormSection title="Picture and work" description="Shown in your account menu and to companies you message.">
        <div className="grid gap-5 sm:col-span-2 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <ImageUpload name="avatarUrl" label="Profile picture" kind="team" optional hint="A clear face photo. It is cropped to a square." defaultValue={v('avatarUrl')} error={error('avatarUrl')} />
          </div>
          {text('jobTitle', 'Job title', { placeholder: 'Founder, Product Manager…', autoComplete: 'organization-title', max: 100 })}
          {text('companyName', 'Company', { autoComplete: 'organization' })}
          <Field label="Industry" name="industry" optional error={error('industry')}>
            {(ids) => (
              <Select id={ids.id} name="industry" defaultValue={v('industry')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy}>
                <option value="">Choose an industry</option>
                {INDUSTRIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          {text('location', 'Location', { placeholder: 'Jaipur, Rajasthan', autoComplete: 'address-level2' })}
        </div>
      </FormSection>
      <FormSection title="Contact" description="Where companies can reach you. Your sign-in email does not change.">
        <div className="grid gap-5 sm:col-span-2 sm:grid-cols-2">
          {text('contactEmail', 'Contact email', { type: 'email', autoComplete: 'email', max: 200 })}
          {text('phone', 'Phone', { type: 'tel', autoComplete: 'tel', placeholder: '+91 98765 43210', max: 30 })}
          {text('linkedinUrl', 'LinkedIn profile', { type: 'url', placeholder: 'https://www.linkedin.com/in/…', max: 300 })}
          {text('xUrl', 'X profile', { type: 'url', placeholder: 'https://x.com/…', max: 300 })}
        </div>
      </FormSection>
      <FormSection title="About you">
        <div className="grid gap-5 sm:col-span-2">
          {text('headline', 'Headline', { placeholder: 'Building payments for small shops', hint: 'One line about what you do.' })}
          <Field label="Bio" name="bio" optional error={error('bio')}>
            {(ids) => <Textarea id={ids.id} name="bio" maxLength={1500} defaultValue={v('bio')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
          </Field>
        </div>
      </FormSection>
      <div className="sticky bottom-0 -mx-5 flex items-center gap-3 border-t border-line bg-surface/95 px-5 py-4 backdrop-blur sm:-mx-7 sm:px-7">
        <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
      </div>
    </form>
  );
}
