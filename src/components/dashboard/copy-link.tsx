'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the link stays selectable in the field.
    }
  };
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        readOnly
        value={url}
        aria-label="Review link"
        onFocus={(event) => event.currentTarget.select()}
        className="h-11 min-w-0 flex-1 rounded-xl border border-line-strong bg-paper px-3.5 text-[15px] text-ink"
      />
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-strong"
      >
        {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
        <span aria-live="polite">{copied ? 'Copied' : 'Copy link'}</span>
      </button>
    </div>
  );
}
