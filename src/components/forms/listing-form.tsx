'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useActionState, useState } from 'react';
import { applyForListing } from '@/app/actions';
import { COUNTRIES } from '@/lib/countries';
import { initialFormState } from '@/lib/form-state';
import { HOURLY_RATES, INDUSTRIES, MIN_PROJECT_SIZES, TEAM_SIZES } from '@/lib/labels';
import type { ServiceGroup } from '@/lib/types';
import { ButtonLink } from '../ui/button';
import { Field, Input, Select, Textarea } from '../ui/field';
import { FormAlert, FormSection, Honeypot, SubmitButton, SuccessPanel } from './form-bits';
import { formFields } from './use-form-fields';

const MAX_SERVICES = 5;

export function ListingForm({ groups, account }: { groups: ServiceGroup[]; account: { email: string } }) {
  const [state, action] = useActionState(applyForListing, initialFormState);
  const { value, error } = formFields(state);
  const [rows, setRows] = useState(() => {
    const restored = Array.from({ length: MAX_SERVICES }, (_, i) => ({
      slug: value(`services.${i}.slug`),
      percent: value(`services.${i}.percent`),
    })).filter((row) => row.slug);
    return restored.length ? restored : [{ slug: '', percent: '100' }];
  });
  const selectedIndustries = new Set((value('industries') || '').split(',').filter(Boolean));
  const total = rows.reduce((sum, row) => sum + (Number(row.percent) || 0), 0);

  if (state.status === 'success') {
    return (
      <SuccessPanel title="Application received" message={state.message}>
        <ButtonLink href="/dashboard/company">Go to your company dashboard</ButtonLink>
      </SuccessPanel>
    );
  }

  const setRow = (index: number, patch: Partial<{ slug: string; percent: string }>) =>
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  return (
    <form key={state.nonce} action={action} className="relative space-y-8" noValidate>
      <Honeypot />
      <FormAlert state={state} />

      <FormSection title="Company" description="This is what clients see first on your profile.">
        <Field label="Company name" name="name" error={error('name')}>
          {(ids) => <Input id={ids.id} name="name" autoComplete="organization" defaultValue={value('name')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
        <Field label="Website" name="website" error={error('website')}>
          {(ids) => <Input id={ids.id} type="url" name="website" placeholder="https://" defaultValue={value('website')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
        <div className="sm:col-span-2">
          <Field label="Tagline" name="tagline" optional hint="One line on what you do best. Up to 160 characters." error={error('tagline')}>
            {(ids) => <Input id={ids.id} name="tagline" maxLength={160} defaultValue={value('tagline')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="About the company" name="description" hint="Who you work with, how you work and what sets you apart. At least 80 characters." error={error('description')}>
            {(ids) => <Textarea id={ids.id} name="description" rows={6} defaultValue={value('description')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
          </Field>
        </div>
        <Field label="Logo URL" name="logoUrl" optional hint="A square PNG or SVG link works best." error={error('logoUrl')}>
          {(ids) => <Input id={ids.id} type="url" name="logoUrl" placeholder="https://" defaultValue={value('logoUrl')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
        <Field label="Year founded" name="foundedYear" optional error={error('foundedYear')}>
          {(ids) => <Input id={ids.id} type="number" inputMode="numeric" name="foundedYear" min={1800} defaultValue={value('foundedYear')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
      </FormSection>

      <FormSection title="Size & pricing" description="Clients filter by these, so keep them accurate.">
        <Field label="Team size" name="teamSize" error={error('teamSize')}>
          {(ids) => (
            <Select id={ids.id} name="teamSize" defaultValue={value('teamSize')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy}>
              <option value="" disabled>
                Choose a size
              </option>
              {TEAM_SIZES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Typical hourly rate" name="hourlyRate" error={error('hourlyRate')}>
          {(ids) => (
            <Select id={ids.id} name="hourlyRate" defaultValue={value('hourlyRate')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy}>
              <option value="" disabled>
                Choose a rate
              </option>
              {HOURLY_RATES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Minimum project size" name="minProjectSize" error={error('minProjectSize')}>
          {(ids) => (
            <Select id={ids.id} name="minProjectSize" defaultValue={value('minProjectSize')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy}>
              <option value="" disabled>
                Choose a minimum
              </option>
              {MIN_PROJECT_SIZES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </FormSection>

      <FormSection title="Headquarters">
        <Field label="City" name="headquarters.city" error={error('headquarters.city')}>
          {(ids) => <Input id={ids.id} name="headquarters.city" autoComplete="address-level2" defaultValue={value('headquarters.city')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
        <Field label="State or region" name="headquarters.region" optional error={error('headquarters.region')}>
          {(ids) => <Input id={ids.id} name="headquarters.region" autoComplete="address-level1" defaultValue={value('headquarters.region')} aria-describedby={ids.describedBy} />}
        </Field>
        <Field label="Country" name="headquarters.countryCode" error={error('headquarters.countryCode') ?? error('headquarters.country')}>
          {(ids) => (
            <Select id={ids.id} name="headquarters.countryCode" defaultValue={value('headquarters.countryCode')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy}>
              <option value="" disabled>
                Choose a country
              </option>
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </FormSection>

      <fieldset className="grid gap-6 border-t border-line pt-8 lg:grid-cols-[240px_1fr] lg:gap-10">
        <div>
          <legend className="font-display text-xl font-semibold text-ink">Service focus</legend>
          <p className="mt-1.5 text-sm text-ink-soft">Split your work across up to {MAX_SERVICES} services. The total must be 100%.</p>
        </div>
        <div className="space-y-3">
          {rows.map((row, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-1">
                <Select
                  name={`services.${index}.slug`}
                  value={row.slug}
                  onChange={(event) => setRow(index, { slug: event.target.value })}
                  aria-label={`Service ${index + 1}`}
                >
                  <option value="" disabled>
                    Choose a service
                  </option>
                  {groups.map((group) => (
                    <optgroup key={group.slug} label={group.name}>
                      {group.services.map((service) => (
                        <option key={service.slug} value={service.slug} disabled={rows.some((r, i) => i !== index && r.slug === service.slug)}>
                          {service.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </Select>
              </div>
              <div className="relative w-28">
                <Input
                  type="number"
                  inputMode="numeric"
                  min={5}
                  max={100}
                  step={5}
                  name={`services.${index}.percent`}
                  value={row.percent}
                  onChange={(event) => setRow(index, { percent: event.target.value })}
                  aria-label={`Share of work for service ${index + 1}, in percent`}
                  className="pr-8"
                />
                <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-ink-faint">%</span>
              </div>
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => setRows((current) => current.filter((_, i) => i !== index))}
                  className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-ink-soft hover:bg-ink/5 hover:text-danger"
                  aria-label={`Remove service ${index + 1}`}
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {rows.length < MAX_SERVICES ? (
              <button
                type="button"
                onClick={() => setRows((current) => [...current, { slug: '', percent: '' }])}
                className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-brand hover:underline"
              >
                <Plus className="size-4" aria-hidden="true" />
                Add a service
              </button>
            ) : (
              <span />
            )}
            <p className={`text-sm font-medium ${total === 100 ? 'text-success' : 'text-saffron-ink'}`} aria-live="polite">
              Total: {total}%
            </p>
          </div>
          {error('services') && (
            <p role="alert" className="text-[13px] font-medium text-danger">
              {error('services')}
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className="grid gap-6 border-t border-line pt-8 lg:grid-cols-[240px_1fr] lg:gap-10">
        <div>
          <legend className="font-display text-xl font-semibold text-ink">Industries you know best</legend>
          <p className="mt-1.5 text-sm text-ink-soft">Optional. Pick up to 10.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((industry) => (
            <label key={industry} className="cursor-pointer">
              <input type="checkbox" name="industries" value={industry} defaultChecked={selectedIndustries.has(industry)} className="peer sr-only" />
              <span className="inline-block rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-ink-soft transition-colors peer-checked:border-brand peer-checked:bg-brand-tint peer-checked:text-brand peer-focus-visible:outline-2 peer-focus-visible:outline-brand">
                {industry}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <FormSection title="Contact" description="Where client enquiries and our review team reach you. Never shown publicly.">
        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-paper px-4 py-3 text-sm">
          <span className="text-ink-soft">
            Listing managed by <span className="font-medium text-ink">{account.email}</span>
          </span>
        </div>

        <Field label="Enquiries email" name="contactEmail" error={error('contactEmail')}>
          {(ids) => <Input id={ids.id} type="email" name="contactEmail" defaultValue={value('contactEmail') || account.email} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
        <Field label="Phone" name="contactPhone" optional error={error('contactPhone')}>
          {(ids) => <Input id={ids.id} type="tel" name="contactPhone" defaultValue={value('contactPhone')} aria-describedby={ids.describedBy} />}
        </Field>
        <Field label="Your role" name="applicant.jobTitle" optional error={error('applicant.jobTitle')}>
          {(ids) => <Input id={ids.id} name="applicant.jobTitle" autoComplete="organization-title" defaultValue={value('applicant.jobTitle')} aria-describedby={ids.describedBy} />}
        </Field>
      </FormSection>

      <div className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft">Listing is free. Our team checks every company before it goes live.</p>
        <SubmitButton>Submit for review</SubmitButton>
      </div>
    </form>
  );
}
