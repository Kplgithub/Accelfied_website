'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { ApiError, apiSend } from '@/lib/api';
import type { FormState } from '@/lib/form-state';
import { getSessionToken } from '@/lib/session';
import { dashboardUrl } from '@/lib/site';
import { clientIp, echo, friendly, submit, text } from '@/lib/submit';

const ID = /^[a-f\d]{24}$/i;

/** A client's first message to a company. Opens the conversation on success. */
export async function startConversation(_prev: FormState, form: FormData): Promise<FormState> {
  const companySlug = text(form, 'companySlug');
  const body = text(form, 'body');
  const token = await getSessionToken();
  if (!token) return { status: 'error', message: 'Please log in again to continue.', values: echo(form), nonce: Date.now() };
  let id: string;
  try {
    ({ id } = await apiSend<{ id: string }>('POST', '/v1/me/conversations', { companySlug, body }, { token, clientIp: await clientIp() }));
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.status === 400 && error.issues.length
          ? friendly(error.issues[0]!.message)
          : error.status === 429
            ? 'You have sent a lot of messages. Please wait a little and try again.'
            : error.message
        : 'We could not send your message right now. Please try again in a moment.';
    if (!(error instanceof ApiError)) console.error('Starting a conversation failed', error);
    return { status: 'error', message, errors: body ? {} : { body: 'Write a message' }, values: echo(form), nonce: Date.now() };
  }
  redirect(dashboardUrl(`/dashboard/messages/${id}`));
}

export async function sendMessage(_prev: FormState, form: FormData): Promise<FormState> {
  const id = text(form, 'conversationId');
  if (!ID.test(id)) return { status: 'error', message: 'This conversation could not be found.', nonce: Date.now() };
  const state = await submit(`/v1/me/conversations/${id}/messages`, { body: text(form, 'body') }, form, 'Sent');
  if (state.status === 'success') refresh();
  return state;
}
