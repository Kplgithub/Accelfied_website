import 'server-only';
import { cache } from 'react';
import { apiPrivateGet } from './api';
import { getSessionToken } from './session';
import type { Billing } from './types';
import { PAYING_STATUSES } from './verified-plan';

/**
 * Where a company without the Verified badge stands. The badge needs both a paying plan and
 * business details approved by our team, so a company that has paid can still be waiting.
 * - pay: no paying plan yet
 * - details: paid, business details not sent yet
 * - review: details sent, our team is checking them (or approval is being applied)
 * - rejected: our team could not verify the details; they need correcting
 */
export type VerifyStage = 'pay' | 'details' | 'review' | 'rejected';

export function verifyStage(billing: Pick<Billing, 'subscription' | 'verification'>): VerifyStage {
  const paying = Boolean(billing.subscription && (PAYING_STATUSES as readonly string[]).includes(billing.subscription.status));
  if (!paying) return 'pay';
  if (!billing.verification) return 'details';
  if (billing.verification.status === 'rejected') return 'rejected';
  return 'review';
}

/** The signed-in owner's stage, one billing call per request. Falls back to "pay" if billing cannot be read. */
export const myVerifyStage = cache(async (): Promise<VerifyStage> => {
  const token = await getSessionToken();
  if (!token) return 'pay';
  try {
    return verifyStage(await apiPrivateGet<Billing>('/v1/me/billing', token));
  } catch (error) {
    console.error('Loading billing for the verification stage failed', error);
    return 'pay';
  }
});

export const PLAN_PAGE = '/dashboard/company/verified';

/** What to tell a company that has paid but is not verified yet. */
export const STAGE_COPY: Record<Exclude<VerifyStage, 'pay'>, { title: string; text: string; action: string }> = {
  details: {
    title: 'One step left to get Verified',
    text: 'Your payment is received. Share your business details so our team can verify your company. Your Verified badge and badge downloads unlock as soon as they approve.',
    action: 'Add business details',
  },
  review: {
    title: 'Your verification is in review',
    text: 'Your payment is received and our team is checking your business details. Your Verified badge and badge downloads unlock as soon as they approve.',
    action: 'View status',
  },
  rejected: {
    title: 'Your details need a fix',
    text: 'Our team could not verify the business details you sent. Please correct them and send again to unlock your Verified badge.',
    action: 'Fix details',
  },
};
