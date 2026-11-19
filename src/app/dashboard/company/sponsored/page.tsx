import { Clock, ExternalLink, Megaphone, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { cancelSponsorship, startSponsorship } from '@/app/billing-actions';
import { DashboardHeader, Panel } from '@/components/dashboard/bits';
import { NoCompany } from '@/components/dashboard/no-company';
import { VerifiedCheckout } from '@/components/dashboard/verified-checkout';
import { Button } from '@/components/ui/button';
import { getMySponsorships } from '@/lib/account-data';
import { countrySlug, placeSlug } from '@/lib/places';
import { formatDay } from '@/lib/format';
import { requireUser } from '@/lib/session';
import type { SponsorOption, Sponsorships } from '@/lib/types';
import { formatWhole, PAYING_STATUSES } from '@/lib/verified-plan';

export const metadata: Metadata = { title: 'Sponsored places' };

const HERE = '/dashboard/company/sponsored';

const isPaying = (option: SponsorOption) => Boolean(option.mine && (PAYING_STATUSES as readonly string[]).includes(option.mine.status));

/** The directory page an option puts the company on. */
function pagePath(option: SponsorOption): string {
  const base = `/agencies/${option.service.slug}`;
  if (!option.countryCode) return base;
  const country = `${base}/${countrySlug(option.countryCode)}`;
  return option.city ? `${country}/${placeSlug(option.city)}` : country;
}

/** The monthly price of one place, in US dollars. */
const priceOf = (data: Sponsorships) => formatWhole(data.plan.total, data.plan.currency);

export default async function SponsoredPlacesPage() {
  const [{ user }, data] = await Promise.all([requireUser(HERE), getMySponsorships(HERE)]);
  if (!data.company) {
    return (
      <>
        <DashboardHeader eyebrow="My company" title="Sponsored places" />
        <NoCompany />
      </>
    );
  }

  const price = priceOf(data);
  const live = data.company.status === 'published';
  const active = data.options.filter(isPaying);
  const available = data.options.filter((option) => !isPaying(option));

  return (
    <>
      <DashboardHeader
        eyebrow={data.company.name}
        title="Sponsored places"
        intro={`Show your company at the top of a directory page, above every other listing, for ${price} a month per page, GST included. Each page has ${data.maxPerPage} places.`}
      />

      {active.length > 0 && (
        <Panel title="Pages you sponsor" className="mb-6">
          <ul className="divide-y divide-line">
            {active.map((option) => (
              <li key={option.pageKey} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="flex items-center gap-2 font-medium text-ink">
                    <Sparkles className="size-4 text-saffron" aria-hidden="true" /> {option.label}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    {option.mine?.cancelAtCycleEnd
                      ? option.mine.currentEnd
                        ? `Cancelled. Your place stays until ${formatDay(option.mine.currentEnd)}.`
                        : 'Cancelled. Your place stays until the paid month ends.'
                      : option.mine?.currentEnd
                        ? `Next payment of ${price} on ${formatDay(option.mine.currentEnd)}.`
                        : `Renews every month at ${price}.`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <Link href={pagePath(option)} className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                    View page <ExternalLink className="size-3.5" aria-hidden="true" />
                  </Link>
                  {!option.mine?.cancelAtCycleEnd && (
                    <details className="group">
                      <summary className="cursor-pointer list-none text-sm font-medium text-ink-soft underline-offset-4 hover:text-danger hover:underline">Cancel</summary>
                      <form action={cancelSponsorship.bind(null, option.pageKey)} className="mt-3 rounded-xl border border-line bg-paper p-4 text-sm sm:max-w-xs">
                        <p className="text-ink-soft">Your place stays until the paid month ends. Then it opens for another company and no more payments are taken.</p>
                        <Button type="submit" variant="secondary" size="sm" className="mt-3">
                          Yes, cancel at month end
                        </Button>
                      </form>
                    </details>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel title="Choose a page">
        {!live ? (
          <Notice text="Your listing goes live after our team approves it. You can sponsor a page right after that." />
        ) : !data.enabled ? (
          <Notice text="Online payment is being set up." />
        ) : available.length === 0 ? (
          <p className="text-ink-soft">You sponsor every page you can. Add services or locations to your profile to reach more pages.</p>
        ) : (
          <>
            <p className="-mt-2 mb-5 text-ink-soft">
              You can sponsor pages for the services and locations on your profile. Sponsored companies are marked &ldquo;Sponsored&rdquo; so clients always know.
            </p>
            <ul className="divide-y divide-line">
              {available.map((option) => {
                const left = Math.max(0, data.maxPerPage - option.taken);
                return (
                  <li key={option.pageKey} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-ink">{option.label}</p>
                      <p className={`mt-0.5 text-sm ${left === 0 ? 'text-saffron-ink' : 'text-ink-soft'}`}>
                        {left === 0 ? 'All places taken. Check back later.' : `${left} of ${data.maxPerPage} places open`}
                        {' · '}
                        <Link href={pagePath(option)} className="text-accent hover:underline">
                          See the page
                        </Link>
                      </p>
                    </div>
                    {left > 0 && (
                      <div className="shrink-0 sm:text-right">
                        <VerifiedCheckout
                          size="md"
                          label={`Sponsor for ${price} / month`}
                          description={`Sponsored place: ${option.label}`}
                          name={`${user.firstName} ${user.lastName}`}
                          email={user.email}
                          start={startSponsorship.bind(null, {
                            service: option.service.slug,
                            country: option.countryCode ?? undefined,
                            city: option.city ?? undefined,
                          })}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Panel>

      <p className="mt-6 flex items-start gap-2 text-sm text-ink-faint">
        <Megaphone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Every payment gets a GST invoice in Billing. Sponsoring a page does not change your reviews or rating, and it is separate from the Verified plan.
      </p>
    </>
  );
}

function Notice({ text }: { text: string }) {
  return (
    <p className="flex items-start gap-2 rounded-xl border border-saffron/30 bg-saffron-tint px-4 py-3 text-[15px] text-saffron-ink">
      <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {text}
    </p>
  );
}
