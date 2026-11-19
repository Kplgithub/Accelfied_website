'use client';

import { useActionState } from 'react';
import { addPortfolioFromProject } from '@/app/vendor-tools-actions';
import { FormAlert, SubmitButton } from '@/components/forms/form-bits';
import { ImageUpload } from '@/components/forms/image-upload';
import { formFields } from '@/components/forms/use-form-fields';
import { Field, Input, Textarea } from '@/components/ui/field';
import { initialFormState } from '@/lib/form-state';

/** Adds this reviewed project to the portfolio, titled and tagged from the review. */
export function ProjectPortfolioForm({ projectId, title }: { projectId: string; title: string }) {
  const [state, action] = useActionState(addPortfolioFromProject, initialFormState);
  const { value, error } = formFields(state);
  return (
    <form key={state.nonce} action={action} className="grid gap-5" noValidate>
      <input type="hidden" name="projectId" value={projectId} />
      <FormAlert state={state} />
      <p className="rounded-xl bg-paper px-4 py-3 text-sm text-ink-soft">
        Title: <span className="font-medium text-ink">{title}</span>
      </p>
      <Field label="What you built" name="description" optional hint="Two or three lines clients will read on your profile." error={error('description')}>
        {(ids) => (
          <Textarea id={ids.id} name="description" maxLength={1000} className="min-h-24" defaultValue={value('description')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />
        )}
      </Field>
      <Field label="Link to the live project" name="url" optional error={error('url')}>
        {(ids) => <Input id={ids.id} type="url" name="url" placeholder="https://" defaultValue={value('url')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <ImageUpload name="imageUrl" label="Screenshot" kind="portfolio" shape="wide" optional hint="A wide screenshot or photo of the work." defaultValue={value('imageUrl')} error={error('imageUrl')} />
      <div>
        <SubmitButton pendingLabel="Adding…">Add to portfolio</SubmitButton>
      </div>
    </form>
  );
}
