import { JsonLd } from '@/components/seo/json-ld';
import { getPlaceCompanies, getStateCompanies } from '@/lib/data';
import { formatRating, pluralize } from '@/lib/format';
import { HOURLY_RATES, MIN_PROJECT_SIZES, TEAM_SIZES } from '@/lib/labels';
import { placeName } from '@/lib/places';
import type { CompanySummary, Service, ServicePlace } from '@/lib/types';

/**
 * "At a glance" facts and FAQ for a location page, computed only from the companies listed there
 * (rates, minimum project size, team size, Verified) and their published reviews. Nothing is
 * estimated: a fact with no data behind it is left out. Gives each location page its own content
 * and answers the questions people search for ("web development cost in Jaipur").
 */
export async function PlaceFacts({ service, place }: { service: Service; place: ServicePlace }) {
  const page =
    place.kind === 'state'
      ? await getStateCompanies({ state: place.citySlug, service: service.slug, sort: 'rating', limit: 50 })
      : await getPlaceCompanies({ service: service.slug, country: place.countryCode, city: place.city || undefined });
  const companies = page.items;
  if (!companies.length) return null;

  const where = placeName(place);
  const name = service.name.toLowerCase();
  const n = companies.length;
  const scope = page.total > n ? `the ${n} highest-rated of the ${page.total} companies listed` : n === 1 ? 'the company listed' : `the ${n} companies listed`;

  const rates = tally(companies, (c) => c.hourlyRate, HOURLY_RATES.map((r) => r.value));
  const minimums = tally(companies, (c) => c.minProjectSize, MIN_PROJECT_SIZES.map((m) => m.value));
  const teams = tally(companies, (c) => c.teamSize, TEAM_SIZES.map((t) => t.value));
  const verified = companies.filter((c) => c.verified).length;
  const rateLabel = (v: string) => HOURLY_RATES.find((r) => r.value === v)!.label;
  const minLabel = (v: number) => MIN_PROJECT_SIZES.find((m) => m.value === v)!.label;
  const teamLabel = (v: string) => TEAM_SIZES.find((t) => t.value === v)!.label;
  const small = companies.filter((c) => c.minProjectSize <= 5_000).length;
  /** "(3 of 8)" after a most-common value; nothing when only one company is listed. */
  const share = (count: number) => (n > 1 ? ` (${count} of ${n})` : '');

  const facts: Array<{ label: string; value: string }> = [
    { label: 'Companies listed', value: `${place.companies}${verified ? `, ${verified} Verified` : ''}` },
    ...(place.reviews > 0 ? [{ label: 'Average client rating', value: `${formatRating(place.rating)} / 5 from ${pluralize(place.reviews, 'published review')}` }] : []),
    ...(rates.mode ? [{ label: n > 1 ? 'Most common hourly rate' : 'Hourly rate', value: `${rateLabel(rates.mode.value)}${share(rates.mode.count)}` }] : []),
    ...(rates.low && rates.high && rates.low !== rates.high ? [{ label: 'Hourly rate range', value: `${rateLabel(rates.low)} to ${rateLabel(rates.high)}` }] : []),
    ...(minimums.mode !== undefined ? [{ label: n > 1 ? 'Most common minimum project' : 'Minimum project', value: `${minLabel(minimums.mode.value)}${share(minimums.mode.count)}` }] : []),
    ...(teams.mode ? [{ label: n > 1 ? 'Most common team size' : 'Team size', value: `${teamLabel(teams.mode.value)}${share(teams.mode.count)}` }] : []),
  ];

  const faq: Array<{ q: string; a: string }> = [
    {
      q: `How many ${name} companies are there in ${where}?`,
      a: `${pluralize(place.companies, 'company', 'companies')} in ${where} ${place.companies === 1 ? 'offers' : 'offer'} ${name} on Accelfied${verified ? `, and ${verified} of ${scope} ${verified === 1 ? 'is' : 'are'} Verified` : ''}.`,
    },
    ...(rates.mode
      ? [
          {
            q: `How much do ${name} companies in ${where} charge per hour?`,
            a:
              rates.low && rates.high && rates.low !== rates.high
                ? `Across ${scope}, hourly rates run from ${rateLabel(rates.low)} to ${rateLabel(rates.high)}. The most common is ${rateLabel(rates.mode.value)}, charged by ${rates.mode.count} of ${n}.`
                : `${capitalize(scope)} ${n === 1 ? 'charges' : 'all charge'} ${rateLabel(rates.mode.value)}.`,
          },
        ]
      : []),
    ...(minimums.mode !== undefined
      ? [
          {
            q: `What is the minimum project size for ${name} in ${where}?`,
            a:
              n === 1
                ? minimums.mode.value === 0
                  ? 'The company listed has no minimum project size.'
                  : `The company listed takes projects from ${minLabel(minimums.mode.value).replace('+', '')}.`
                : `${small} of ${scope} take projects with no minimum or a minimum of $5,000 or less. The most common minimum is ${minLabel(minimums.mode.value).toLowerCase()}${share(minimums.mode.count)}.`,
          },
        ]
      : []),
    {
      q: `How are ${name} companies in ${where} rated?`,
      a:
        place.reviews > 0
          ? `Clients rate them ${formatRating(place.rating)} out of 5 on average, across ${pluralize(place.reviews, 'published review')}. Every rating comes from a client review our team checked before publishing.`
          : `No client reviews are published here yet. Ratings appear only after a client review is checked and published, so there are no ratings to show.`,
    },
  ];

  return (
    <section className="mt-14" aria-labelledby="place-facts">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
        }}
      />
      <h2 id="place-facts" className="font-display text-2xl font-semibold text-ink">
        {service.name} in {where} at a glance
      </h2>
      <dl className="mt-5 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label} className="bg-surface px-5 py-4">
            <dt className="text-sm text-ink-soft">{fact.label}</dt>
            <dd className="mt-1 font-semibold text-ink">{fact.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-sm text-ink-faint">From {scope} and their published reviews.</p>
      <h2 className="mt-12 font-display text-2xl font-semibold text-ink">
        Questions about hiring {name} companies in {where}
      </h2>
      <div className="mt-5 divide-y divide-line rounded-[var(--radius-card)] ring-1 ring-line">
        {faq.map((item) => (
          <div key={item.q} className="px-5 py-4">
            <h3 className="font-semibold text-ink">{item.q}</h3>
            <p className="mt-1.5 text-ink-soft">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Counts of a field across companies: the most common value, and the lowest and highest in the given order. */
function tally<T extends string | number>(companies: CompanySummary[], pick: (c: CompanySummary) => T, order: readonly T[]) {
  const counts = new Map<T, number>();
  for (const company of companies) {
    const value = pick(company);
    if (order.includes(value)) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  const present = order.filter((value) => counts.has(value));
  let mode: { value: T; count: number } | undefined;
  for (const value of present) {
    const count = counts.get(value)!;
    if (!mode || count > mode.count) mode = { value, count };
  }
  return { mode, low: present[0], high: present.at(-1) };
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
