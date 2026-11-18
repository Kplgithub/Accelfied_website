import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/session';

const API_URL = (process.env.API_URL ?? 'http://localhost:4000').replace(/\/+$/, '');
const KINDS = new Set(['logo', 'portfolio', 'team']);
const MAX_BYTES = 5 * 1024 * 1024 + 64 * 1024;

/**
 * Passes a picture from the signed-in visitor's browser to the API, which
 * checks, resizes and stores it, and answers with its address.
 */
export async function POST(request: Request) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return Response.json({ message: 'Please log in again to upload.' }, { status: 401 });
  const kind = new URL(request.url).searchParams.get('kind') ?? '';
  if (!KINDS.has(kind)) return Response.json({ message: 'Unknown upload type.' }, { status: 400 });
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > MAX_BYTES) return Response.json({ message: 'Use a picture under 5 MB.' }, { status: 413 });

  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File) || file.size === 0) return Response.json({ message: 'Choose a picture to upload.' }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return Response.json({ message: 'Use a picture under 5 MB.' }, { status: 413 });

  const body = new FormData();
  body.set('file', file, file.name || 'upload');
  const res = await fetch(`${API_URL}/v1/me/uploads?kind=${kind}`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}` },
    body,
    cache: 'no-store',
    signal: AbortSignal.timeout(30_000),
  }).catch(() => null);
  if (!res) return Response.json({ message: 'Upload failed. Please try again.' }, { status: 502 });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return Response.json({ message: data.message ?? 'Upload failed. Please try again.' }, { status: res.status });
  return Response.json({ url: data.url }, { status: 201 });
}
