/** Reads `?page=` safely: a whole number from 1 to 500, else 1. */
export function pageParam(value: string | string[] | undefined): number {
  const page = Number.parseInt(typeof value === 'string' ? value : '', 10);
  return Number.isFinite(page) && page >= 1 && page <= 500 ? page : 1;
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Canonical address and title suffix for a paginated list. Page 2 and later point at themselves
 * (filters left out), so search engines crawl and index the companies or posts listed there instead
 * of folding every page into page 1.
 */
export async function pagedCanonical(path: string, searchParams: SearchParams): Promise<{ canonical: string; suffix: string }> {
  const page = pageParam((await searchParams).page);
  return page > 1 ? { canonical: `${path}?page=${page}`, suffix: ` (page ${page})` } : { canonical: path, suffix: '' };
}
