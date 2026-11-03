import type { DirectoryQuery } from './data';
import { BUDGETS, HOURLY_RATES, INDUSTRIES, SORTS, TEAM_SIZES } from './labels';

type RawParams = Record<string, string | string[] | undefined>;

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
const allowed = <T extends string>(values: readonly T[], value: string | undefined) =>
  value && (values as readonly string[]).includes(value) ? (value as T) : undefined;

/**
 * Turns URL search params into an API query, silently dropping anything the
 * API would reject. Bad links still render a sensible page instead of an error.
 */
export function parseDirectoryParams(raw: RawParams, service?: string): DirectoryQuery {
  const country = one(raw.country)?.toUpperCase();
  const page = Number.parseInt(one(raw.page) ?? '1', 10);
  const q = one(raw.q);
  const minRating = one(raw.minRating);
  return {
    service,
    country: country && /^[A-Z]{2}$/.test(country) ? country : undefined,
    budget: allowed(BUDGETS.map((b) => b.value), one(raw.budget)),
    hourlyRate: allowed(HOURLY_RATES.map((r) => r.value), one(raw.hourlyRate)) ? [one(raw.hourlyRate)!] : undefined,
    teamSize: allowed(TEAM_SIZES.map((t) => t.value), one(raw.teamSize)) ? [one(raw.teamSize)!] : undefined,
    industry: allowed(INDUSTRIES, one(raw.industry)),
    minRating: minRating === '4' || minRating === '4.5' ? minRating : undefined,
    verified: one(raw.verified) === 'true' ? 'true' : undefined,
    q: q && q.length >= 2 ? q.slice(0, 100) : undefined,
    sort: allowed(SORTS.map((s) => s.value), one(raw.sort)),
    page: Number.isFinite(page) && page >= 1 && page <= 100 ? page : 1,
  };
}

export function hasActiveFilters(query: DirectoryQuery): boolean {
  return Boolean(
    query.country || query.budget || query.hourlyRate || query.teamSize || query.industry || query.minRating || query.verified || query.q,
  );
}
