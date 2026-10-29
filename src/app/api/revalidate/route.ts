import { timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';

const TAG = /^[a-z0-9:_-]{1,200}$/i;

/**
 * Called by the API after a moderator publishes or changes something, so the
 * site shows it without waiting for cache lifetimes to run out.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const provided = request.headers.get('x-revalidate-secret') ?? '';
  if (!secret || provided.length !== secret.length || !timingSafeEqual(Buffer.from(provided), Buffer.from(secret))) {
    return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null;
  const tags = Array.isArray(body?.tags) ? body.tags.filter((tag): tag is string => typeof tag === 'string' && TAG.test(tag)) : [];
  if (!tags.length || tags.length > 50) return Response.json({ error: 'INVALID_TAGS' }, { status: 400 });

  for (const tag of tags) revalidateTag(tag, 'max');
  return Response.json({ revalidated: tags });
}
