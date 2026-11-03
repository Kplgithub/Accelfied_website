import type { FormState } from '@/lib/form-state';

/** Helpers to wire a field to the last server response: its echoed value and its error. */
export function formFields(state: FormState) {
  return {
    value: (name: string) => state.values?.[name] ?? '',
    error: (name: string) => state.errors?.[name],
    checked: (name: string) => state.values?.[name] === 'on',
  };
}
