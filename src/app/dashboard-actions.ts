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
