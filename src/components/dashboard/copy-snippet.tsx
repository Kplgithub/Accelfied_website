'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

/** Read-only code box with a copy button, for HTML a company pastes on its website. */
export function CopySnippet({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the code stays selectable in the box.
    }
  };
  return (
    <div className="space-y-3">
      <textarea
        readOnly
        value={code}
        aria-label={label}
        rows={4}
        onFocus={(event) => event.currentTarget.select()}
        className="w-full resize-none rounded-xl border border-line-strong bg-paper p-3.5 font-mono text-[13px] leading-relaxed text-ink"
      />
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-strong"
      >
        {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
        <span aria-live="polite">{copied ? 'Copied' : 'Copy code'}</span>
      </button>
    </div>
  );
}
