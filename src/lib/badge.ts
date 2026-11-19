import { formatRating, pluralize } from './format';
import { SITE_URL } from './site';
import { logoTile, wordmark } from './badges/art';

export const BADGE_SIZE = { width: 220, height: 76 };

interface BadgeCompany {
  slug: string;
  name: string;
  verified: boolean;
  rating: { average: number; count: number };
}

/** What the badge says: Verified only for companies on the Verified plan, never a made-up claim. */
export function badgeHeadline(company: BadgeCompany): string {
  if (company.verified) return 'VERIFIED ON';
  return company.rating.count > 0 ? 'REVIEWED ON' : 'LISTED ON';
}

/** HTML a company pastes on its own website. The link back to the profile is what earns the backlink. */
export function badgeEmbedHtml(company: BadgeCompany): string {
  const profile = `${SITE_URL}/profile/${company.slug}`;
  const label = `${company.name} ${badgeHeadline(company).toLowerCase()} Accelfied`;
  return `<a href="${profile}" target="_blank" rel="noopener" title="${escapeAttr(label)}"><img src="${SITE_URL}/badge/${company.slug}" alt="${escapeAttr(label)}" width="${BADGE_SIZE.width}" height="${BADGE_SIZE.height}" loading="lazy" /></a>`;
}

export function badgeSvg(company: BadgeCompany): string {
  const { width, height } = BADGE_SIZE;
  const rated = company.rating.count > 0;
  const ratingLine = rated
    ? `<text x="78" y="62" font-size="12" fill="#5B6E76"><tspan font-weight="700" fill="#17313B">${formatRating(company.rating.average)}</tspan><tspan fill="#F0A531"> ★ </tspan>${escapeText(pluralize(company.rating.count, 'review'))}</text>`
    : '';
  const titleY = rated ? 44 : 50;
  const headY = rated ? 24 : 30;
  const check = company.verified
    ? `<circle cx="200" cy="20" r="9" fill="#1B7499"/><path d="M196 20.2l2.8 2.8 5.2-5.6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeAttr(`${company.name} ${badgeHeadline(company).toLowerCase()} Accelfied`)}">
<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="14" fill="#FFFFFF" stroke="#D5DEE2"/>
${logoTile(16, (height - 48) / 2, 48)}
<g font-family="Helvetica, Arial, sans-serif">
<text x="78" y="${headY}" font-size="10" font-weight="700" letter-spacing="1.4" fill="#1B7499">${badgeHeadline(company)}</text>
${wordmark(78, titleY, 17, '#17313B').svg}
${ratingLine}
</g>
${check}
</svg>`;
}

function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(value: string): string {
  return escapeText(value).replace(/"/g, '&quot;');
}
