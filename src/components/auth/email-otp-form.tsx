'use client';

import { MailCheck } from 'lucide-react';
import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { sendEmailCode, verifyEmailCode } from '@/app/email-code-actions';
import { initialFormState, type FormState } from '@/lib/form-state';
import { FormAlert } from '../forms/form-bits';
import { Button } from '../ui/button';

const LENGTH = 6;
const RESEND_SECONDS = 60;

/**
 * Six boxes for the code from the signup email. Typing moves to the next box,
 * pasting the whole code fills them all, and the last digit sends the form.
 */
export function EmailOtpForm({ email, next, autoSend, testCode }: { email: string; next: string; autoSend: boolean; testCode: boolean }) {
  const [state, action] = useActionState(verifyEmailCode, initialFormState);
  const [digits, setDigits] = useState<string[]>(() => Array(LENGTH).fill(''));
  const [wait, setWait] = useState(autoSend ? 0 : RESEND_SECONDS);
  const [notice, setNotice] = useState<FormState | null>(null);
  const [sending, startSending] = useTransition();
  const boxes = useRef<Array<HTMLInputElement | null>>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const sentOnce = useRef(false);

  const resend = () =>
    startSending(async () => {
      const result = await sendEmailCode();
      setNotice(result);
      setWait(RESEND_SECONDS);
      setDigits(Array(LENGTH).fill(''));
      boxes.current[0]?.focus();
    });

  // People sent here from a later visit get a fresh code straight away.
  useEffect(() => {
    if (autoSend && !sentOnce.current) {
      sentOnce.current = true;
      resend();
    }
  }, [autoSend]);

  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  // A wrong code clears the boxes so the next try starts clean.
  const [answered, setAnswered] = useState(state);
  if (answered !== state) {
    setAnswered(state);
    if (state.status === 'error') setDigits(Array(LENGTH).fill(''));
  }
  useEffect(() => {
    if (state.status === 'error') boxes.current[0]?.focus();
  }, [state]);

  const fill = (start: number, value: string) => {
    const clean = value.replace(/\D/g, '');
    if (!clean) return;
    const nextDigits = [...digits];
    for (let i = 0; i < clean.length && start + i < LENGTH; i++) nextDigits[start + i] = clean[i]!;
    setDigits(nextDigits);
    const focusAt = Math.min(start + clean.length, LENGTH - 1);
    boxes.current[focusAt]?.focus();
    if (nextDigits.every(Boolean)) requestAnimationFrame(() => formRef.current?.requestSubmit());
  };

  const error = state.errors?.code;
  return (
    <form ref={formRef} action={action} className="space-y-6" noValidate>
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="code" value={digits.join('')} />
      <div className="flex items-start gap-3 rounded-2xl bg-accent-tint/60 p-4">
        <span className="relative mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-accent shadow-sm">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent/15 motion-reduce:animate-none" aria-hidden="true" />
          <MailCheck className="relative size-5" aria-hidden="true" />
        </span>
        <p className="text-[15px] text-ink-soft">
          We sent a 6-digit code to <strong className="font-semibold break-all text-ink">{email}</strong>. It works for 10 minutes.
        </p>
      </div>

      <FormAlert state={state} />

      <fieldset>
        <legend className="mb-3 text-[15px] font-medium text-ink">Enter the code</legend>
        <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={(event) => {
          event.preventDefault();
          fill(0, event.clipboardData.getData('text'));
        }}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                boxes.current[index] = node;
              }}
              value={digit}
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              pattern="\d*"
              maxLength={index === 0 ? LENGTH : 1}
              autoFocus={index === 0}
              aria-label={`Digit ${index + 1} of ${LENGTH}`}
              aria-invalid={Boolean(error)}
              onChange={(event) => {
                const value = event.target.value;
                if (!value) {
                  const nextDigits = [...digits];
                  nextDigits[index] = '';
                  setDigits(nextDigits);
                  return;
                }
                fill(index, value.length > 1 && index > 0 ? value.slice(-1) : value);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Backspace' && !digits[index] && index > 0) boxes.current[index - 1]?.focus();
                if (event.key === 'ArrowLeft' && index > 0) boxes.current[index - 1]?.focus();
                if (event.key === 'ArrowRight' && index < LENGTH - 1) boxes.current[index + 1]?.focus();
              }}
              onFocus={(event) => event.target.select()}
              className={`h-14 w-full min-w-0 rounded-xl border bg-surface text-center font-mono text-2xl font-semibold text-ink transition-[border-color,box-shadow,transform] duration-200 outline-none focus:-translate-y-0.5 focus:border-accent focus:shadow-[0_0_0_4px_var(--accent-tint)] sm:h-16 ${
                error ? 'border-danger' : digit ? 'border-ink/40' : 'border-line-strong'
              }`}
            />
          ))}
        </div>
        {error && (
          <p role="alert" className="mt-2 text-[13px] font-medium text-danger">
            {error}
          </p>
        )}
        {testCode && <p className="mt-2 text-[13px] text-ink-faint">Test mode: 123456 also works.</p>}
      </fieldset>

      <VerifyButton complete={digits.every(Boolean)} />

      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
        <span className="text-ink-soft">Did not get it? Check spam, or</span>
        <button
          type="button"
          onClick={resend}
          disabled={wait > 0 || sending}
          className="cursor-pointer font-medium text-accent underline-offset-4 hover:underline disabled:cursor-default disabled:text-ink-faint disabled:no-underline"
        >
          {sending ? 'Sending…' : wait > 0 ? `send a new code in ${wait}s` : 'send a new code'}
        </button>
      </div>
      {notice?.message && (
        <p role={notice.status === 'error' ? 'alert' : 'status'} className={`text-sm font-medium ${notice.status === 'error' ? 'text-danger' : 'text-accent'}`}>
          {notice.message}
        </p>
      )}
    </form>
  );
}

function VerifyButton({ complete }: { complete: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending || !complete} className="w-full">
      {pending && <span className="size-4 shrink-0 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
      {pending ? 'Checking…' : 'Confirm email'}
    </Button>
  );
}
