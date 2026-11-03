'use client';

import { useState } from 'react';

const WORDS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

/** Accessible 1–5 rating built on native radio inputs. */
export function StarInput({ name, label, defaultValue, error }: { name: string; label: string; defaultValue?: number; error?: string }) {
  const [value, setValue] = useState(defaultValue ?? 0);
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  const errorId = error ? `${name}-error` : undefined;

  return (
    <fieldset aria-describedby={errorId}>
      <legend className="text-sm font-medium text-ink">{label}</legend>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <label key={star} className="cursor-pointer p-1" onMouseEnter={() => setHover(star)}>
              <input
                type="radio"
                name={name}
                value={star}
                checked={value === star}
                onChange={() => setValue(star)}
                className="peer sr-only"
                aria-label={`${star} out of 5, ${WORDS[star]}`}
              />
              <svg
                viewBox="0 0 20 20"
                className={`size-8 transition-transform duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-accent hover:scale-110 ${star <= shown ? 'fill-saffron' : 'fill-line-strong'}`}
                aria-hidden="true"
              >
                <path d="M10 1.6l2.47 5.2 5.66.7-4.17 3.9 1.07 5.62L10 14.3l-5.03 2.72 1.07-5.62L1.87 7.5l5.66-.7L10 1.6z" />
              </svg>
            </label>
          ))}
        </div>
        <span className="min-w-20 text-sm text-ink-soft" aria-hidden="true">
          {WORDS[shown]}
        </span>
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-[13px] font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
