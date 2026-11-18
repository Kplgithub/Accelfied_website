'use server';

import { refresh } from 'next/cache';
import { ApiError, apiSend } from '@/lib/api';
import type { FormState } from '@/lib/form-state';
import { getSessionToken } from '@/lib/session';
import { clientIp, friendly, submit, text } from '@/lib/submit';
import type { ProjectBrief } from '@/lib/types';

export interface BriefAnswers {
  serviceSlug: string;
  goal: string;
  locationPreference: 'any' | 'near' | 'countries';
  countries: string[];
  nearCity: string;
  website: string;
  companyName: string;
  about: string;
  employees: string;
  budget: string;
  timeline: string;
}

export type CreateBriefResult = { ok: true; id: string } | { ok: false; message: string; errors: Record<string, string> };

/** Saves the step-by-step answers as a draft brief, written up on the server. */
export async function createBrief(answers: BriefAnswers): Promise<CreateBriefResult> {
  const token = await getSessionToken();
  if (!token) return { ok: false, message: 'Please log in again to continue.', errors: {} };
  try {
    const { brief } = await apiSend<{ brief: ProjectBrief }>('POST', '/v1/me/briefs', answers, { token, clientIp: await clientIp() });
    return { ok: true, id: brief.id };
  } catch (error) {
    if (error instanceof ApiError) {
      const errors: Record<string, string> = {};
      for (const issue of error.issues) if (!errors[issue.path]) errors[issue.path] = friendly(issue.message);
      return { ok: false, message: error.status === 400 ? 'Some answers need a second look.' : error.message, errors };
    }
    return { ok: false, message: 'We could not save your brief right now. Please try again.', errors: {} };
  }
}

const lines = (form: FormData, key: string) =>
  text(form, key)
    .split('\n')
    .map((line) => line.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean);

export async function updateBrief(_prev: FormState, form: FormData): Promise<FormState> {
  const id = text(form, 'id');
  if (!/^[a-f\d]{24}$/i.test(id)) return { status: 'error', message: 'Brief not found.' };
  const payload = {
    companyName: text(form, 'companyName'),
    introduction: text(form, 'introduction'),
    objectives: lines(form, 'objectives'),
    deliverables: lines(form, 'deliverables'),
    questions: lines(form, 'questions'),
    additionalRequirements: text(form, 'additionalRequirements'),
    budget: text(form, 'budget'),
    timeline: text(form, 'timeline'),
  };
  const state = await submit(`/v1/me/briefs/${id}`, payload, form, 'Brief saved.', 'PUT');
  if (state.status === 'success') refresh();
  return state;
}

export async function sendBrief(_prev: FormState, form: FormData): Promise<FormState> {
  const id = text(form, 'id');
  if (!/^[a-f\d]{24}$/i.test(id)) return { status: 'error', message: 'Brief not found.' };
  const payload = {
    companySlugs: form.getAll('companySlugs').map(String).filter(Boolean).slice(0, 5),
    contactName: text(form, 'contactName'),
    contactPhone: text(form, 'contactPhone'),
  };
  const state = await submit(`/v1/me/briefs/${id}/send`, payload, form, (data) => {
    const sent = (data as { sent?: number })?.sent ?? 0;
    return `Your brief went to ${sent} ${sent === 1 ? 'company' : 'companies'}.`;
  });
  if (state.status === 'success') refresh();
  return state;
}
