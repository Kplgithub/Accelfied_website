'use server';

import { ApiError, apiPost } from '@/lib/api';
import { getSessionToken } from '@/lib/session';

export interface ReportState {
  status: 'idle' | 'success' | 'error' | 'login';
  message?: string;
}

const REASONS = ['not-a-client', 'wrong-company', 'offensive', 'private-information', 'other'];

/** Sends a report on a published review to our team. Signed-in people only. */
export async function reportReview(_prev: ReportState, form: FormData): Promise<ReportState> {
  const token = await getSessionToken();
  if (!token) return { status: 'login' };
  const id = String(form.get('reviewId') ?? '');
  const reason = String(form.get('reason') ?? '');
  const details = String(form.get('details') ?? '').trim().slice(0, 2000);
  if (!/^[a-f\d]{24}$/i.test(id) || !REASONS.includes(reason)) return { status: 'error', message: 'Pick a reason for the report.' };
  if (details.length < 10) return { status: 'error', message: 'Tell us a little more, at least 10 characters.' };
  try {
    await apiPost(`/v1/reviews/${id}/report`, { reason, details }, { token });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return { status: 'login' };
    if (error instanceof ApiError && error.status === 409) return { status: 'success', message: 'You already reported this review. Our team is looking at it.' };
    if (error instanceof ApiError && error.status < 500) return { status: 'error', message: error.message };
    console.error('Review report failed', error);
    return { status: 'error', message: 'Something went wrong. Please try again in a moment.' };
  }
  return { status: 'success', message: 'Thanks. Our team will check this review and act on it if it breaks our rules.' };
}
