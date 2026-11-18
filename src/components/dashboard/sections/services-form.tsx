'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useActionState, useState } from 'react';
import { saveServices } from '@/app/profile-section-actions';
import { initialFormState } from '@/lib/form-state';
import type { OwnedCompany, ServiceGroup } from '@/lib/types';
import { Donut } from '../../charts/donut';
import { FormAlert, FormSaved, SubmitButton } from '../../forms/form-bits';
import { Input, Select } from '../../ui/field';

const MAX = 10;

export function ServicesForm({ company, groups }: { company: OwnedCompany; groups: ServiceGroup[] }) {
  const [state, action] = useActionState(saveServices, initialFormState);
  const [rows, setRows] = useState(() => company.services.map((service) => ({ slug: service.slug, percent: String(service.percent) })));
  const names = new Map(groups.flatMap((group) => group.services.map((service) => [service.slug, service.name] as const)));
  const total = rows.reduce((sum, row) => sum + (Number(row.percent) || 0), 0);
  const setRow = (index: number, patch: Partial<{ slug: string; percent: string }>) =>
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  return (
    <form action={action} className="space-y-6" noValidate>
      <FormAlert state={state} />
      <FormSaved state={state} />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-3">
          {rows.map((row, index) => (
            <div key={index} className="flex gap-3">
              <div className="min-w-0 flex-1">
                <Select name={`services.${index}.slug`} value={row.slug} onChange={(event) => setRow(index, { slug: event.target.value })} aria-label={`Service ${index + 1}`}>
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
              <div className="relative w-24 shrink-0">
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
            {rows.length < MAX ? (
              <button
                type="button"
                onClick={() => setRows((current) => [...current, { slug: '', percent: '' }])}
                className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-accent hover:underline"
              >
                <Plus className="size-4" aria-hidden="true" />
                Add a service
              </button>
            ) : (
              <span />
            )}
            <p className={`text-sm font-medium ${total === 100 ? 'text-success' : 'text-brand'}`} aria-live="polite">
              Total: {total}%{total !== 100 && ' (must be 100%)'}
            </p>
          </div>
          {state.errors?.services && (
            <p role="alert" className="text-[13px] font-medium text-danger">
              {state.errors.services}
            </p>
          )}
        </div>
        <Donut
          caption="Preview"
          centre={`${rows.filter((row) => row.slug).length}`}
          slices={rows.filter((row) => row.slug).map((row) => ({ label: names.get(row.slug) ?? row.slug, value: Number(row.percent) || 0 }))}
        />
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
        <p className="text-sm text-ink-soft">Your profile shows on the directory page of every service listed here.</p>
        <SubmitButton pendingLabel="Saving…">Save services</SubmitButton>
      </div>
    </form>
  );
}
