import { ChevronDown } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

const control =
  'w-full rounded-xl border border-line-strong bg-surface px-3.5 text-[15px] text-ink placeholder:text-ink-faint transition-colors duration-150 hover:border-ink/40 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/12 aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/12';

interface FieldProps {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
}

export function Field({ label, name, hint, error, optional, children }: FieldProps) {
  const id = `f-${name.replace(/[^a-zA-Z0-9]+/g, '-')}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink-faint">(optional)</span>}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && !error && (
        <p id={hintId} className="text-[13px] text-ink-faint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-[13px] font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ className = '', ...props }: ComponentProps<'input'>) {
  return <input className={`${control} h-11 ${className}`} {...props} />;
}

export function Select({ className = '', ...props }: ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select className={`${control} h-11 cursor-pointer appearance-none pr-10 ${className}`} {...props} />
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-soft"
        aria-hidden="true"
      />
    </div>
  );
}

export function Textarea({ className = '', ...props }: ComponentProps<'textarea'>) {
  return <textarea className={`${control} min-h-32 py-3 leading-relaxed ${className}`} {...props} />;
}
