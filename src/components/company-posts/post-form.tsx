'use client';

import { useActionState, useState } from 'react';
import { countWords, MIN_WORDS, type CompanyPostFull } from '@/lib/company-posts';
import { initialFormState, type FormState } from '@/lib/form-state';
import { FormAlert, FormSaved, SubmitButton } from '../forms/form-bits';
import { ImageUpload } from '../forms/image-upload';
import { formFields } from '../forms/use-form-fields';
import { Field, Input, Textarea } from '../ui/field';

/** Writes a new post or edits a draft. After an error the form keeps what was typed. */
export function CompanyPostForm({ post, save }: { post?: CompanyPostFull; save: (prev: FormState, form: FormData) => Promise<FormState> }) {
  const [state, action] = useActionState(save, initialFormState);
  const { value, error } = formFields(state);
  const pick = (name: string, saved: string) => (state.values ? value(name) : saved);
  const [words, setWords] = useState(() => countWords(pick('body', post?.body ?? '')));

  return (
    <form key={state.nonce} action={action} className="grid gap-6" noValidate>
      <div className="space-y-3 empty:hidden">
        <FormAlert state={state} />
        <FormSaved state={state} />
      </div>
      <Field label="Title" name="title" hint="Say what the reader learns, such as “How we cut app launch time in half”." error={error('title')}>
        {(ids) => <Input id={ids.id} name="title" maxLength={120} defaultValue={pick('title', post?.title ?? '')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
      </Field>
      <Field label="Short summary" name="excerpt" optional hint="One or two sentences shown under the title and in search results." error={error('excerpt')}>
        {(ids) => <Textarea id={ids.id} name="excerpt" rows={2} maxLength={300} className="min-h-0" defaultValue={pick('excerpt', post?.excerpt ?? '')} aria-describedby={ids.describedBy} />}
      </Field>
      <ImageUpload
        name="coverUrl"
        label="Cover picture"
        kind="portfolio"
        shape="wide"
        optional
        hint="A wide picture works best, JPG, PNG or WebP under 5 MB."
        defaultValue={pick('coverUrl', post?.coverUrl ?? '')}
        error={error('coverUrl')}
      />
      <Field
        label="Your post"
        name="body"
        hint="Use ## for a heading, **bold**, - for a list and [text](https://link) for a link. Leave an empty line between paragraphs."
        error={error('body')}
      >
        {(ids) => (
          <>
            <Textarea
              id={ids.id}
              name="body"
              rows={18}
              maxLength={60_000}
              defaultValue={pick('body', post?.body ?? '')}
              onChange={(event) => setWords(countWords(event.target.value))}
              aria-invalid={ids.invalid}
              aria-describedby={ids.describedBy}
              className="font-mono text-[14px]"
            />
            <p className={`text-right text-[13px] tabular-nums ${words < MIN_WORDS ? 'text-ink-faint' : 'text-accent'}`} aria-live="polite">
              {words} words{words < MIN_WORDS ? `, at least ${MIN_WORDS} needed` : ''}
            </p>
          </>
        )}
      </Field>
      <Field label="Tags" name="tags" optional hint="Up to 5, separated by commas, such as web development, Jaipur." error={error('tags')}>
        {(ids) => <Input id={ids.id} name="tags" defaultValue={pick('tags', post?.tags.join(', ') ?? '')} aria-describedby={ids.describedBy} />}
      </Field>
      <div>
        <SubmitButton pendingLabel="Saving…">{post ? 'Save changes' : 'Save draft'}</SubmitButton>
      </div>
    </form>
  );
}
