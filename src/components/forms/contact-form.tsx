'use client';

import { useActionState } from 'react';
import { sendContactMessage } from '@/app/actions';
import { initialFormState } from '@/lib/form-state';
import { Field, Input, Select, Textarea } from '../ui/field';
import { FormAlert, Honeypot, SubmitButton, SuccessPanel } from './form-bits';
import { formFields } from './use-form-fields';

export const CONTACT_TOPICS = [
  { value: 'general', label: 'A general question' },
  { value: 'reviews', label: 'A review' },
  { value: 'listing', label: 'My company listing' },
  { value: 'verified', label: 'Accelfied Verified' },
  { value: 'billing', label: 'Billing or a refund' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'press', label: 'Press' },
  { value: 'other', label: 'Something else' },
] as const;

export function ContactForm({ defaultTopic = 'general' }: { defaultTopic?: string }) {
  const [state, action] = useActionState(sendContactMessage, initialFormState);
  const { value, error } = formFields(state);
  if (state.status === 'success') return <SuccessPanel title="Message sent" message={state.message} />;
  return (
    <form key={state.nonce} action={action} className="relative grid gap-5 sm:grid-cols-2" noValidate>
      <Honeypot />
      <div className="sm:col-span-2">
        <FormAlert state={state} />
      </div>
      <Field label="Your name" name="name" error={error('name')}>
        {(ids) => <Input id={ids.id} name="name" autoComplete="name" maxLength={120} defaultValue={value('name')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <Field label="Email" name="email" error={error('email')}>
        {(ids) => <Input id={ids.id} type="email" name="email" autoComplete="email" maxLength={200} defaultValue={value('email')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <Field label="Phone" name="phone" optional error={error('phone')}>
        {(ids) => <Input id={ids.id} type="tel" name="phone" autoComplete="tel" maxLength={30} defaultValue={value('phone')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <Field label="Company" name="company" optional error={error('company')}>
        {(ids) => <Input id={ids.id} name="company" autoComplete="organization" maxLength={120} defaultValue={value('company')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <div className="sm:col-span-2">
        <Field label="What is it about?" name="topic" error={error('topic')}>
          {(ids) => (
            <Select id={ids.id} name="topic" defaultValue={value('topic') || defaultTopic} aria-invalid={ids.invalid} aria-describedby={ids.describedBy}>
              {CONTACT_TOPICS.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Message" name="message" error={error('message')}>
          {(ids) => <Textarea id={ids.id} name="message" rows={6} maxLength={5000} defaultValue={value('message')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
      </div>
      <div className="sm:col-span-2">
        <SubmitButton>Send message</SubmitButton>
      </div>
    </form>
  );
}
