'use server';

import { apiUrl } from '@/lib/api';
import { getSessionToken } from '@/lib/session';
import { clientIp } from '@/lib/submit';

export interface WebsiteDraft {
  website: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  foundedYear: number | null;
  teamSize: string;
  headquarters: { city: string; region: string; countryCode: string };
  services: Array<{ slug: string; percent: number }>;
  industries: string[];
  contactEmail: string;
  contactPhone: string;
  socials: Record<'linkedin' | 'facebook' | 'instagram' | 'x' | 'youtube', string>;
  filled: string[];
}

export type AutofillResult = { status: 'success'; draft: WebsiteDraft } | { status: 'error'; message: string };

/** Reads the company's website on our server and returns the details it found. */
export async function autofillFromWebsite(website: string): Promise<AutofillResult> {
  const value = String(website ?? '').trim();
  if (value.length < 4 || value.length > 300 || !/\.[a-z]{2,}/i.test(value)) {
    return { status: 'error', message: 'Enter your company website, for example yourcompany.com' };
  }
  const token = await getSessionToken();
  if (!token) return { status: 'error', message: 'Please log in again to continue.' };
  const ip = await clientIp();
  try {
    const res = await fetch(apiUrl('/v1/me/company/autofill'), {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
        ...(ip ? { 'x-forwarded-for': ip } : {}),
      },
      body: JSON.stringify({ website: value }),
      cache: 'no-store',
      // Reading a slow site takes up to about 13 seconds on the API.
      signal: AbortSignal.timeout(18_000),
    });
    const body = (await res.json().catch(() => null)) as { draft?: WebsiteDraft; message?: string } | null;
    if (res.ok && body?.draft) return { status: 'success', draft: body.draft };
    if (res.status === 429) return { status: 'error', message: 'You have tried this a few times. Please wait a few minutes, or fill in the details yourself.' };
    if (res.status === 401) return { status: 'error', message: 'Your session has ended. Please log in again.' };
    return { status: 'error', message: body?.message ?? 'We could not read this website. Fill in the details yourself.' };
  } catch {
    return { status: 'error', message: 'Your website took too long to answer. Try again, or fill in the details yourself.' };
  }
}
