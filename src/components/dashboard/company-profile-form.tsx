'use client';

import { useActionState } from 'react';
import { updateCompanyProfile } from '@/app/dashboard-actions';
import { initialFormState } from '@/lib/form-state';
import type { Socials } from '@/lib/types';
import { ImageUpload } from '../forms/image-upload';
import { Field, Input, Textarea } from '../ui/field';
import { FormAlert, FormSaved, FormSection, SubmitButton } from '../forms/form-bits';
import { formFields } from '../forms/use-form-fields';

interface Props {
  company: {
    tagline: string;
    description: string;
    logoUrl: string;
    contact: { email: string; phone: string };
    clients: string[];
    socials: Socials;
  };
}

const SOCIALS: Array<{ key: keyof Socials; label: string; placeholder: string }> = [
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://www.linkedin.com/company/…' },
  { key: 'x', label: 'X (Twitter)', placeholder: 'https://x.com/…' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://www.facebook.com/…' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/…' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://www.youtube.com/@…' },
];

export function CompanyProfileForm({ company }: Props) {
  const [state, action] = useActionState(updateCompanyProfile, initialFormState);
  const { value, error } = formFields(state);
  const pick = (name: string, fallback: string) => (state.status === 'error' ? value(name) : fallback);

  return (
    <form key={state.nonce} action={action} className="space-y-8" noValidate>
      <FormAlert state={state} />
      <FormSaved state={state} />
      <FormSection title="Public profile" description="What clients see on your profile and in search results.">
        <div className="sm:col-span-2">
          <Field label="Tagline" name="tagline" hint="One line, up to 160 characters." error={error('tagline')}>
            {(ids) => <Input id={ids.id} name="tagline" maxLength={160} defaultValue={pick('tagline', company.tagline)} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="About your company" name="description" hint="At least 80 characters." error={error('description')}>
            {(ids) => <Textarea id={ids.id} name="description" rows={7} defaultValue={pick('description', company.description)} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
          </Field>
        </div>
        <div className="sm:col-span-2">
          <ImageUpload name="logoUrl" label="Logo" kind="logo" optional hint="A square JPG, PNG or WebP, at least 200 pixels wide." defaultValue={pick('logoUrl', company.logoUrl)} error={error('logoUrl')} />
        </div>
        <div className="sm:col-span-2">
          <Field label="Notable clients" name="clients" optional hint="One per line. Only list clients who agreed to be named." error={error('clients')}>
            {(ids) => <Textarea id={ids.id} name="clients" rows={4} defaultValue={pick('clients', company.clients.join('\n'))} aria-describedby={ids.describedBy} />}
          </Field>
        </div>
      </FormSection>
      <FormSection title="Social links" description="Shown as icons on your public profile. Leave empty to hide.">
        {SOCIALS.map((social) => (
          <Field key={social.key} label={social.label} name={`socials.${social.key}`} optional error={error(`socials.${social.key}`)}>
            {(ids) => (
              <Input
                id={ids.id}
                type="url"
                name={`socials.${social.key}`}
                placeholder={social.placeholder}
                defaultValue={pick(`socials.${social.key}`, company.socials[social.key])}
                aria-invalid={ids.invalid}
                aria-describedby={ids.describedBy}
              />
            )}
          </Field>
        ))}
      </FormSection>
      <FormSection title="Contact" description="Where project requests reach you. Never shown publicly.">
        <Field label="Enquiries email" name="contactEmail" error={error('contactEmail')}>
          {(ids) => <Input id={ids.id} type="email" name="contactEmail" defaultValue={pick('contactEmail', company.contact.email)} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
        <Field label="Phone" name="contactPhone" optional error={error('contactPhone')}>
          {(ids) => <Input id={ids.id} type="tel" name="contactPhone" defaultValue={pick('contactPhone', company.contact.phone)} aria-describedby={ids.describedBy} />}
        </Field>
      </FormSection>
      <div className="flex justify-end border-t border-line pt-6">
        <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
      </div>
    </form>
  );
}
