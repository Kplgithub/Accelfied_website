'use server';

import { refresh } from 'next/cache';
import { apiSend } from '@/lib/api';
import type { FormState } from '@/lib/form-state';
import { getSessionToken } from '@/lib/session';
import { submit, text } from '@/lib/submit';

async function andRefresh(state: FormState): Promise<FormState> {
  if (state.status === 'success') refresh();
  return state;
}

export async function updateCompanyProfile(_prev: FormState, form: FormData): Promise<FormState> {
  const clients = text(form, 'clients')
    .split(/[\n,]/)
    .map((name) => name.trim())
    .filter(Boolean);
  const payload = {
    tagline: text(form, 'tagline'),
    description: text(form, 'description'),
    logoUrl: text(form, 'logoUrl'),
    contactEmail: text(form, 'contactEmail'),
    contactPhone: text(form, 'contactPhone'),
    clients,
    socials: {
      linkedin: text(form, 'socials.linkedin'),
      facebook: text(form, 'socials.facebook'),
      instagram: text(form, 'socials.instagram'),
      x: text(form, 'socials.x'),
      youtube: text(form, 'socials.youtube'),
    },
  };
  return andRefresh(await submit('/v1/me/company', payload, form, 'Profile saved. Changes show on your public profile within a minute.', 'PATCH'));
}

export async function addPortfolioItem(_prev: FormState, form: FormData): Promise<FormState> {
  const payload = {
    title: text(form, 'title'),
    description: text(form, 'description'),
    imageUrl: text(form, 'imageUrl'),
    url: text(form, 'url'),
    serviceSlug: text(form, 'serviceSlug'),
  };
  return andRefresh(await submit('/v1/me/company/portfolio', payload, form, 'Project added to your portfolio.'));
}

export async function removePortfolioItem(form: FormData): Promise<void> {
  const id = text(form, 'id');
  const token = await getSessionToken();
  if (!/^[a-f\d]{24}$/i.test(id) || !token) return;
  await apiSend('DELETE', `/v1/me/company/portfolio/${id}`, undefined, { token });
  refresh();
}

export async function addTeamMember(_prev: FormState, form: FormData): Promise<FormState> {
  const payload = {
    name: text(form, 'name'),
    role: text(form, 'role'),
    photoUrl: text(form, 'photoUrl'),
    linkedinUrl: text(form, 'linkedinUrl'),
  };
  return andRefresh(await submit('/v1/me/company/team', payload, form, 'Team member added. They show on your profile within a minute.'));
}

export async function removeTeamMember(form: FormData): Promise<void> {
  const id = text(form, 'id');
  const token = await getSessionToken();
  if (!/^[a-f\d]{24}$/i.test(id) || !token) return;
  await apiSend('DELETE', `/v1/me/company/team/${id}`, undefined, { token });
  refresh();
}

export async function inviteReviewer(_prev: FormState, form: FormData): Promise<FormState> {
  const payload = { name: text(form, 'name'), email: text(form, 'email'), note: text(form, 'note') };
  return andRefresh(await submit('/v1/me/company/review-invites', payload, form, `Invite sent to ${payload.email}.`));
}

export async function resendVerification(_prev?: FormState): Promise<FormState> {
  return submit('/v1/auth/resend-verification', undefined, new FormData(), 'We sent a new link. Check your inbox.');
}

/** Sends the same invite again as a reminder. The API allows it once a week, three times in all. */
export async function remindReviewer(form: FormData): Promise<void> {
  const token = await getSessionToken();
  const payload = { name: text(form, 'name'), email: text(form, 'email'), note: '' };
  if (!token || !payload.email) return;
  await apiSend('POST', '/v1/me/company/review-invites', payload, { token }).catch(() => undefined);
  refresh();
}
