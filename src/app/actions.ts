'use server';

import { countryName } from '@/lib/countries';
import type { FormState } from '@/lib/form-state';
import { optional, submit, text } from '@/lib/submit';

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
    'Thank you. Our team checks every review before it goes live, usually within two working days.',
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
  return submit(
    '/v1/companies/applications',
    payload,
    form,
    'Application received. We review new companies within two working days and will email you when your profile is live.',
  );
}
