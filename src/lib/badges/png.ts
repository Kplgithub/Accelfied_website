import 'server-only';
import { createHash } from 'node:crypto';
import { Resvg } from '@resvg/resvg-js';

/** Rendered PNGs, newest last. Rendering a 2048px badge takes tens of milliseconds, so repeats come from memory. */
const cache = new Map<string, Uint8Array>();
const MAX_ENTRIES = 80;

/** PNG of an SVG at `width` pixels wide, transparent where the SVG has no fill. */
export function svgToPng(svg: string, width: number): Uint8Array {
  const key = `${width}:${createHash('sha1').update(svg).digest('base64url')}`;
  const hit = cache.get(key);
  if (hit) {
    cache.delete(key);
    cache.set(key, hit);
    return hit;
  }
  const png = new Uint8Array(new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: { loadSystemFonts: false } }).render().asPng());
  cache.set(key, png);
  if (cache.size > MAX_ENTRIES) cache.delete(cache.keys().next().value!);
  return png;
}
