import 'server-only';

const API_URL = (process.env.API_URL ?? 'http://localhost:4000').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly issues: Array<{ path: string; message: string }> = [],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type Query = Record<string, string | number | boolean | string[] | undefined>;

export function toQueryString(query: Query): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === '') continue;
    if (Array.isArray(value)) {
      if (value.length) params.set(key, value.join(','));
    } else {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function apiGet<T>(path: string, query: Query = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}${toQueryString(query)}`, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(10_000),
  });
  return parse<T>(res);
}

export async function apiPost<T>(path: string, body: unknown, clientIp?: string): Promise<T> {
  const headers: Record<string, string> = { 'content-type': 'application/json', accept: 'application/json' };
  // Lets the API rate-limit by the visitor's address instead of the web server's.
  if (clientIp) headers['x-forwarded-for'] = clientIp;
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });
  return parse<T>(res);
}

async function parse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(
      res.status,
      body?.error ?? 'HTTP_ERROR',
      body?.message ?? `Request failed with ${res.status}`,
      Array.isArray(body?.issues) ? body.issues : [],
    );
  }
  return body as T;
}
