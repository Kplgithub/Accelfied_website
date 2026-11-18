import { BadgeCheck, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DashboardHeader, Panel, StatTile } from '@/components/dashboard/bits';
import { NoCompany } from '@/components/dashboard/no-company';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { getMyBilling } from '@/lib/account-data';
import { formatDay } from '@/lib/format';
import type { SubscriptionStatus } from '@/lib/types';
import { formatMoney } from '@/lib/verified-plan';

export const metadata: Metadata = { title: 'Billing' };

const HERE = '/dashboard/company/billing';

const PLAN_STATUS: Record<SubscriptionStatus, string> = {
  created: 'Not paid yet',
  authenticated: 'Active',
  active: 'Active',
  pending: 'Payment retrying',
  halted: 'Payment failed',
  paused: 'Paused',
  cancelled: 'Cancelled',
  completed: 'Ended',
  expired: 'Ended',
};

export default async function BillingPage() {
  const billing = await getMyBilling(HERE);
  const { company, subscription, invoices } = billing;
  const plan = billing.plans[subscription?.interval ?? 'monthly'];
  if (!company) {
    return (
      <>
        <DashboardHeader eyebrow="My company" title="Billing" />
        <NoCompany />
      </>
    );
  }

  const status = subscription ? PLAN_STATUS[subscription.status] : 'Free listing';
  const renewal =
    subscription?.currentEnd && ['authenticated', 'active', 'pending'].includes(subscription.status)
      ? subscription.cancelAtCycleEnd
        ? `Ends ${formatDay(subscription.currentEnd)}`
        : formatDay(subscription.currentEnd)
      : 'None';

  return (
    <>
      <DashboardHeader eyebrow={company.name} title="Billing" intro="Your Verified plan, sponsored places and a GST invoice for every payment. Dates are in IST." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Plan" value={<span className="text-2xl">{status}</span>} note={subscription ? `${plan.name}, ${plan.interval}` : 'No monthly charge'} />
        <StatTile label="Next payment" value={<span className="text-2xl">{renewal}</span>} note={renewal === 'None' ? undefined : formatMoney(plan.total, plan.currency)} />
        <StatTile
          label="Verified badge"
          value={<span className="inline-flex items-center gap-2 text-2xl">{company.verified ? <><BadgeCheck className="size-6 text-brand" aria-hidden="true" /> On</> : 'Off'}</span>}
          note={<Link href="/dashboard/company/verified" className="text-accent hover:underline">Manage plan</Link>}
        />
      </div>

      <div className="mt-6">
        {invoices.length === 0 ? (
          <EmptyState title="No invoices yet" action={<ButtonLink href="/dashboard/company/verified">Get Accelfied</ButtonLink>}>
            Your free listing has no charges. Each payment, for the Verified plan or a sponsored place, gets its own GST invoice here.
          </EmptyState>
        ) : (
          <Panel title="Invoices">
            <div className="-mx-5 overflow-x-auto sm:-mx-7">
              <table className="w-full min-w-[520px] text-left text-[15px]">
                <thead className="border-b border-line text-sm text-ink-faint">
                  <tr>
                    <th scope="col" className="px-5 py-2.5 font-medium sm:px-7">Invoice</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Paid on</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Period</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">Amount</th>
                    <th scope="col" className="px-5 py-2.5 sm:px-7"><span className="sr-only">Open</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="transition-colors hover:bg-paper">
                      <td className="px-5 py-3 font-medium text-ink sm:px-7">
                        <Link href={`${HERE}/${invoice.id}`} className="hover:text-accent">{invoice.number}</Link>
                        <span className="block text-sm font-normal text-ink-faint">{invoice.description}</span>
                      </td>
                      <td className="px-3 py-3 text-ink-soft">{formatDay(invoice.paidAt)}</td>
                      <td className="px-3 py-3 text-ink-soft">
                        {invoice.periodStart && invoice.periodEnd ? `${formatDay(invoice.periodStart)} to ${formatDay(invoice.periodEnd)}` : '—'}
                      </td>
                      <td className="px-3 py-3 text-right font-medium text-ink tabular-nums">{formatMoney(invoice.total, invoice.currency)}</td>
                      <td className="px-5 py-3 text-right sm:px-7">
                        <Link href={`${HERE}/${invoice.id}`} className="inline-flex items-center gap-0.5 text-sm font-medium text-accent hover:underline">
                          View <ChevronRight className="size-4" aria-hidden="true" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        )}
      </div>
    </>
  );
}
