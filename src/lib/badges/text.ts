import 'server-only';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import opentype from 'opentype.js';
import type { TextRenderer, TextStyle } from './art';

/**
 * Badge text is drawn as outlines from Sora (the logo font, OFL licence), so a badge looks
 * the same on every website and in every PNG without loading a font. Latin only: a character
 * the font lacks falls back to a plain sans-serif <text> element.
 */
const FONT_DIR = join(process.cwd(), 'src/lib/badges/fonts');
let fonts: Record<600 | 700, opentype.Font> | null = null;

function load(): Record<600 | 700, opentype.Font> {
  if (!fonts) {
    const read = (file: string) => {
      const buffer = readFileSync(join(FONT_DIR, file));
      return opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
    };
    fonts = { 600: read('sora-latin-600-normal.woff'), 700: read('sora-latin-700-normal.woff') };
  }
  return fonts;
}

function supported(font: opentype.Font, value: string): boolean {
  for (const char of value) if (char !== ' ' && font.charToGlyph(char).index === 0) return false;
  return true;
}

const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const soraText: TextRenderer = {
  width(value: string, style: TextStyle): number {
    const font = load()[style.weight ?? 700];
    const tracking = (style.tracking ?? 0) * style.size;
    return font.getAdvanceWidth(value, style.size) + tracking * Math.max(0, [...value].length - 1);
  },
  draw(value: string, x: number, y: number, style: TextStyle): string {
    const font = load()[style.weight ?? 700];
    const width = this.width(value, style);
    const start = style.anchor === 'middle' ? x - width / 2 : style.anchor === 'end' ? x - width : x;
    if (!supported(font, value)) {
      return `<text x="${start.toFixed(1)}" y="${y.toFixed(1)}" font-family="Sora, 'Helvetica Neue', Arial, sans-serif" font-weight="${style.weight ?? 700}" font-size="${style.size}" letter-spacing="${((style.tracking ?? 0) * style.size).toFixed(2)}" fill="${style.fill}">${escapeXml(value)}</text>`;
    }
    const d = font.getPath(value, start, y, style.size, { kerning: true, letterSpacing: style.tracking ?? 0 }).toPathData(1);
    return d ? `<path d="${d}" fill="${style.fill}"/>` : '';
  },
};
