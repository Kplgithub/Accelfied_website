import 'server-only';
import { ApiError, apiPrivateGet } from './api';
import { requireUser } from './session';
import type {
  AuthoredReview,
  Billing,
  CompanyAnalytics,
  CompanyClaim,
  Conversation,
  Invoice,
  OwnedCompany,
  OwnedReview,
  Page,
  ReviewInvite,
  SavedCompany,
  SenderRole,
  Sponsorships,
  SentLead,
  Lead,
  Thread,
} from './types';

/**
 * Reads for the signed-in visitor's dashboard. Each call checks the session
 * and sends visitors without one to log in, then back to `returnTo`.
 */
export async function getMyCompany(returnTo: string): Promise<OwnedCompany | null> {
  const { token } = await requireUser(returnTo);
  return (await apiPrivateGet<{ company: OwnedCompany | null }>('/v1/me/company', token)).company;
}

export async function getMyCompanyLeads(returnTo: string, page = 1): Promise<Page<Lead>> {
  const { token } = await requireUser(returnTo);
  return apiPrivateGet<Page<Lead>>('/v1/me/company/leads', token, { page, limit: 10 });
}

export async function getMyCompanyReviews(returnTo: string, page = 1): Promise<Page<OwnedReview>> {
  const { token } = await requireUser(returnTo);
  return apiPrivateGet<Page<OwnedReview>>('/v1/me/company/reviews', token, { page, limit: 10 });
}

export async function getMyLeads(returnTo: string, page = 1): Promise<Page<SentLead>> {
  const { token } = await requireUser(returnTo);
  return apiPrivateGet<Page<SentLead>>('/v1/me/leads', token, { page, limit: 10 });
}

export async function getMyReviews(returnTo: string, page = 1): Promise<Page<AuthoredReview>> {
  const { token } = await requireUser(returnTo);
  return apiPrivateGet<Page<AuthoredReview>>('/v1/me/reviews', token, { page, limit: 10 });
}

export async function getMyClaims(returnTo: string): Promise<CompanyClaim[]> {
  const { token } = await requireUser(returnTo);
  return (await apiPrivateGet<{ claims: CompanyClaim[] }>('/v1/me/claims', token)).claims;
}

export async function getMyBilling(returnTo: string): Promise<Billing> {
  const { token } = await requireUser(returnTo);
  return apiPrivateGet<Billing>('/v1/me/billing', token);
}

export async function getMySponsorships(returnTo: string): Promise<Sponsorships> {
  const { token } = await requireUser(returnTo);
  return apiPrivateGet<Sponsorships>('/v1/me/sponsorships', token);
}

/** Null when the invoice is not this account's. */
export async function getMyInvoice(returnTo: string, id: string): Promise<Invoice | null> {
  const { token } = await requireUser(returnTo);
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  try {
    return (await apiPrivateGet<{ invoice: Invoice }>(`/v1/me/billing/invoices/${id}`, token)).invoice;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getMyConversations(returnTo: string, as: SenderRole, page = 1): Promise<Page<Conversation>> {
  const { token } = await requireUser(returnTo);
  return apiPrivateGet<Page<Conversation>>('/v1/me/conversations', token, { as, page, limit: 20 });
}

export async function getUnreadCounts(token: string): Promise<{ client: number; company: number }> {
  try {
    return await apiPrivateGet<{ client: number; company: number }>('/v1/me/conversations/unread', token);
  } catch {
    return { client: 0, company: 0 };
  }
}

/** Null when the conversation does not exist or is not this account's. */
export async function getThread(returnTo: string, id: string, before?: string): Promise<Thread | null> {
  const { token } = await requireUser(returnTo);
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  try {
    return await apiPrivateGet<Thread>(`/v1/me/conversations/${id}`, token, { before });
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) return null;
    throw error;
  }
}

export async function getMyShortlist(returnTo: string, page = 1): Promise<Page<SavedCompany>> {
  const { token } = await requireUser(returnTo);
  return apiPrivateGet<Page<SavedCompany>>('/v1/me/shortlist', token, { page, limit: 12 });
}

export async function getMyCompanyAnalytics(returnTo: string, days: number): Promise<CompanyAnalytics> {
  const { token } = await requireUser(returnTo);
  return apiPrivateGet<CompanyAnalytics>('/v1/me/company/analytics', token, { days });
}

export async function getMyReviewInvites(returnTo: string, page = 1): Promise<Page<ReviewInvite>> {
  const { token } = await requireUser(returnTo);
  return apiPrivateGet<Page<ReviewInvite>>('/v1/me/company/review-invites', token, { page, limit: 20 });
}
