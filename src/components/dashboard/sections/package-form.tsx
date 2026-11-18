'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useActionState, useState } from 'react';
import { savePackage } from '@/app/profile-section-actions';
import { initialFormState } from '@/lib/form-state';
import type { CompanyPackage, ServiceLine } from '@/lib/types';
import { FormAlert, FormSaved, SubmitButton } from '../../forms/form-bits';
import { formFields } from '../../forms/use-form-fields';
import { Field, Input, Select, Textarea } from '../../ui/field';

const TIERS = ['Small', 'Medium', 'Large'] as const;
const MAX_FEATURES = 20;

const STARTER_FEATURES = [
  { label: 'Design', values: ['yes', 'yes', 'yes'] },
  { label: 'Revisions', values: ['1 round', '2 rounds', 'Unlimited'] },
  { label: 'Support after launch', values: ['1 month', '2 months', '3 months'] },
];

export function PackageForm({ item, services, onDone }: { item?: CompanyPackage; services: ServiceLine[]; onDone?: string }) {
  const [state, action] = useActionState(savePackage, initialFormState);
  const { value, error } = formFields(state);
  const pick = (name: string, fallback: string) => (state.status === 'error' ? value(name) : fallback);
  const [features, setFeatures] = useState(() => (item ? item.features : STARTER_FEATURES).map((feature) => ({ ...feature, values: [...feature.values] })));
  const setFeature = (index: number, patch: Partial<{ label: string; values: string[] }>) =>
    setFeatures((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  if (state.status === 'success' && !item) {
    // A fresh form after adding, so the next package starts clean.
    return (
      <div className="space-y-4">
        <FormSaved state={state} />
        {onDone && (
          <a href={onDone} className="inline-flex text-sm font-medium text-accent hover:underline">
            Add another package
          </a>
        )}
      </div>
    );
  }

  return (
    <form key={state.nonce} action={action} className="space-y-8" noValidate>
      {item && <input type="hidden" name="id" value={item.id} />}
      <FormAlert state={state} />
      <FormSaved state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Package name" name="title" hint="For example: Mobile app launch" error={error('title')}>
          {(ids) => <Input id={ids.id} name="title" maxLength={100} defaultValue={pick('title', item?.title ?? '')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} />}
        </Field>
        <Field label="Service" name="serviceSlug" error={error('serviceSlug')}>
          {(ids) => (
            <Select id={ids.id} name="serviceSlug" defaultValue={pick('serviceSlug', item?.serviceSlug ?? services[0]?.slug ?? '')} aria-invalid={ids.invalid} aria-describedby={ids.describedBy}>
              {services.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.name}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <div className="sm:col-span-2">
          <Field label="Short description" name="description" optional error={error('description')}>
            {(ids) => <Textarea id={ids.id} name="description" rows={2} maxLength={600} defaultValue={pick('description', item?.description ?? '')} aria-describedby={ids.describedBy} />}
          </Field>
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg font-semibold text-ink">Prices</h3>
        <p className="mt-1 text-sm text-ink-soft">In US dollars. Prices go up from Small to Large.</p>
        {error('tiers') && (
          <p role="alert" className="mt-2 text-[13px] font-medium text-danger">
            {error('tiers')}
          </p>
        )}
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {TIERS.map((tier, index) => (
            <div key={tier} className="space-y-3 rounded-2xl border border-line bg-paper/60 p-4">
              <p className="text-sm font-semibold text-ink">{tier}</p>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-faint">$</span>
                <Input
                  name={`tiers.${index}.price`}
                  inputMode="numeric"
                  placeholder="Price"
                  className="pl-7"
                  defaultValue={pick(`tiers.${index}.price`, item?.tiers[index] ? String(item.tiers[index].price) : '')}
                  aria-label={`${tier} price in US dollars`}
                  aria-invalid={Boolean(error(`tiers.${index}.price`))}
                />
              </div>
              <Input name={`tiers.${index}.duration`} maxLength={40} placeholder="Delivery, e.g. 6 weeks" defaultValue={pick(`tiers.${index}.duration`, item?.tiers[index]?.duration ?? '')} aria-label={`${tier} delivery time`} />
              <Textarea name={`tiers.${index}.summary`} rows={2} maxLength={300} placeholder="What is included" defaultValue={pick(`tiers.${index}.summary`, item?.tiers[index]?.summary ?? '')} aria-label={`${tier} summary`} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg font-semibold text-ink">Features to compare</h3>
        <p className="mt-1 text-sm text-ink-soft">Type yes for a tick, leave empty when not included, or write a short value like 2 months.</p>
        <div className="mt-4 -mx-1 overflow-x-auto px-1">
          <table className="w-full min-w-[620px]">
            <thead>
              <tr className="text-left text-xs font-semibold tracking-[0.1em] text-ink-faint uppercase">
                <th className="pb-2 font-semibold">Feature</th>
                {TIERS.map((tier) => (
                  <th key={tier} className="pb-2 pl-2 font-semibold">
                    {tier}
                  </th>
                ))}
                <th className="w-11" />
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index}>
                  <td className="py-1 pr-2">
                    <Input name={`features.${index}.label`} value={feature.label} maxLength={80} onChange={(event) => setFeature(index, { label: event.target.value })} aria-label={`Feature ${index + 1} name`} />
                  </td>
                  {TIERS.map((tier, tierIndex) => (
                    <td key={tier} className="py-1 pl-2">
                      <Input
                        name={`features.${index}.values.${tierIndex}`}
                        value={feature.values[tierIndex] ?? ''}
                        maxLength={40}
                        onChange={(event) => setFeature(index, { values: feature.values.map((v, i) => (i === tierIndex ? event.target.value : v)) })}
                        aria-label={`Feature ${index + 1}, ${tier}`}
                      />
                    </td>
                  ))}
                  <td className="py-1 pl-1">
                    <button
                      type="button"
                      onClick={() => setFeatures((current) => current.filter((_, i) => i !== index))}
                      className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl text-ink-soft hover:bg-ink/5 hover:text-danger"
                      aria-label={`Remove feature ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {features.length < MAX_FEATURES && (
          <button
            type="button"
            onClick={() => setFeatures((current) => [...current, { label: '', values: ['', '', ''] }])}
            className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add a feature
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" name="status" value="hidden" defaultChecked={item?.status === 'hidden'} className="size-4 accent-[var(--accent)]" />
          Hide from my public profile for now
        </label>
        <SubmitButton pendingLabel="Saving…">{item ? 'Save package' : 'Add package'}</SubmitButton>
      </div>
    </form>
  );
}
