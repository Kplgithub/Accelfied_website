'use client';

import { SendHorizontal } from 'lucide-react';
import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { sendMessage } from '@/app/message-actions';
import { initialFormState } from '@/lib/form-state';

/** The box under a conversation. Enter adds a line; Ctrl or Cmd + Enter sends. */
export function ReplyForm({ conversationId, placeholder }: { conversationId: string; placeholder: string }) {
  const [state, action] = useActionState(sendMessage, initialFormState);
  const form = useRef<HTMLFormElement>(null);
  const box = useRef<HTMLTextAreaElement>(null);
  const failed = state.status === 'error';

  useEffect(() => {
    if (state.status === 'success') {
      form.current?.reset();
      box.current?.focus();
    }
  }, [state]);

  return (
    <form ref={form} action={action} className="flex flex-col gap-2" noValidate>
      <input type="hidden" name="conversationId" value={conversationId} />
      <div className="flex items-end gap-2 rounded-2xl border border-line-strong bg-surface p-2 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/12">
        <label htmlFor="reply-body" className="sr-only">
          Your message
        </label>
        <textarea
          ref={box}
          id="reply-body"
          name="body"
          rows={2}
          maxLength={5000}
          required
          placeholder={placeholder}
          defaultValue={failed ? (state.values?.body ?? '') : ''}
          key={failed ? state.nonce : 'reply'}
          aria-invalid={failed || undefined}
          aria-describedby={failed ? 'reply-error' : 'reply-hint'}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              form.current?.requestSubmit();
            }
          }}
          className="max-h-60 min-h-12 flex-1 resize-y bg-transparent px-2 py-2 text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-faint"
        />
        <SendButton />
      </div>
      {failed ? (
        <p id="reply-error" role="alert" className="text-[13px] font-medium text-danger">
          {state.errors?.body ?? state.message}
        </p>
      ) : (
        <p id="reply-hint" className="hidden text-[13px] text-ink-faint sm:block">
          Press Ctrl + Enter to send.
        </p>
      )}
    </form>
  );
}

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-brand px-4 text-[15px] font-medium text-white transition-colors hover:bg-brand-strong disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> : <SendHorizontal className="size-4" aria-hidden="true" />}
      <span>{pending ? 'Sending' : 'Send'}</span>
    </button>
  );
}
