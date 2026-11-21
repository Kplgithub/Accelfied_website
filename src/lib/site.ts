export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

const clean = (value: string | undefined) => (value ?? '').replace(/\/+$/, '');

/**
 * The account dashboard lives on its own subdomain per account type:
 * companies on NEXT_PUBLIC_VENDOR_URL, clients (hiring) on NEXT_PUBLIC_CLIENT_URL.
 * When only one is set, everyone uses it. When neither is set the dashboard stays on
 * SITE_URL (local development). Public pages always stay on SITE_URL.
 */
export const VENDOR_URL = clean(process.env.NEXT_PUBLIC_VENDOR_URL);
export const CLIENT_URL = clean(process.env.NEXT_PUBLIC_CLIENT_URL);

export type DashboardRole = 'provider' | 'client';

export function isDashboardPath(path: string): boolean {
  return path === '/dashboard' || path.startsWith('/dashboard/') || path.startsWith('/dashboard?');
}

/** The dashboard address for an account type, or '' when the dashboard stays on SITE_URL. */
export function dashboardBase(role: DashboardRole | null | undefined): string {
  if (role === 'client') return CLIENT_URL || VENDOR_URL;
  return VENDOR_URL || CLIENT_URL;
}

/**
 * A dashboard path as a full address on the right subdomain; any other path is returned as it is.
 * Without the account type it points at SITE_URL, where the proxy picks the subdomain.
 */
export function dashboardUrl(path: string, role?: DashboardRole | null): string {
  if (!isDashboardPath(path) || !(VENDOR_URL || CLIENT_URL)) return path;
  return `${role ? dashboardBase(role) : SITE_URL}${path}`;
}
