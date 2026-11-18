'use server';

import { apiSend } from '@/lib/api';
import { getSessionToken } from '@/lib/session';

const SLUG = /^[a-z0-9-]{1,120}$/;
const KEY = /^[a-zA-Z.]{1,40}$/;

export type DraftAnswers = Record<string, string | boolean>;

/** "Save & exit": keeps the reviewer's answers so they can finish later. */
export async function saveReviewDraft(slug: string, step: number, answers: DraftAnswers): Promise<{ ok: boolean }> {
  const token = await getSessionToken();
  if (!token || !SLUG.test(slug)) return { ok: false };
  const clean: DraftAnswers = {};
  for (const [key, value] of Object.entries(answers).slice(0, 40)) {
    if (!KEY.test(key)) continue;
    clean[key] = typeof value === 'boolean' ? value : String(value).slice(0, 5000);
  }
  try {
    await apiSend('PUT', `/v1/me/review-drafts/${slug}`, { step: Math.max(0, Math.min(50, Math.trunc(step))), answers: clean }, { token });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

/** Called once the review is submitted, so the draft does not linger. */
export async function discardReviewDraft(slug: string): Promise<void> {
  const token = await getSessionToken();
  if (!token || !SLUG.test(slug)) return;
  await apiSend('DELETE', `/v1/me/review-drafts/${slug}`, undefined, { token }).catch(() => undefined);
}
