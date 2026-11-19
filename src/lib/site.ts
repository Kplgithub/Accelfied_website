export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

/**
 * Where the account dashboard lives, e.g. https://vendor.accelfied.com. Empty means it stays on
 * SITE_URL (local development). Public pages always stay on SITE_URL.
 */
export const VENDOR_URL = (process.env.NEXT_PUBLIC_VENDOR_URL ?? '').replace(/\/+$/, '');

export function isDashboardPath(path: string): boolean {
  return path === '/dashboard' || path.startsWith('/dashboard/') || path.startsWith('/dashboard?');
}

/** A dashboard path as a full vendor-subdomain address; any other path is returned as it is. */
export function dashboardUrl(path: string): string {
  return VENDOR_URL && isDashboardPath(path) ? `${VENDOR_URL}${path}` : path;
}
