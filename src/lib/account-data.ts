import 'server-only';
import { ApiError, apiPrivateGet } from './api';
import { requireUser } from './session';
import type { AuthoredReview, Billing, CompanyClaim, Invoice, OwnedCompany, OwnedReview, Page, SentLead, Lead } from './types';

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
