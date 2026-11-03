import { BadgeCheck, Check, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DashboardHeader, Panel } from '@/components/dashboard/bits';
import { NoCompany } from '@/components/dashboard/no-company';
import { getMyCompany } from '@/lib/account-data';
import { formatRupees, PLAN_COMPARISON, VERIFIED_PLAN, verifiedMonthlyWithGst } from '@/lib/verified-plan';

export const metadata: Metadata = { title: 'Get Verified' };

const HERE = '/dashboard/company/verified';
const ADD_ONS = PLAN_COMPARISON.slice(1).flatMap((group) => group.rows.map((row) => row.label));

export default async function VerifiedPlanPage() {
  const company = await getMyCompany(HERE);
  if (!company) {
    return (
      <>
        <DashboardHeader eyebrow="My company" title="Get Verified" />
        <NoCompany />
      </>
    );
  }

  if (company.verified) {
    return (
      <>
        <DashboardHeader eyebrow={company.name} title="You are Verified" intro="Your badge is live and your company is listed above companies that are not verified." />
        <Panel>
          <p className="flex items-center gap-2 font-medium text-ink">
            <BadgeCheck className="size-5 text-brand" aria-hidden="true" /> {VERIFIED_PLAN.name} is active
          </p>
        </Panel>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        eyebrow={company.name}
        title="Get Verified"
        intro="Earn the Verified badge, move above other companies and let our team promote you."
      />
      <Panel>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-display text-2xl font-semibold text-ink">{VERIFIED_PLAN.name}</p>
            <p className="mt-1 text-ink-soft">
              <span className="font-display text-3xl font-semibold text-ink">{formatRupees(VERIFIED_PLAN.monthly)}</span> / month + 18% GST (
              {formatRupees(verifiedMonthlyWithGst)} in total)
            </p>
          </div>
          <div className="lg:text-right">
            <button
              type="button"
              disabled
              className="inline-flex h-12 cursor-not-allowed items-center justify-center rounded-full bg-brand px-7 font-medium text-white opacity-60"
            >
              Start {VERIFIED_PLAN.name}
            </button>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-saffron-ink lg:justify-end">
              <Clock className="size-4" aria-hidden="true" /> Online payment is being set up
            </p>
          </div>
        </div>
        <ul className="mt-8 grid gap-x-8 gap-y-3 border-t border-line pt-6 sm:grid-cols-2">
          {ADD_ONS.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[15px] text-ink-soft">
              <Check className="mt-0.5 size-4.5 shrink-0 text-success" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <Link href="/get-verified" className="mt-6 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline">
          See the full comparison
        </Link>
      </Panel>
    </>
  );
}
