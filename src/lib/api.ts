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

interface SendOptions {
  /** Session token of the signed-in visitor. */
  token?: string;
  /** Lets the API rate-limit by the visitor's address instead of the web server's. */
  clientIp?: string;
}

export async function apiPost<T>(path: string, body: unknown, options: SendOptions = {}): Promise<T> {
  return apiSend<T>('POST', path, body, options);
}

export async function apiSend<T>(
  method: 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body: unknown,
  { token, clientIp }: SendOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { accept: 'application/json' };
  if (body !== undefined) headers['content-type'] = 'application/json';
  if (token) headers.authorization = `Bearer ${token}`;
  if (clientIp) headers['x-forwarded-for'] = clientIp;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });
  return parse<T>(res);
}

/** Reads data that belongs to one signed-in visitor. Never cached. */
export async function apiPrivateGet<T>(path: string, token: string, query: Query = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}${toQueryString(query)}`, {
    headers: { accept: 'application/json', authorization: `Bearer ${token}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });
  return parse<T>(res);
}

async function parse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
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
