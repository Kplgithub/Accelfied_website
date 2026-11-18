'use client';

import { useActionState } from 'react';
import { addPortfolioItem } from '@/app/dashboard-actions';
import { initialFormState } from '@/lib/form-state';
import { Field, Input, Select, Textarea } from '../ui/field';
import { ImageUpload } from '../forms/image-upload';
import { FormAlert, FormSaved, SubmitButton } from '../forms/form-bits';
import { formFields } from '../forms/use-form-fields';

export function PortfolioForm({ services }: { services: Array<{ slug: string; name: string }> }) {
  const [state, action] = useActionState(addPortfolioItem, initialFormState);
  const { value, error } = formFields(state);
  return (
    <form key={state.nonce} action={action} className="grid gap-5 sm:grid-cols-2" noValidate>
      <div className="space-y-3 sm:col-span-2">
        <FormAlert state={state} />
        <FormSaved state={state} />
      </div>
      <Field label="Project name" name="title" error={error('title')}>
        {(ids) => <Input id={ids.id} name="title" defaultValue={value('title')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <Field label="Service" name="serviceSlug" optional error={error('serviceSlug')}>
        {(ids) => (
          <Select id={ids.id} name="serviceSlug" defaultValue={value('serviceSlug')} aria-describedby={ids.describedBy}>
            <option value="">Not specific</option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.name}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <div className="sm:col-span-2">
        <Field label="What you did" name="description" optional error={error('description')}>
          {(ids) => <Textarea id={ids.id} name="description" rows={3} maxLength={1000} defaultValue={value('description')} aria-describedby={ids.describedBy} />}
        </Field>
      </div>
      <ImageUpload name="imageUrl" label="Project image" kind="portfolio" shape="wide" optional hint="A screenshot or photo, JPG, PNG or WebP." defaultValue={value('imageUrl')} error={error('imageUrl')} />
      <Field label="Live link" name="url" optional hint="Starting with https://" error={error('url')}>
        {(ids) => <Input id={ids.id} type="url" name="url" defaultValue={value('url')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <div className="sm:col-span-2">
        <SubmitButton pendingLabel="Adding…">Add project</SubmitButton>
      </div>
    </form>
  );
}
