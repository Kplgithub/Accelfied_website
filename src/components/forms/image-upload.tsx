'use client';

import { ImagePlus, Loader2, X } from 'lucide-react';
import { useId, useRef, useState } from 'react';

interface ImageUploadProps {
  /** Form field that receives the picture's address. */
  name: string;
  label: string;
  kind: 'logo' | 'portfolio' | 'team';
  defaultValue?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  /** Square preview for logos and people, wide for project images. */
  shape?: 'square' | 'wide';
}

/**
 * Picks a picture from the device, uploads it, and keeps its address in a
 * hidden field so the surrounding form sends it like any other value.
 */
export function ImageUpload({ name, label, kind, defaultValue = '', hint, error, optional, shape = 'square' }: ImageUploadProps) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const message = problem || error;

  async function upload(file: File) {
    setProblem('');
    if (!file.type.startsWith('image/')) return setProblem('Choose a picture: JPG, PNG or WebP.');
    if (file.size > 5 * 1024 * 1024) return setProblem('Use a picture under 5 MB.');
    setBusy(true);
    try {
      const body = new FormData();
      body.set('file', file);
      const res = await fetch(`/api/upload?kind=${kind}`, { method: 'POST', body });
      const data = (await res.json().catch(() => ({}))) as { url?: string; message?: string };
      if (!res.ok || !data.url) setProblem(data.message ?? 'Upload failed. Please try again.');
      else setUrl(data.url);
    } catch {
      setProblem('Upload failed. Check your connection and try again.');
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  }

  const preview = shape === 'wide' ? 'aspect-[16/10] w-full max-w-xs' : 'size-24';
  return (
    <div className="flex flex-col gap-1.5">
      <span id={`${id}-label`} className="text-sm font-medium text-ink">
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink-faint">(optional)</span>}
      </span>
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-wrap items-center gap-4">
        <div className={`relative grid shrink-0 place-items-center overflow-hidden rounded-2xl border border-dashed border-line-strong bg-paper ${preview}`}>
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element -- uploaded pictures live on our own /uploads path or an older external link
            <img src={url} alt="" className="size-full object-cover" />
          ) : (
            <ImagePlus className="size-6 text-ink-faint" aria-hidden="true" />
          )}
          {busy && (
            <span className="absolute inset-0 grid place-items-center bg-surface/80">
              <Loader2 className="size-5 animate-spin text-accent" aria-hidden="true" />
            </span>
          )}
        </div>
        <div className="flex flex-col items-start gap-2">
          <label
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink/40 focus-within:ring-4 focus-within:ring-accent/12 ${busy ? 'pointer-events-none opacity-60' : ''}`}
          >
            <ImagePlus className="size-4" aria-hidden="true" />
            {url ? 'Change picture' : 'Upload a picture'}
            <input
              ref={input}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              aria-labelledby={`${id}-label`}
              aria-describedby={message ? `${id}-error` : hint ? `${id}-hint` : undefined}
              disabled={busy}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
              }}
            />
          </label>
          {url && !busy && (
            <button type="button" onClick={() => setUrl('')} className="inline-flex cursor-pointer items-center gap-1 text-[13px] text-ink-soft hover:text-danger">
              <X className="size-3.5" aria-hidden="true" />
              Remove
            </button>
          )}
        </div>
      </div>
      {hint && !message && (
        <p id={`${id}-hint`} className="text-[13px] text-ink-faint">
          {hint}
        </p>
      )}
      {message && (
        <p id={`${id}-error`} className="text-[13px] font-medium text-danger" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
