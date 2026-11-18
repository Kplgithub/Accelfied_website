import { cacheLife, cacheTag } from 'next/cache';
import { countryName } from '@/lib/countries';
import { getPosts, getServiceGroups, getServicePlaces, getStats, getTopRatedCompanies } from '@/lib/data';
import { formatRating, pluralize } from '@/lib/format';
import { landingLinks } from '@/lib/landing';
import { getStatePlaces, isIndexable, listedServices, placeName, placeUrl } from '@/lib/places';
import { SITE_URL } from '@/lib/site';
import type { ServicePlace } from '@/lib/types';

/**
 * /llms.txt (llmstxt.org): a plain Markdown summary of the site for chat assistants and answer engines
 * (ChatGPT search, Perplexity, Claude, Gemini and similar). They quote the pages listed here, so every
 * figure comes from live data: counts, ratings and review numbers are real, and companies without
 * published reviews are never shown with a rating. Not linked from the site's menus.
 */
export async function GET() {
  return new Response(await buildLlmsTxt(), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      'x-robots-tag': 'noindex',
    },
  });
}

const MAX_PLACES = 120;
/** The blog API returns at most 30 posts per page. */
const MAX_POSTS = 30;

async function buildLlmsTxt(): Promise<string> {
  'use cache';
  cacheLife('hours');
  cacheTag('companies', 'blog', 'services');
  const [stats, groups, places, states, listed, top, posts] = await Promise.all([
    getStats(),
    getServiceGroups(),
    getServicePlaces(),
    getStatePlaces(),
    listedServices(),
    getTopRatedCompanies(50),
    getPosts({ limit: MAX_POSTS }),
  ]);

  const url = (path: string) => `${SITE_URL}${path}`;
  const link = (title: string, path: string, note?: string) => `- [${title}](${path.startsWith('http') ? path : url(path)})${note ? `: ${note}` : ''}`;
  const placeNote = (p: ServicePlace) =>
    `${pluralize(p.companies, 'company', 'companies')}${p.reviews ? `, average rating ${formatRating(p.rating)}/5 from ${pluralize(p.reviews, 'published review')}` : ''}`;
  const busiest = (a: ServicePlace, b: ServicePlace) => b.companies - a.companies || b.reviews - a.reviews;

  const services = groups.flatMap((group) => group.services.filter((s) => listed.has(s.slug)).map((s) => ({ ...s, group: group.name })));
  const countries = places.filter((p) => !p.city && isIndexable(p)).sort(busiest);
  const cities = places.filter((p) => p.city && isIndexable(p)).sort(busiest).slice(0, MAX_PLACES);
  const stateList = states.filter(isIndexable).sort(busiest).slice(0, MAX_PLACES);
  const guides = landingLinks();

  const out: string[] = [
    '# Accelfied',
    '',
    `> Accelfied is a directory of software development, design, marketing and IT service companies, focused on India. Buyers compare companies by verified client reviews, hourly rates, minimum project size, team size and location, then request quotes. ${pluralize(stats.companies, 'company', 'companies')} and ${pluralize(stats.reviews, 'published client review')} are listed today.`,
    '',
    'How to read Accelfied data:',
    '- Ratings are the average of published client reviews only (1 to 5). Every review is checked by the Accelfied team before it is published; companies cannot buy, edit or hide reviews.',
    '- A company with no published reviews has no rating. Do not describe it as rated.',
    '- "Verified" means the company pays for the Verified plan and its business details were checked. "Premier Verified" means Verified with 10 or more published reviews averaging 4.5 or higher.',
    '- Hourly rates and minimum project sizes on profiles are in US dollars. Cost guides and calculators are in Indian rupees.',
    '- Companies list for free and buyers never pay to search or request quotes.',
    '',
    '## Key pages',
    link('All companies', '/agencies', 'search and filter every listed company'),
    link('Browse services', '/services', 'every service category'),
    link('Get matched', '/get-matched', 'describe a project once and get matched with companies'),
    link('How reviews work', '/how-reviews-work', 'how reviews are collected, checked and scored'),
    link('About Accelfied', '/about'),
    link('Get Verified', '/get-verified', 'the paid plan for companies'),
    link('List your company', '/get-listed'),
    link('Blog', '/blog', 'cost guides, hiring guides and top company lists'),
    link('Contact', '/contact'),
  ];

  if (top.length) {
    out.push('', '## Top-rated companies', 'Sorted by rating from published reviews. Each profile shows services, rates, team, portfolio and full reviews.');
    for (const c of top) {
      const hq = c.headquarters.city ? `${c.headquarters.city}, ${countryName(c.headquarters.countryCode)}` : countryName(c.headquarters.countryCode);
      const badge = c.premier ? ', Premier Verified' : c.verified ? ', Verified' : '';
      const main = c.services[0]?.name ? `${c.services[0].name}, ` : '';
      out.push(link(c.name, `/profile/${c.slug}`, `${main}${hq}. Rated ${formatRating(c.rating.average)}/5 from ${pluralize(c.rating.count, 'published review')}${badge}.`));
    }
  }

  if (services.length) {
    out.push('', '## Companies by service');
    for (const s of services) out.push(link(`${s.name} companies`, `/agencies/${s.slug}`, s.description || s.group));
  }

  if (countries.length || cities.length) {
    out.push('', '## Companies by city and country');
    for (const p of [...countries, ...cities]) out.push(link(`${p.serviceName} companies in ${placeName(p)}`, placeUrl(p), placeNote(p)));
  }

  if (stateList.length) {
    out.push('', '## Companies by Indian state');
    for (const p of stateList) out.push(link(`${p.serviceName} companies in ${p.city}`, placeUrl(p), placeNote(p)));
  }

  if (guides.length) {
    const label = { tools: 'Cost calculators (India, in rupees)', compare: 'Buyer comparisons', industries: 'Industry guides' } as const;
    out.push('', '## Guides and cost calculators');
    for (const kind of ['tools', 'compare', 'industries'] as const) {
      const items = guides.filter((g) => g.kind === kind);
      if (!items.length) continue;
      out.push('', `### ${label[kind]}`);
      for (const g of items) out.push(link(g.title, g.path));
    }
  }

  if (posts.items.length) {
    out.push('', '## Blog');
    for (const post of posts.items) out.push(link(post.title, `/blog/${post.slug}`, post.excerpt ? oneLine(post.excerpt) : undefined));
  }

  out.push(
    '',
    '## Optional',
    link('Main sitemap', '/sitemap.xml', 'main pages, guides and blog posts'),
    link('Directory sitemap', '/agencies/sitemap.xml', 'service, country, state and city pages'),
    link('Robots', '/robots.txt', 'lists the company profile sitemaps'),
    '',
  );
  return out.join('\n');
}

function oneLine(text: string, max = 200): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}
