'use client';

import { useActionState } from 'react';
import { updateBrief } from '@/app/brief-actions';
import { initialFormState } from '@/lib/form-state';
import { BUDGETS, TIMELINES } from '@/lib/labels';
import type { ProjectBrief } from '@/lib/types';
import { FormAlert, FormSaved, SubmitButton } from '../forms/form-bits';
import { formFields } from '../forms/use-form-fields';
import { Field, Input, Select, Textarea } from '../ui/field';


function Section({ id, title, hint, children }: { id: string; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-line pt-6 first:border-t-0 first:pt-0">
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      {hint && <p className="mt-1 text-sm text-ink-soft">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Every section of the written brief, editable before it goes to companies. */
export function BriefEditor({ brief, readOnly = false }: { brief: ProjectBrief; readOnly?: boolean }) {
  const [state, action] = useActionState(updateBrief, initialFormState);
  const { value, error } = formFields(state);
  const pick = (name: string, fallback: string) => (state.status === 'error' ? value(name) : fallback);
  return (
    <form key={state.nonce} action={action} className="space-y-6" noValidate>
      <input type="hidden" name="id" value={brief.id} />
      <FormAlert state={state} />
      <FormSaved state={state} />
      <fieldset disabled={readOnly} className="space-y-6">
        <Section id="key-information" title="Key information">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company" name="companyName" optional error={error('companyName')}>
              {(ids) => <Input id={ids.id} name="companyName" maxLength={120} defaultValue={pick('companyName', brief.companyName)} aria-describedby={ids.describedBy} />}
            </Field>
            <Field label="Service needed" name="service">
              {(ids) => <Input id={ids.id} value={brief.serviceName} readOnly aria-describedby={ids.describedBy} className="bg-paper" />}
            </Field>
            <Field label="Budget" name="budget" error={error('budget')}>
              {(ids) => (
                <Select id={ids.id} name="budget" defaultValue={pick('budget', brief.budget)} aria-describedby={ids.describedBy}>
                  {BUDGETS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field label="Start" name="timeline" error={error('timeline')}>
              {(ids) => (
                <Select id={ids.id} name="timeline" defaultValue={pick('timeline', brief.timeline)} aria-describedby={ids.describedBy}>
                  {TIMELINES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
        </Section>
        <Section id="introduction" title="Introduction" hint="Who you are and what you need, in your own words.">
          <Textarea name="introduction" rows={7} aria-label="Introduction" defaultValue={pick('introduction', brief.introduction)} aria-invalid={Boolean(error('introduction'))} />
          {error('introduction') && <p className="mt-1 text-[13px] font-medium text-danger">{error('introduction')}</p>}
        </Section>
        <Section id="objectives" title="Objectives" hint="One per line. What success looks like.">
          <Textarea name="objectives" rows={5} aria-label="Objectives, one per line" defaultValue={pick('objectives', brief.objectives.join('\n'))} />
        </Section>
        <Section id="deliverables" title="Key deliverables" hint="One per line. What you expect to receive.">
          <Textarea name="deliverables" rows={5} aria-label="Deliverables, one per line" defaultValue={pick('deliverables', brief.deliverables.join('\n'))} />
        </Section>
        <Section id="questions" title="Questions for companies" hint="One per line. Each company answers these when they reply.">
          <Textarea name="questions" rows={5} aria-label="Questions, one per line" defaultValue={pick('questions', brief.questions.join('\n'))} />
        </Section>
        <Section id="additional" title="Additional requirements" hint="Optional. Anything else companies should know, like languages, tools or deadlines.">
          <Textarea name="additionalRequirements" rows={3} maxLength={2000} aria-label="Additional requirements" defaultValue={pick('additionalRequirements', brief.additionalRequirements)} />
        </Section>
      </fieldset>
      {!readOnly && (
        <div className="flex justify-end">
          <SubmitButton variant="secondary" pendingLabel="Saving…">
            Save changes
          </SubmitButton>
        </div>
      )}
    </form>
  );
}
