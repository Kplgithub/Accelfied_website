import { MARK_ARROW_BOTTOM, MARK_ARROW_TOP, MARK_TILE, WORDMARK_DOT, WORDMARK_PATH } from '@/components/layout/brand-mark';

/**
 * Accelfied's own badge artwork, drawn as plain SVG strings.
 *
 * Shape language comes from the logo: the rounded red tile and its rising chevrons.
 * - Seal (Verified, Premier Verified): an eight-point rosette made of two rounded tiles,
 *   one turned 45 degrees. Premier adds a red rosette behind it, turned 22.5 degrees.
 * - Award (Top {service} company): a tall rounded tile with two ribbon tails.
 * - Compact: a small horizontal pill for website footers.
 * - Banner: wide and square images for social posts and websites.
 *
 * Text goes through a TextRenderer so the server can outline it with the logo font.
 */

export type Theme = 'light' | 'dark';

export interface TextStyle {
  size: number;
  weight?: 600 | 700;
  /** Extra space between letters, as a fraction of the font size. */
  tracking?: number;
  fill: string;
  anchor?: 'start' | 'middle' | 'end';
}

export interface TextRenderer {
  width(value: string, style: TextStyle): number;
  draw(value: string, x: number, y: number, style: TextStyle): string;
}

export const COLORS = {
  red: '#C7362F',
  redDeep: '#9E2A24',
  teal: '#17313B',
  tealDeep: '#0D2028',
  blue: '#1B7499',
  blueSoft: '#8CCBE2',
  paper: '#F7F9FA',
  white: '#FFFFFF',
  ink: '#17313B',
  inkSoft: '#4A5F68',
  line: '#D5DEE2',
} as const;

export interface Art {
  width: number;
  height: number;
  /** SVG markup without the outer <svg> element, so it can be placed inside a banner. */
  body: string;
}

const n = (value: number) => (Math.round(value * 10) / 10).toString();

/** A rounded square of half-width `half` around (cx, cy), turned by `deg`, with corner radius `r`. */
function roundedSquare(cx: number, cy: number, half: number, r: number, deg: number): string {
  const rad = (deg * Math.PI) / 180;
  const rot = (x: number, y: number) => [cx + x * Math.cos(rad) - y * Math.sin(rad), cy + x * Math.sin(rad) + y * Math.cos(rad)];
  const h = half;
  const pts: Array<[number, number, number, number, number, number]> = [
    // start of edge, corner end of edge, then where the next edge starts
    [-h + r, -h, h - r, -h, h, -h + r],
    [h, -h + r, h, h - r, h - r, h],
    [h - r, h, -h + r, h, -h, h - r],
    [-h, h - r, -h, -h + r, -h + r, -h],
  ];
  const corners: Array<[number, number]> = [
    [h, -h],
    [h, h],
    [-h, h],
    [-h, -h],
  ];
  let d = '';
  pts.forEach(([sx, sy, ex, ey, nx, ny], i) => {
    const [ax, ay] = rot(sx, sy);
    const [bx, by] = rot(ex, ey);
    const [qx, qy] = rot(...corners[i]);
    const [cx2, cy2] = rot(nx, ny);
    d += `${i === 0 ? 'M' : 'L'}${n(ax)} ${n(ay)}L${n(bx)} ${n(by)}Q${n(qx)} ${n(qy)} ${n(cx2)} ${n(cy2)}`;
  });
  return `${d}Z`;
}

/** Eight-point rosette: two rounded squares, the second turned 45 degrees. */
export function rosettePath(cx: number, cy: number, half: number, r: number, turn = 0): string {
  return roundedSquare(cx, cy, half, r, turn) + roundedSquare(cx, cy, half, r, turn + 45);
}

/** The red logo tile with its two chevrons, `size` wide, top-left at (x, y). */
export function logoTile(x: number, y: number, size: number, tile: string = COLORS.red, arrows: string = COLORS.white): string {
  const s = size / 64;
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${s.toFixed(4)})"><path d="${MARK_TILE}" fill="${tile}"/><path d="${MARK_ARROW_TOP}" fill="none" stroke="${arrows}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="${MARK_ARROW_BOTTOM}" fill="none" stroke="${arrows}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-opacity=".6"/></g>`;
}

/** Wordmark box in brand-mark units: letters run from x 81.4 to 262.6, cap height about y 16.5 to 46.8. */
const WM = { left: 81.4, right: 262.6, top: 16.5, baseline: 46 } as const;
export const WORDMARK_RATIO = (WM.right - WM.left) / (WM.baseline - WM.top);

/** "accelfied" wordmark with its red i-dot, `height` tall (ascender to baseline), with its left edge at x and baseline at y. */
export function wordmark(x: number, baseline: number, height: number, fill: string): { svg: string; width: number } {
  const s = height / (WM.baseline - WM.top);
  const tx = x - WM.left * s;
  const ty = baseline - WM.baseline * s;
  return {
    width: (WM.right - WM.left) * s,
    svg: `<g transform="translate(${n(tx)} ${n(ty)}) scale(${s.toFixed(4)})"><path d="${WORDMARK_PATH}" fill="${fill}"/><circle cx="${WORDMARK_DOT.cx}" cy="${WORDMARK_DOT.cy}" r="${WORDMARK_DOT.r}" fill="${COLORS.red}"/></g>`,
  };
}

/** Check mark inside a mini rosette, for compact badges and site pills. */
export function checkPath(cx: number, cy: number, size: number): string {
  const u = size / 24;
  return `M${n(cx - 6 * u)} ${n(cy + 0.4 * u)}L${n(cx - 1.8 * u)} ${n(cy + 4.4 * u)}L${n(cx + 6.4 * u)} ${n(cy - 4.6 * u)}`;
}

/* ------------------------------------------------------------------ seal */

export type SealKind = 'verified' | 'premier';

export function sealArt(kind: SealKind, theme: Theme, text: TextRenderer): Art {
  const S = 512;
  const c = S / 256 / 2; // 1 at 512
  const cx = 256 * c;
  const dark = theme === 'dark';
  const premier = kind === 'premier';
  const rosette = dark ? COLORS.paper : COLORS.teal;
  const disk = dark ? COLORS.teal : COLORS.white;
  const diskEdge = dark ? COLORS.tealDeep : COLORS.paper;
  const ring = premier ? COLORS.red : COLORS.blue;
  const title = dark ? COLORS.white : COLORS.teal;
  const parts: string[] = [];
  parts.push(`<defs><radialGradient id="sd" cx="50%" cy="38%" r="62%"><stop offset="0" stop-color="${disk}"/><stop offset="1" stop-color="${diskEdge}"/></radialGradient></defs>`);
  if (premier) parts.push(`<path d="${rosettePath(cx, cx, 180, 44, 22.5)}" fill="${COLORS.red}"/>`);
  parts.push(`<path d="${rosettePath(cx, cx, premier ? 174 : 182, 46)}" fill="${rosette}"/>`);
  parts.push(`<circle cx="${cx}" cy="${cx}" r="${premier ? 166 : 172}" fill="none" stroke="${dark ? COLORS.teal : COLORS.white}" stroke-opacity=".18" stroke-width="2" stroke-dasharray="2 7" stroke-linecap="round"/>`);
  parts.push(`<circle cx="${cx}" cy="${cx}" r="${premier ? 156 : 160}" fill="url(#sd)"/>`);
  parts.push(`<circle cx="${cx}" cy="${cx}" r="${premier ? 145 : 148}" fill="none" stroke="${ring}" stroke-width="5"/>`);
  parts.push(`<circle cx="${cx}" cy="${cx}" r="${premier ? 136 : 139}" fill="none" stroke="${ring}" stroke-width="1.5" stroke-opacity=".45"/>`);
  const markColor = dark ? COLORS.white : COLORS.teal;
  if (premier) {
    parts.push(logoTile(cx - 25, 136, 50));
    parts.push(text.draw('PREMIER', cx, 222, { size: 20, weight: 700, tracking: 0.3, fill: COLORS.red, anchor: 'middle' }));
    parts.push(text.draw('VERIFIED', cx, 270, { size: 46, weight: 700, tracking: 0.04, fill: title, anchor: 'middle' }));
  } else {
    parts.push(logoTile(cx - 27, 140, 54));
    parts.push(text.draw('VERIFIED', cx, 266, { size: 50, weight: 700, tracking: 0.04, fill: title, anchor: 'middle' }));
  }
  // Divider with a small rising chevron in the middle.
  const dy = 296;
  const lineColor = dark ? 'rgba(255,255,255,.28)' : COLORS.line;
  parts.push(`<path d="M${cx - 84} ${dy}H${cx - 18}M${cx + 18} ${dy}H${cx + 84}" stroke="${lineColor}" stroke-width="2" stroke-linecap="round"/>`);
  parts.push(`<path d="M${cx - 9} ${dy + 4}L${cx} ${dy - 5}L${cx + 9} ${dy + 4}" fill="none" stroke="${ring}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`);
  const markW = 24 * WORDMARK_RATIO;
  parts.push(wordmark(cx - markW / 2, 346, 24, markColor).svg);
  return { width: S, height: S, body: parts.join('') };
}

/* ----------------------------------------------------------------- award */

export interface AwardText {
  /** Service name, such as "Web Development". */
  service: string;
  /** "Jaipur" or "India". */
  place: string;
  year: number;
}

/** Splits a service name into at most two lines that fit `max` at `size`, shrinking the size when needed. */
function fitLines(value: string, max: number, size: number, minSize: number, text: TextRenderer): { lines: string[]; size: number } {
  const words = value.split(/\s+/).filter(Boolean);
  for (let s = size; s >= minSize; s -= 2) {
    const style = { size: s, weight: 700 as const, fill: '#000' };
    if (text.width(value, style) <= max) return { lines: [value], size: s };
    for (let cut = 1; cut < words.length; cut++) {
      const a = words.slice(0, cut).join(' ');
      const b = words.slice(cut).join(' ');
      if (text.width(a, style) <= max && text.width(b, style) <= max) return { lines: [a, b], size: s };
    }
  }
  return { lines: [value], size: minSize };
}

function fitSize(value: string, max: number, size: number, style: Omit<TextStyle, 'size'>, text: TextRenderer): number {
  const width = text.width(value, { ...style, size });
  return width <= max ? size : Math.max(10, Math.floor((size * max) / width));
}

export function awardArt(award: AwardText, theme: Theme, text: TextRenderer, idPrefix = 'a'): Art {
  const W = 440;
  const H = 540;
  const dark = theme === 'dark';
  const cx = W / 2;
  const tile = { x: 40, y: 20, w: 360, h: 420, r: 64 };
  const face = dark ? COLORS.teal : COLORS.white;
  const cap = dark ? COLORS.tealDeep : COLORS.teal;
  const edge = dark ? COLORS.paper : COLORS.teal;
  const ink = dark ? COLORS.white : COLORS.teal;
  const soft = dark ? COLORS.blueSoft : COLORS.blue;
  const clip = `${idPrefix}c`;
  const parts: string[] = [];
  // Ribbon tails behind the tile.
  const tail = (x: number, turn: number) =>
    `<path transform="rotate(${turn} ${x + 32} 400)" d="M${x} 380H${x + 64}V520L${x + 32} 494L${x} 520Z" fill="${COLORS.red}"/><path transform="rotate(${turn} ${x + 32} 400)" d="M${x} 380H${x + 64}V420H${x}Z" fill="${COLORS.redDeep}"/>`;
  parts.push(tail(118, 9), tail(258, -9));
  parts.push(`<defs><clipPath id="${clip}"><rect x="${tile.x}" y="${tile.y}" width="${tile.w}" height="${tile.h}" rx="${tile.r}"/></clipPath></defs>`);
  parts.push(`<rect x="${tile.x}" y="${tile.y}" width="${tile.w}" height="${tile.h}" rx="${tile.r}" fill="${face}"/>`);
  parts.push(`<g clip-path="url(#${clip})">`);
  // Top cap with the logo.
  parts.push(`<rect x="${tile.x}" y="${tile.y}" width="${tile.w}" height="96" fill="${cap}"/>`);
  const mark = wordmark(0, 0, 26, COLORS.white);
  const groupW = 40 + 12 + mark.width;
  const gx = cx - groupW / 2;
  parts.push(logoTile(gx, 48, 40));
  parts.push(wordmark(gx + 52, 78, 26, COLORS.white).svg);
  // Bottom band with the place and year.
  parts.push(`<rect x="${tile.x}" y="356" width="${tile.w}" height="84" fill="${COLORS.red}"/>`);
  parts.push(`</g>`);
  parts.push(`<rect x="${tile.x + 4}" y="${tile.y + 4}" width="${tile.w - 8}" height="${tile.h - 8}" rx="${tile.r - 4}" fill="none" stroke="${edge}" stroke-width="8"/>`);

  // TOP / service / COMPANY
  const fit = fitLines(award.service, 290, 42, 24, text);
  const lineGap = fit.size * 1.12;
  const blockTop = 142;
  parts.push(text.draw('TOP', cx, blockTop + 18, { size: 20, weight: 700, tracking: 0.36, fill: soft, anchor: 'middle' }));
  const serviceTop = blockTop + 30;
  const bodyH = fit.lines.length * lineGap;
  // Centre the service lines between TOP and COMPANY.
  const firstBaseline = serviceTop + (fit.lines.length === 1 ? 62 : 16) + fit.size * 0.8;
  fit.lines.forEach((line, i) => parts.push(text.draw(line, cx, firstBaseline + i * lineGap, { size: fit.size, weight: 700, fill: ink, anchor: 'middle' })));
  const companyY = Math.max(firstBaseline + (fit.lines.length - 1) * lineGap + 44, serviceTop + bodyH + 40);
  parts.push(text.draw('COMPANY', cx, Math.min(companyY, 330), { size: 20, weight: 700, tracking: 0.36, fill: soft, anchor: 'middle' }));
  // Small chevrons either side of COMPANY? Keep it clean: a short rule above the band.
  const band = `${award.place.toUpperCase()}  ${award.year}`;
  const bandStyle = { weight: 700 as const, tracking: 0.14, fill: COLORS.white, anchor: 'middle' as const };
  parts.push(text.draw(band, cx, 410, { ...bandStyle, size: fitSize(band, 300, 28, bandStyle, text) }));
  return { width: W, height: H, body: parts.join('') };
}

/* --------------------------------------------------------------- compact */

export interface CompactText {
  kind: SealKind;
  rating: { average: number; count: number };
}

/** Mini rosette with a check, as used in the compact badge and the site's Verified pill. */
export function miniSeal(cx: number, cy: number, size: number, kind: SealKind): string {
  const k = size / 24;
  const back = kind === 'premier' ? `<path d="${rosettePath(cx, cy, 8.6 * k, 2.4 * k, 22.5)}" fill="${COLORS.red}" fill-opacity=".45"/>` : '';
  const fill = kind === 'premier' ? COLORS.red : COLORS.blue;
  return `${back}<path d="${rosettePath(cx, cy, 8.2 * k, 2.4 * k)}" fill="${fill}"/><path d="${checkPath(cx, cy, size * 0.78)}" fill="none" stroke="#fff" stroke-width="${n(2.6 * k)}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

export function compactArt(badge: CompactText, theme: Theme, text: TextRenderer): Art {
  const W = 300;
  const H = 96;
  const dark = theme === 'dark';
  const parts: string[] = [];
  parts.push(`<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="20" fill="${dark ? COLORS.teal : COLORS.white}" stroke="${dark ? 'rgba(255,255,255,.18)' : COLORS.line}" stroke-width="2"/>`);
  parts.push(miniSeal(52, 48, 64, badge.kind));
  const label = badge.kind === 'premier' ? 'PREMIER VERIFIED' : 'VERIFIED';
  const rated = badge.rating.count > 0;
  const top = rated ? 32 : 40;
  parts.push(text.draw(label, 96, top, { size: 13, weight: 700, tracking: 0.16, fill: badge.kind === 'premier' ? COLORS.red : dark ? COLORS.blueSoft : COLORS.blue }));
  const on = text.draw('on', 96, top + 30, { size: 17, weight: 600, fill: dark ? COLORS.blueSoft : COLORS.inkSoft });
  const onW = text.width('on', { size: 17, weight: 600, fill: '' });
  parts.push(on, wordmark(96 + onW + 7, top + 30, 22, dark ? COLORS.white : COLORS.teal).svg);
  if (rated) {
    const value = badge.rating.average.toFixed(1);
    const reviews = `${badge.rating.count} ${badge.rating.count === 1 ? 'review' : 'reviews'}`;
    const style = { size: 14, weight: 700 as const, fill: dark ? COLORS.white : COLORS.teal };
    parts.push(text.draw(value, 96, top + 52, style));
    const vx = 96 + text.width(value, style) + 6;
    parts.push(starPath(vx + 7, top + 47, 7.5, '#F0A531'));
    parts.push(text.draw(reviews, vx + 20, top + 52, { size: 14, weight: 600, fill: dark ? COLORS.blueSoft : COLORS.inkSoft }));
  }
  return { width: W, height: H, body: parts.join('') };
}

function starPath(cx: number, cy: number, r: number, fill: string): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.45;
    pts.push(`${n(cx + rr * Math.cos(rad))} ${n(cy + rr * Math.sin(rad))}`);
  }
  return `<path d="M${pts.join('L')}Z" fill="${fill}"/>`;
}

/* ---------------------------------------------------------------- banner */

export type BannerLayout = 'wide' | 'square';

export interface BannerText {
  company: string;
  /** Headline, such as "Premier Verified" or "Top Web Development Company". Parts can be coloured. */
  headline: Array<{ text: string; accent?: boolean }>;
  /** Text before the wordmark on the second line, such as "on" or "in Jaipur, 2026 on". */
  lead: string;
  /** One line of real data, such as "Rated 4.9 out of 5 in 14 client reviews". Empty to leave out. */
  sub: string;
  url: string;
}

function chevronPattern(W: number, H: number, theme: Theme, seed: number): string {
  // Fixed pseudo-random layout so the same banner always renders the same way.
  let x = seed;
  const rand = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  const out: string[] = [];
  const count = Math.round((W * H) / 26000);
  for (let i = 0; i < count; i++) {
    const px = rand() * W;
    const py = rand() * H;
    const s = 10 + rand() * 18;
    const red = rand() < 0.22;
    const color = theme === 'dark' ? (red ? COLORS.red : COLORS.white) : red ? COLORS.red : COLORS.blue;
    const opacity = (theme === 'dark' ? 0.05 : 0.06) + rand() * 0.05;
    out.push(`<path d="M${n(px - s)} ${n(py + s * 0.5)}L${n(px)} ${n(py - s * 0.5)}L${n(px + s)} ${n(py + s * 0.5)}" fill="none" stroke="${color}" stroke-opacity="${opacity.toFixed(2)}" stroke-width="${n(s * 0.32)}" stroke-linecap="round" stroke-linejoin="round"/>`);
  }
  return out.join('');
}

export function bannerArt(layout: BannerLayout, art: Art, copy: BannerText, theme: Theme, text: TextRenderer): Art {
  const dark = theme === 'dark';
  const W = layout === 'wide' ? 1200 : 1080;
  const H = layout === 'wide' ? 400 : 1080;
  const ink = dark ? COLORS.white : COLORS.teal;
  const soft = dark ? COLORS.blueSoft : COLORS.inkSoft;
  const eyebrow = dark ? COLORS.blueSoft : COLORS.blue;
  const parts: string[] = [];
  parts.push(
    `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">${
      dark
        ? `<stop offset="0" stop-color="${COLORS.teal}"/><stop offset="1" stop-color="${COLORS.tealDeep}"/>`
        : `<stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="${COLORS.paper}"/><stop offset="1" stop-color="#E6F1F6"/>`
    }</linearGradient></defs>`,
  );
  parts.push(`<rect width="${W}" height="${H}" fill="url(#bg)"/>`);
  parts.push(chevronPattern(W, H, theme, layout === 'wide' ? 7 : 11));
  parts.push(`<rect x="0" y="${H - 8}" width="${W}" height="8" fill="${COLORS.red}"/>`);

  const headStyle = (size: number) => ({ size, weight: 700 as const, fill: ink });
  const headWidth = (size: number) => text.width(copy.headline.map((p) => p.text).join(''), headStyle(size));
  const drawHead = (x: number, y: number, size: number, anchor: 'start' | 'middle') => {
    let cursor = anchor === 'middle' ? x - headWidth(size) / 2 : x;
    return copy.headline
      .map((part) => {
        const style = { ...headStyle(size), fill: part.accent ? COLORS.red : ink };
        const svg = text.draw(part.text, cursor, y, style);
        cursor += text.width(part.text, style);
        return svg;
      })
      .join('');
  };
  const leadLine = (x: number, y: number, size: number, anchor: 'start' | 'middle') => {
    const style = { size, weight: 600 as const, fill: soft };
    const leadW = copy.lead ? text.width(copy.lead, style) + size * 0.32 : 0;
    const markH = size * 1.02;
    const total = leadW + markH * WORDMARK_RATIO;
    const start = anchor === 'middle' ? x - total / 2 : x;
    return (copy.lead ? text.draw(copy.lead, start, y, style) : '') + wordmark(start + leadW, y, markH, ink).svg;
  };

  if (layout === 'wide') {
    const artH = 300;
    const scale = artH / art.height;
    const artW = art.width * scale;
    parts.push(`<g transform="translate(${n(70 + (300 - artW) / 2)} ${n((H - artH) / 2 - 4)}) scale(${scale.toFixed(4)})">${art.body}</g>`);
    const x = 430;
    const max = W - x - 60;
    const eyebrowStyle = { weight: 700 as const, tracking: 0.14, fill: eyebrow };
    const company = copy.company.toUpperCase();
    parts.push(text.draw(company, x, 120, { ...eyebrowStyle, size: fitSize(company, max, 22, eyebrowStyle, text) }));
    let size = 60;
    while (size > 30 && headWidth(size) > max) size -= 2;
    parts.push(drawHead(x, 120 + 16 + size, size, 'start'));
    const leadY = 120 + 16 + size + 62;
    parts.push(leadLine(x, leadY, 40, 'start'));
    if (copy.sub) parts.push(text.draw(copy.sub, x, leadY + 56, { size: 24, weight: 600, fill: soft }));
    parts.push(text.draw(copy.url, W - 48, H - 32, { size: 16, weight: 600, fill: soft, anchor: 'end' }));
  } else {
    const artH = 440;
    const scale = artH / art.height;
    const artW = art.width * scale;
    parts.push(`<g transform="translate(${n((W - artW) / 2)} 90) scale(${scale.toFixed(4)})">${art.body}</g>`);
    const cx = W / 2;
    const max = W - 140;
    const eyebrowStyle = { weight: 700 as const, tracking: 0.16, fill: eyebrow, anchor: 'middle' as const };
    const company = copy.company.toUpperCase();
    parts.push(text.draw(company, cx, 640, { ...eyebrowStyle, size: fitSize(company, max, 28, eyebrowStyle, text) }));
    let size = 76;
    while (size > 36 && headWidth(size) > max) size -= 2;
    parts.push(drawHead(cx, 650 + 20 + size, size, 'middle'));
    parts.push(leadLine(cx, 650 + 20 + size + 80, 50, 'middle'));
    if (copy.sub) parts.push(text.draw(copy.sub, cx, 650 + 20 + size + 160, { size: 30, weight: 600, fill: soft, anchor: 'middle' }));
    parts.push(text.draw(copy.url, cx, H - 52, { size: 22, weight: 600, fill: soft, anchor: 'middle' }));
  }
  return { width: W, height: H, body: parts.join('') };
}

/* -------------------------------------------------------------- fallback */

/**
 * Shown in place of a badge the company no longer holds (for example after the Verified plan
 * lapses), at the same size so the company's website layout does not break.
 */
export function fallbackArt(width: number, height: number, label: 'Listed on' | 'Reviewed on', theme: Theme, text: TextRenderer): Art {
  const dark = theme === 'dark';
  const k = Math.min(width / 300, height / 96, width / 220);
  const tile = Math.min(height * 0.42, 64 * k);
  const parts = [`<rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${n(Math.min(width, height) * 0.16)}" fill="${dark ? COLORS.teal : COLORS.white}" stroke="${dark ? 'rgba(255,255,255,.18)' : COLORS.line}" stroke-width="2"/>`];
  const labelSize = Math.max(11, 14 * k);
  const markH = 24 * k;
  const markW = markH * WORDMARK_RATIO;
  const wide = width / height > 2;
  if (wide) {
    const x = (height - tile) / 2;
    parts.push(logoTile(x, (height - tile) / 2, tile));
    const tx = x + tile + 16 * k;
    parts.push(text.draw(label.toUpperCase(), tx, height / 2 - 6 * k, { size: labelSize, weight: 700, tracking: 0.14, fill: dark ? COLORS.blueSoft : COLORS.blue }));
    parts.push(wordmark(tx, height / 2 + 22 * k, markH, dark ? COLORS.white : COLORS.teal).svg);
  } else {
    const cx = width / 2;
    const block = tile + 24 * k + labelSize + 14 * k + markH;
    const top = (height - block) / 2;
    parts.push(logoTile(cx - tile / 2, top, tile));
    parts.push(text.draw(label.toUpperCase(), cx, top + tile + 24 * k + labelSize * 0.8, { size: labelSize, weight: 700, tracking: 0.14, fill: dark ? COLORS.blueSoft : COLORS.blue, anchor: 'middle' }));
    parts.push(wordmark(cx - markW / 2, top + block, markH, dark ? COLORS.white : COLORS.teal).svg);
  }
  return { width, height, body: parts.join('') };
}

export function toSvg(art: Art, title: string): string {
  const safe = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${art.width}" height="${art.height}" viewBox="0 0 ${art.width} ${art.height}" role="img" aria-label="${safe}"><title>${safe}</title>${art.body}</svg>`;
}
