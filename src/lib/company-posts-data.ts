import 'server-only';
import { ApiError, apiPrivateGet } from './api';
import type { CompanyPostFull, CompanyPostOverview } from './company-posts';
import { requireUser } from './session';

/** The signed-in company's blog posts and the price per post. */
export async function getMyCompanyPosts(returnTo: string): Promise<CompanyPostOverview> {
  const { token } = await requireUser(returnTo);
  return apiPrivateGet<CompanyPostOverview>('/v1/me/company-posts', token);
}

/** Null when the post is not this company's. */
export async function getMyCompanyPost(returnTo: string, id: string): Promise<CompanyPostFull | null> {
  const { token } = await requireUser(returnTo);
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  try {
    return (await apiPrivateGet<{ post: CompanyPostFull }>(`/v1/me/company-posts/${id}`, token)).post;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
