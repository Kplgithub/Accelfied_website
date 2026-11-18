'use server';

import { refresh } from 'next/cache';
import { apiSend } from '@/lib/api';
import { countryName } from '@/lib/countries';
import type { FormState } from '@/lib/form-state';
import { getSessionToken } from '@/lib/session';
import { submit, text } from '@/lib/submit';

const SAVED = 'Saved. Changes show on your public profile within a minute.';
const ID = /^[a-f\d]{24}$/i;

async function andRefresh(state: FormState): Promise<FormState> {
  if (state.status === 'success') refresh();
  return state;
}

const indexed = (form: FormData, prefix: string, max: number) =>
  Array.from({ length: max }, (_, index) => index).filter((index) => form.has(`${prefix}.${index}.${prefix === 'services' ? 'slug' : 'city'}`));

export async function saveBasics(_prev: FormState, form: FormData): Promise<FormState> {
  const year = text(form, 'foundedYear');
  const payload = {
    teamSize: text(form, 'teamSize'),
    hourlyRate: text(form, 'hourlyRate'),
    minProjectSize: Number(text(form, 'minProjectSize')),
    foundedYear: year ? Number(year) : null,
  };
  return andRefresh(await submit('/v1/me/company/basics', payload, form, SAVED, 'PUT'));
}

export async function saveServices(_prev: FormState, form: FormData): Promise<FormState> {
  const services = indexed(form, 'services', 10)
    .map((index) => ({ slug: text(form, `services.${index}.slug`), percent: Number(text(form, `services.${index}.percent`)) }))
    .filter((row) => row.slug);
  return andRefresh(await submit('/v1/me/company/services', { services }, form, SAVED, 'PUT'));
}

export async function saveIndustries(_prev: FormState, form: FormData): Promise<FormState> {
  const industries = form.getAll('industries').map(String).filter(Boolean);
  return andRefresh(await submit('/v1/me/company/industries', { industries }, form, SAVED, 'PUT'));
}

export async function saveLocations(_prev: FormState, form: FormData): Promise<FormState> {
  const place = (prefix: string) => {
    const countryCode = text(form, `${prefix}.countryCode`);
    return { city: text(form, `${prefix}.city`), region: text(form, `${prefix}.region`), countryCode, country: countryName(countryCode) || countryCode };
  };
  const otherLocations = indexed(form, 'otherLocations', 20)
    .map((index) => place(`otherLocations.${index}`))
    .filter((row) => row.city || row.countryCode);
  return andRefresh(await submit('/v1/me/company/locations', { headquarters: place('headquarters'), otherLocations }, form, SAVED, 'PUT'));
}

export async function saveClientFocus(_prev: FormState, form: FormData): Promise<FormState> {
  const payload = {
    small: Number(text(form, 'small')) || 0,
    midmarket: Number(text(form, 'midmarket')) || 0,
    enterprise: Number(text(form, 'enterprise')) || 0,
  };
  return andRefresh(await submit('/v1/me/company/client-focus', payload, form, SAVED, 'PUT'));
}

export async function addAward(_prev: FormState, form: FormData): Promise<FormState> {
  const year = text(form, 'year');
  const payload = { title: text(form, 'title'), url: text(form, 'url'), year: year ? Number(year) : null };
  return andRefresh(await submit('/v1/me/company/awards', payload, form, 'Award added to your profile.'));
}

export async function removeAward(form: FormData): Promise<void> {
  const id = text(form, 'id');
  const token = await getSessionToken();
  if (!ID.test(id) || !token) return;
  await apiSend('DELETE', `/v1/me/company/awards/${id}`, undefined, { token });
  refresh();
}

export async function savePackage(_prev: FormState, form: FormData): Promise<FormState> {
  const id = text(form, 'id');
  const features = Array.from({ length: 20 }, (_, index) => index)
    .filter((index) => text(form, `features.${index}.label`))
    .map((index) => ({ label: text(form, `features.${index}.label`), values: [0, 1, 2].map((tier) => text(form, `features.${index}.values.${tier}`)) }));
  const payload = {
    title: text(form, 'title'),
    serviceSlug: text(form, 'serviceSlug'),
    description: text(form, 'description'),
    status: text(form, 'status') === 'hidden' ? 'hidden' : 'published',
    tiers: [0, 1, 2].map((tier) => ({
      price: Number(text(form, `tiers.${tier}.price`).replace(/[^\d]/g, '')) || 0,
      duration: text(form, `tiers.${tier}.duration`),
      summary: text(form, `tiers.${tier}.summary`),
    })),
    features,
  };
  if (ID.test(id)) {
    return andRefresh(await submit(`/v1/me/company/packages/${id}`, payload, form, 'Package saved.', 'PUT'));
  }
  return andRefresh(await submit('/v1/me/company/packages', payload, form, 'Package added. It shows on your profile within a minute.'));
}

export async function removePackage(form: FormData): Promise<void> {
  const id = text(form, 'id');
  const token = await getSessionToken();
  if (!ID.test(id) || !token) return;
  await apiSend('DELETE', `/v1/me/company/packages/${id}`, undefined, { token });
  refresh();
}
