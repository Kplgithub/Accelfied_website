export interface FormState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  /** Field errors keyed by the field's `name` attribute (dotted API path). */
  errors?: Record<string, string>;
  /** Values echoed back so the form keeps what the user typed after an error. */
  values?: Record<string, string>;
  /** Changes on every response so the form remounts with the echoed values. */
  nonce?: number;
}

export const initialFormState: FormState = { status: 'idle' };
