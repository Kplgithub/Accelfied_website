/** Reads `?page=` safely: a whole number from 1 to 500, else 1. */
export function pageParam(value: string | string[] | undefined): number {
  const page = Number.parseInt(typeof value === 'string' ? value : '', 10);
  return Number.isFinite(page) && page >= 1 && page <= 500 ? page : 1;
}
