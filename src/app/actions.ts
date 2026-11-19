'use server';

import { ApiError, apiSend } from '@/lib/api';
import { countryName } from '@/lib/countries';
import type { FormState } from '@/lib/form-state';
import { getSessionToken } from '@/lib/session';
import { clientIp, echo, friendly, optional, submit, text } from '@/lib/submit';
import { testOtpEnabled } from '@/lib/test-otp';

export async function requestQuote(_prev: FormState, form: FormData): Promise<FormState> {
  const payload = {
    companySlug: optional(form, 'companySlug'),
    serviceSlug: text(form, 'serviceSlug'),
    budget: text(form, 'budget'),
    timeline: text(form, 'timeline'),
    description: text(form, 'description'),
    preferredLocation: text(form, 'preferredLocation'),
    contact: {
      name: text(form, 'contact.name'),
      phone: text(form, 'contact.phone'),
      companyName: text(form, 'contact.companyName'),
    },
    companyFax: text(form, 'companyFax'),
  };
  return submit('/v1/leads', payload, form, 'Your brief is on its way. Expect replies by email within a few working days.');
}

export async function submitReview(_prev: FormState, form: FormData): Promise<FormState> {
  const ongoing = form.get('project.ongoing') === 'on';
  const score = (key: string) => Number.parseInt(text(form, key), 10) || undefined;
  const payload = {
    companySlug: text(form, 'companySlug'),
    invite: optional(form, 'invite'),
    reviewer: {
      name: text(form, 'reviewer.name'),
      jobTitle: text(form, 'reviewer.jobTitle'),
      companyName: text(form, 'reviewer.companyName'),
      industry: text(form, 'reviewer.industry'),
      companySize: text(form, 'reviewer.companySize'),
      location: text(form, 'reviewer.location'),
      anonymous: form.get('reviewer.anonymous') === 'on',
    },
    project: {
      title: text(form, 'project.title'),
      serviceSlug: text(form, 'project.serviceSlug'),
      budget: text(form, 'project.budget'),
      startedOn: text(form, 'project.startedOn'),
      endedOn: ongoing ? undefined : optional(form, 'project.endedOn'),
      ongoing,
    },
    ratings: {
      overall: score('ratings.overall'),
      quality: score('ratings.quality'),
      schedule: score('ratings.schedule'),
      cost: score('ratings.cost'),
      willingToRefer: score('ratings.willingToRefer'),
    },
    content: {
      background: text(form, 'content.background'),
      challenge: text(form, 'content.challenge'),
      solution: text(form, 'content.solution'),
      results: text(form, 'content.results'),
    },
    consent: form.get('consent') === 'on' ? true : undefined,
    companyFax: text(form, 'companyFax'),
  };
  return submit(
    '/v1/reviews',
    payload,
    form,
    'Thank you. Our team verifies every review before it is published, usually within two working days. You can follow its status in your dashboard.',
  );
}

export async function applyForListing(_prev: FormState, form: FormData): Promise<FormState> {
  const services = [0, 1, 2, 3, 4]
    .map((index) => ({ slug: text(form, `services.${index}.slug`), percent: Number(text(form, `services.${index}.percent`)) }))
    .filter((service) => service.slug);
  const year = text(form, 'foundedYear');
  const countryCode = text(form, 'headquarters.countryCode');
  const payload = {
    name: text(form, 'name'),
    tagline: text(form, 'tagline'),
    description: text(form, 'description'),
    website: text(form, 'website'),
    logoUrl: text(form, 'logoUrl'),
    foundedYear: year ? Number(year) : undefined,
    teamSize: text(form, 'teamSize'),
    hourlyRate: text(form, 'hourlyRate'),
    minProjectSize: Number(text(form, 'minProjectSize')),
    headquarters: {
      city: text(form, 'headquarters.city'),
      region: text(form, 'headquarters.region'),
      country: countryCode ? countryName(countryCode) : '',
      countryCode,
    },
    services,
    industries: form.getAll('industries').map(String),
    contactEmail: text(form, 'contactEmail'),
    contactPhone: text(form, 'contactPhone'),
    applicant: { jobTitle: text(form, 'applicant.jobTitle') },
    companyFax: text(form, 'companyFax'),
  };
  const socials = Object.fromEntries(SOCIAL_SITES.map(({ key }) => [key, text(form, `socials.${key}`)])) as Record<SocialKey, string>;
  const socialErrors: Record<string, string> = {};
  for (const { key, hosts, label } of SOCIAL_SITES) {
    if (socials[key] && !isSocialLink(socials[key], hosts)) socialErrors[`socials.${key}`] = `Enter your ${label} page address, starting with https://`;
  }
  if (Object.keys(socialErrors).length) {
    return { status: 'error', message: 'Some fields need a second look.', errors: socialErrors, values: echo(form), nonce: Date.now() };
  }
  const state = await submit(
    '/v1/companies/applications',
    payload,
    form,
    'Thanks, your company is in. Our team is verifying the details, usually within two working days. Once approved, your profile goes live.',
  );
  // Social links are saved on the new listing right after it is created.
  if (state.status === 'success' && Object.values(socials).some(Boolean)) {
    const token = await getSessionToken();
    if (token) {
      await apiSend(
        'PATCH',
        '/v1/me/company',
        {
          tagline: payload.tagline,
          description: payload.description,
          logoUrl: payload.logoUrl,
          contactEmail: payload.contactEmail,
          contactPhone: payload.contactPhone,
          clients: [],
          socials,
        },
        { token, clientIp: await clientIp() },
      ).catch((error: unknown) => console.error('Saving social links failed', error));
    }
  }
  return state;
}

type SocialKey = 'linkedin' | 'facebook' | 'instagram' | 'x' | 'youtube';
const SOCIAL_SITES: Array<{ key: SocialKey; label: string; hosts: string[] }> = [
  { key: 'linkedin', label: 'LinkedIn', hosts: ['linkedin.com'] },
  { key: 'facebook', label: 'Facebook', hosts: ['facebook.com', 'fb.com'] },
  { key: 'instagram', label: 'Instagram', hosts: ['instagram.com'] },
  { key: 'x', label: 'X', hosts: ['x.com', 'twitter.com'] },
  { key: 'youtube', label: 'YouTube', hosts: ['youtube.com', 'youtu.be'] },
];

/** Same rule as the API: an https link on that site. */
function isSocialLink(value: string, hosts: string[]): boolean {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    return url.protocol === 'https:' && value.length <= 300 && hosts.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export async function submitClaim(_prev: FormState, form: FormData): Promise<FormState> {
  const slug = text(form, 'companySlug');
  const payload = {
    workEmail: text(form, 'workEmail'),
    jobTitle: text(form, 'jobTitle'),
    phone: text(form, 'phone'),
    message: text(form, 'message'),
    confirm: form.get('confirm') === 'on' ? true : undefined,
  };
  const codeEntry = await testOtpEnabled();
  return submit(
    `/v1/companies/${encodeURIComponent(slug)}/claims`,
    payload,
    form,
    (data) =>
      (data as { claim?: { status?: string } } | null)?.claim?.status === 'unconfirmed'
        ? codeEntry
          ? `Enter the 6-digit code for ${payload.workEmail} on your dashboard to confirm the claim is yours, then our team verifies it, usually within two working days.`
          : `We sent a link to ${payload.workEmail}. Open it to confirm the claim is yours, then our team verifies it, usually within two working days.`
        : 'Our team is verifying your request, usually within two working days. Once approved, the listing moves to your account and you can manage it from your dashboard.',
  );
}

/** The public contact form. Works signed out, so it does not go through `submit`. */
export async function sendContactMessage(_prev: FormState, form: FormData): Promise<FormState> {
  const payload = {
    name: text(form, 'name'),
    email: text(form, 'email'),
    phone: text(form, 'phone'),
    company: text(form, 'company'),
    topic: text(form, 'topic'),
    message: text(form, 'message'),
    companyFax: text(form, 'companyFax'),
  };
  try {
    await apiSend('POST', '/v1/contact', payload, { clientIp: await clientIp() });
    return { status: 'success', message: 'Thanks for writing. We usually reply within one working day.', nonce: Date.now() };
  } catch (error) {
    if (error instanceof ApiError) {
      const errors: Record<string, string> = {};
      for (const issue of error.issues) if (!errors[issue.path]) errors[issue.path] = friendly(issue.message);
      const message = error.status === 429 ? 'You have sent a few messages already. Please try again a little later.' : error.issues.length ? 'Some fields need a second look.' : error.message;
      return { status: 'error', message, errors, values: echo(form), nonce: Date.now() };
    }
    console.error('Contact form failed', error);
    return { status: 'error', message: 'We could not send this right now. Please try again in a moment.', values: echo(form), nonce: Date.now() };
  }
}
