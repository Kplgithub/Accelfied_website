import 'server-only';
import { countryName } from '../countries';
import { formatRating, pluralize } from '../format';
import { placePath, placeSlug } from '../places';
import { SITE_URL } from '../site';
import type { TopAward } from '../types';
import { awardArt, bannerArt, COMPACT_SIZE, compactArt, fallbackArt, fallbackTileArt, istYear, sealArt, TILE_SIZE, type Art, type BannerLayout, type TextRenderer, type Theme } from './art';

/**
 * Every badge file a company can use, by name. A name is what the URL ends with:
 *   seal-verified, seal-premier, compact, award-<service>-<place>,
 *   banner-<wide|square>-<one of the above except compact>
 * plus "-dark" for the dark version, then ".svg" or ".png".
 *
 * A badge is only ever drawn for a company that holds it right now: Verified follows the
 * paid plan, Premier Verified and awards follow published reviews.
 */

export interface BadgeCompany {
  slug: string;
  name: string;
  verified: boolean;
  premier: boolean;
  rating: { average: number; count: number };
}

export type BadgeGroup = 'seal' | 'compact' | 'award' | 'banner';

export interface BadgeItem {
  /** File name without theme or extension, such as "seal-premier". */
  id: string;
  group: BadgeGroup;
  title: string;
  /** What it is for, shown under the preview. */
  note: string;
  width: number;
  height: number;
  /** Size of the <img> in the embed code, in CSS pixels. Null for banners, which are not embedded. */
  embed: { width: number; height: number } | null;
  /** PNG widths offered for download. */
  pngWidths: number[];
}

/** Title-cases a city the way a company typed it ("jaipur" becomes "Jaipur"). */
export function cityName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/(^|[\s-])(\p{L})/gu, (_m, sep: string, letter: string) => sep + letter.toUpperCase());
}

export function awardPlace(award: TopAward): string {
  return award.scope === 'city' ? cityName(award.city) : countryName(award.countryCode);
}

export function awardId(award: TopAward): string {
  const place = award.scope === 'city' ? placeSlug(award.city) : placeSlug(countryName(award.countryCode));
  return `award-${award.service}-${place}`;
}

export function awardTitle(award: TopAward): string {
  return `Top ${award.serviceName} Company, ${awardPlace(award)} ${award.year}`;
}

/** The directory page the award is about, so the award can link to it. */
export function awardHref(award: TopAward): string {
  const city = award.scope === 'city' ? cityName(award.city) : '';
  return placePath({
    service: award.service,
    serviceName: award.serviceName,
    countryCode: award.countryCode,
    country: countryName(award.countryCode),
    city,
    citySlug: city ? placeSlug(city) : '',
    companies: 0,
    reviews: 0,
    rating: 0,
  });
}

const SEAL_PNG = [512, 1024, 2048];
const TILE_EMBED = { width: 150, height: 184 };
const WIDE = { width: 1200, height: 400 };
const SQUARE = { width: 1080, height: 1080 };

/** Badges the company holds now, in the order the dashboard shows them. Empty unless it is on the Verified plan. */
export function earnedBadges(company: BadgeCompany, awards: TopAward[]): BadgeItem[] {
  if (!company.verified) return [];
  const items: BadgeItem[] = [];
  const seals: Array<{ id: string; title: string }> = [];
  if (company.premier) {
    items.push({ id: 'seal-premier', group: 'seal', title: 'Premier Verified', note: 'For companies on the Verified plan with 10 or more client reviews averaging 4.5 or higher.', ...TILE_SIZE, embed: TILE_EMBED, pngWidths: SEAL_PNG });
    seals.push({ id: 'seal-premier', title: 'Premier Verified' });
  }
  items.push({ id: 'seal-verified', group: 'seal', title: 'Verified', note: 'For companies on the Verified plan.', ...TILE_SIZE, embed: TILE_EMBED, pngWidths: SEAL_PNG });
  seals.push({ id: 'seal-verified', title: 'Verified' });
  items.push({ id: 'compact', group: 'compact', title: company.premier ? 'Premier Verified, compact' : 'Verified, compact', note: 'Small enough for a website footer. Shows your live rating.', ...COMPACT_SIZE, embed: { width: 240, height: 75 }, pngWidths: [640, 1280] });
  for (const award of awards) {
    items.push({ id: awardId(award), group: 'award', title: awardTitle(award), note: `Ranked #${award.rank} of companies with 5+ reviews averaging 4.5 or higher.`, ...TILE_SIZE, embed: TILE_EMBED, pngWidths: SEAL_PNG });
  }
  const bannerSources = [...seals, ...awards.map((award) => ({ id: awardId(award), title: awardTitle(award) }))];
  for (const source of bannerSources) {
    for (const layout of ['wide', 'square'] as const) {
      const size = layout === 'wide' ? WIDE : SQUARE;
      items.push({
        id: `banner-${layout}-${source.id}`,
        group: 'banner',
        title: `${source.title} banner, ${layout === 'wide' ? 'wide' : 'square'}`,
        note: layout === 'wide' ? 'For your website, emails and LinkedIn posts.' : 'For Instagram, LinkedIn and other social posts.',
        width: size.width,
        height: size.height,
        embed: null,
        pngWidths: [size.width, size.width * 2],
      });
    }
  }
  return items;
}

export interface ParsedAsset {
  id: string;
  theme: Theme;
  format: 'svg' | 'png';
}

export function parseAsset(asset: string): ParsedAsset | null {
  const match = /^([a-z0-9-]{3,180}?)(-dark)?\.(svg|png)$/.exec(asset);
  if (!match) return null;
  return { id: match[1], theme: match[2] ? 'dark' : 'light', format: match[3] as 'svg' | 'png' };
}

export function assetName(id: string, theme: Theme, format: 'svg' | 'png'): string {
  return `${id}${theme === 'dark' ? '-dark' : ''}.${format}`;
}

export function badgeUrl(slug: string, id: string, theme: Theme, format: 'svg' | 'png' = 'svg'): string {
  return `/badge/${encodeURIComponent(slug)}/${assetName(id, theme, format)}`;
}

function profileUrl(slug: string): string {
  return `${SITE_URL}/profile/${slug}`;
}

function realRatingLine(company: BadgeCompany): string {
  return company.rating.count > 0 ? `Rated ${formatRating(company.rating.average)} out of 5 in ${pluralize(company.rating.count, 'client review')}` : '';
}

/** Draws a badge the company holds. Null when it does not hold it (or the name is unknown). */
export function drawBadge(id: string, theme: Theme, company: BadgeCompany, awards: TopAward[], text: TextRenderer): Art | null {
  const item = earnedBadges(company, awards).find((badge) => badge.id === id);
  if (!item) return null;
  const award = (awardKey: string) => awards.find((a) => awardId(a) === awardKey);
  const base = (key: string, prefix: string): Art | null => {
    if (key === 'seal-verified') return sealArt('verified', theme, text, istYear(), `${prefix}s`);
    if (key === 'seal-premier') return sealArt('premier', theme, text, istYear(), `${prefix}s`);
    const a = award(key);
    return a ? awardArt({ service: a.serviceName, place: awardPlace(a), year: a.year }, theme, text, prefix) : null;
  };
  if (item.group === 'compact') return compactArt({ kind: company.premier ? 'premier' : 'verified', rating: company.rating }, theme, text);
  if (item.group !== 'banner') return base(id, 'a');
  const match = /^banner-(wide|square)-(.+)$/.exec(id);
  if (!match) return null;
  const layout = match[1] as BannerLayout;
  const sourceId = match[2];
  const art = base(sourceId, 'b');
  if (!art) return null;
  const a = award(sourceId);
  const url = `www.accelfied.com/profile/${company.slug}`;
  const copy = a
    ? { company: company.name, headline: [{ text: `Top ${a.serviceName} Company` }], lead: `in ${awardPlace(a)}, ${a.year} on`, sub: realRatingLine(company), url }
    : sourceId === 'seal-premier'
      ? { company: company.name, headline: [{ text: 'Premier ', accent: true }, { text: 'Verified' }], lead: 'on', sub: realRatingLine(company), url }
      : { company: company.name, headline: [{ text: 'Verified' }], lead: 'on', sub: realRatingLine(company), url };
  return bannerArt(layout, art, copy, theme, text);
}

/** Size-matched stand-in for a badge the company no longer holds, so its website layout stays intact. */
export function drawFallback(id: string, theme: Theme, company: BadgeCompany, text: TextRenderer): Art | null {
  const label = company.rating.count > 0 ? 'Reviewed on' : 'Listed on';
  if (id === 'compact') return fallbackArt(COMPACT_SIZE.width, COMPACT_SIZE.height, label, theme, text);
  if (id === 'seal-verified' || id === 'seal-premier' || id.startsWith('award-')) return fallbackTileArt(label, theme, text);
  return null;
}

export function badgeAlt(company: BadgeCompany, item: Pick<BadgeItem, 'title' | 'group'>): string {
  if (item.group === 'award') return `${company.name}: ${item.title}, on Accelfied`;
  return `${company.name} is ${item.title.replace(/, compact$/, '')} on Accelfied`;
}

/** HTML a company pastes on its own website: an image that links back to its profile. */
export function embedHtml(company: BadgeCompany, item: BadgeItem, theme: Theme): string {
  if (!item.embed) return '';
  const alt = badgeAlt(company, item).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return `<a href="${profileUrl(company.slug)}" target="_blank" rel="noopener" title="${alt}"><img src="${SITE_URL}${badgeUrl(company.slug, item.id, theme)}" alt="${alt}" width="${item.embed.width}" height="${item.embed.height}" loading="lazy" style="border:0" /></a>`;
}
