'use client';

import { MapPin, Plus, Trash2 } from 'lucide-react';
import { useActionState, useState } from 'react';
import { saveLocations } from '@/app/profile-section-actions';
import { COUNTRIES } from '@/lib/countries';
import { initialFormState } from '@/lib/form-state';
import type { OwnedCompany } from '@/lib/types';
import { FormAlert, FormSaved, SubmitButton } from '../../forms/form-bits';
import { Input, Select } from '../../ui/field';

interface Place {
  city: string;
  region: string;
  countryCode: string;
}

const MAX_OTHERS = 20;

function PlaceRow({ prefix, place, onChange, onRemove, label }: { prefix: string; place: Place; onChange: (patch: Partial<Place>) => void; onRemove?: () => void; label: string }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-line bg-paper/60 p-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
      <Input name={`${prefix}.city`} value={place.city} onChange={(event) => onChange({ city: event.target.value })} placeholder="City" aria-label={`${label}: city`} autoComplete="address-level2" />
      <Input name={`${prefix}.region`} value={place.region} onChange={(event) => onChange({ region: event.target.value })} placeholder="State or region" aria-label={`${label}: state or region`} />
      <Select name={`${prefix}.countryCode`} value={place.countryCode} onChange={(event) => onChange({ countryCode: event.target.value })} aria-label={`${label}: country`}>
        <option value="" disabled>
          Country
        </option>
        {COUNTRIES.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </Select>
      {onRemove ? (
        <button type="button" onClick={onRemove} className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl text-ink-soft hover:bg-ink/5 hover:text-danger" aria-label={`Remove ${label}`}>
          <Trash2 className="size-4" />
        </button>
      ) : (
        <span className="hidden size-11 sm:block" />
      )}
    </div>
  );
}

export function LocationsForm({ company }: { company: OwnedCompany }) {
  const [state, action] = useActionState(saveLocations, initialFormState);
  const toPlace = (location: { city: string; region?: string; countryCode: string }) => ({ city: location.city, region: location.region ?? '', countryCode: location.countryCode });
  const [hq, setHq] = useState<Place>(() => toPlace(company.headquarters));
  const [others, setOthers] = useState<Place[]>(() =>
    company.locations
      .filter((location) => !(location.city === company.headquarters.city && location.countryCode === company.headquarters.countryCode))
      .map(toPlace),
  );
  const issues = Object.entries(state.errors ?? {});
  return (
    <form action={action} className="space-y-6" noValidate>
      <FormAlert state={state} />
      <FormSaved state={state} />
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
          <MapPin className="size-4 text-brand" aria-hidden="true" />
          Headquarters
        </h3>
        <PlaceRow prefix="headquarters" place={hq} label="headquarters" onChange={(patch) => setHq((current) => ({ ...current, ...patch }))} />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Other offices</h3>
        <div className="space-y-3">
          {others.map((place, index) => (
            <PlaceRow
              key={index}
              prefix={`otherLocations.${index}`}
              place={place}
              label={`office ${index + 1}`}
              onChange={(patch) => setOthers((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)))}
              onRemove={() => setOthers((current) => current.filter((_, i) => i !== index))}
            />
          ))}
        </div>
        {others.length < MAX_OTHERS && (
          <button
            type="button"
            onClick={() => setOthers((current) => [...current, { city: '', region: '', countryCode: '' }])}
            className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add an office
          </button>
        )}
      </div>
      {issues.length > 0 && (
        <p role="alert" className="text-[13px] font-medium text-danger">
          Check each office has a city and a country.
        </p>
      )}
      <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
        <p className="text-sm text-ink-soft">You show on the city and country pages of every office.</p>
        <SubmitButton pendingLabel="Saving…">Save locations</SubmitButton>
      </div>
    </form>
  );
}
