'use client';

import { useActionState } from 'react';
import { startConversation } from '@/app/message-actions';
import { initialFormState } from '@/lib/form-state';
import { FormAlert, SubmitButton } from '../forms/form-bits';
import { Field, Textarea } from '../ui/field';

export function NewMessageForm({ companySlug, companyName }: { companySlug: string; companyName: string }) {
  const [state, action] = useActionState(startConversation, initialFormState);
  return (
    <form key={state.nonce} action={action} className="flex flex-col gap-5" noValidate>
      <FormAlert state={state} />
      <input type="hidden" name="companySlug" value={companySlug} />
      <Field
        label={`Your message to ${companyName}`}
        name="body"
        hint="Ask about their work, availability or rates. They reply here and we email you."
        error={state.errors?.body}
      >
        {(ids) => (
          <Textarea
            id={ids.id}
            name="body"
            rows={6}
            maxLength={5000}
            required
            defaultValue={state.values?.body ?? ''}
            placeholder="Hi, we are planning a project and would like to know…"
            aria-invalid={ids.invalid}
            aria-describedby={ids.describedBy}
          />
        )}
      </Field>
      <div>
        <SubmitButton pendingLabel="Sending…">Send message</SubmitButton>
      </div>
    </form>
  );
}
