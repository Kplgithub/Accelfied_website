'use server';

import { refresh } from 'next/cache';
import { apiSend } from '@/lib/api';
import type { FormState } from '@/lib/form-state';
import { getSessionToken } from '@/lib/session';
import { submit, text } from '@/lib/submit';

const ID = /^[a-f\d]{24}$/i;
const TASK = /^[a-z][a-z0-9-]{1,39}$/;

async function andRefresh(state: FormState): Promise<FormState> {
  if (state.status === 'success') refresh();
  return state;
}

/** Skip a recommended task, or put it back on the to-do list. */
export async function setTaskSkipped(key: string, skipped: boolean): Promise<{ ok: boolean }> {
  const token = await getSessionToken();
  if (!token || !TASK.test(key)) return { ok: false };
  try {
    await apiSend(skipped ? 'PUT' : 'DELETE', `/v1/me/company/tasks/${key}/skip`, undefined, { token });
    refresh();
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

/** Pin one review to the top of the public profile, or unpin it (null). */
export async function setFeaturedReview(reviewId: string | null): Promise<{ ok: boolean; message?: string }> {
  const token = await getSessionToken();
  if (!token || (reviewId !== null && !ID.test(reviewId))) return { ok: false };
  try {
    await apiSend('PUT', '/v1/me/company/featured-review', { reviewId }, { token });
    refresh();
    return { ok: true };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : undefined };
  }
}

export async function saveStory(_prev: FormState, form: FormData): Promise<FormState> {
  return andRefresh(await submit('/v1/me/company/story', { story: text(form, 'story') }, form, 'Story saved. It shows on your profile within a minute.', 'PUT'));
}

export async function addPortfolioFromProject(_prev: FormState, form: FormData): Promise<FormState> {
  const id = text(form, 'projectId');
  if (!ID.test(id)) return { status: 'error', message: 'This project could not be found.', nonce: Date.now() };
  const payload = { description: text(form, 'description'), imageUrl: text(form, 'imageUrl'), url: text(form, 'url') };
  return andRefresh(await submit(`/v1/me/company/projects/${id}/portfolio`, payload, form, 'Added to your portfolio.'));
}

export async function saveMyProfile(_prev: FormState, form: FormData): Promise<FormState> {
  const payload = {
    avatarUrl: text(form, 'avatarUrl'),
    jobTitle: text(form, 'jobTitle'),
    companyName: text(form, 'companyName'),
    contactEmail: text(form, 'contactEmail'),
    phone: text(form, 'phone'),
    linkedinUrl: text(form, 'linkedinUrl'),
    xUrl: text(form, 'xUrl'),
    location: text(form, 'location'),
    industry: text(form, 'industry'),
    headline: text(form, 'headline'),
    bio: text(form, 'bio'),
  };
  return andRefresh(await submit('/v1/me/profile', payload, form, 'Profile saved.', 'PUT'));
}
