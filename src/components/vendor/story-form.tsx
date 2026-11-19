'use client';

import { useActionState, useState } from 'react';
import { saveStory } from '@/app/vendor-tools-actions';
import { FormAlert, FormSaved, SubmitButton } from '@/components/forms/form-bits';
import { formFields } from '@/components/forms/use-form-fields';
import { Field, Textarea } from '@/components/ui/field';
import { initialFormState } from '@/lib/form-state';

const MAX = 2000;

/** "Our story": what makes the team unique, shown on the public profile. */
export function StoryForm({ story }: { story: string }) {
  const [state, action] = useActionState(saveStory, initialFormState);
  const { value, error } = formFields(state);
  const start = state.status === 'error' ? value('story') : story;
  const [length, setLength] = useState(start.length);
  return (
    <form key={state.nonce} action={action} className="grid gap-4" noValidate>
      <FormAlert state={state} />
      <FormSaved state={state} />
      <Field label="Our story" name="story" optional hint="Your vision, how you started, what you value and how you work with clients. Plain text; leave a blank line between paragraphs." error={error('story')}>
        {(ids) => (
          <Textarea
            id={ids.id}
            name="story"
            maxLength={MAX}
            rows={8}
            defaultValue={start}
            onChange={(event) => setLength(event.target.value.length)}
            placeholder="We started in Jaipur in 2016 with three engineers who wanted to build software the way clients actually use it…"
            aria-invalid={ids.invalid}
            aria-describedby={ids.describedBy}
          />
        )}
      </Field>
      <div className="flex items-center justify-between gap-4">
        <SubmitButton pendingLabel="Saving…">Save story</SubmitButton>
        <span className={`text-sm tabular-nums ${length > MAX - 100 ? 'text-saffron-ink' : 'text-ink-faint'}`}>
          {length}/{MAX}
        </span>
      </div>
    </form>
  );
}
