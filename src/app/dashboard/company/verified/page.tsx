import { AlertTriangle, BadgeCheck, Check, Clock, FileText, Hourglass } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { cancelVerifiedPlan } from '@/app/billing-actions';
import { DashboardHeader, Panel } from '@/components/dashboard/bits';
import { NoCompany } from '@/components/dashboard/no-company';
import { VerificationForm } from '@/components/dashboard/verification-form';
import { VerifiedPlanChooser } from '@/components/dashboard/verified-plan-chooser';
import { Button, ButtonLink } from '@/components/ui/button';
import { getMyBilling } from '@/lib/account-data';
import { formatDay } from '@/lib/format';
import { requireUser } from '@/lib/session';
import type { Billing } from '@/lib/types';
import { formatMoney, PAYING_STATUSES, PLAN_COMPARISON } from '@/lib/verified-plan';

export const metadata: Metadata = { title: 'Get Verified' };

const HERE = '/dashboard/company/verified';
const ADD_ONS = PLAN_COMPARISON.slice(1).flatMap((group) => group.rows.map((row) => row.label));
const ENDED = ['cancelled', 'completed', 'expired'];

export default async function VerifiedPlanPage() {
  const [{ user }, billing] = await Promise.all([requireUser(HERE), getMyBilling(HERE)]);
  const { company, subscription, verification, plan } = billing;
  if (!company) {
    return (
      <>
        <DashboardHeader eyebrow="My company" title="Get Verified" />
        <NoCompany />
      </>
    );
  }

  const paying = Boolean(subscription && (PAYING_STATUSES as readonly string[]).includes(subscription.status));
  const step = !paying ? 1 : verification?.status === 'approved' && company.verified ? 4 : verification && verification.status !== 'rejected' ? 3 : 2;

  return (
    <>
      <DashboardHeader
        eyebrow={company.name}
        title={step === 4 ? 'You are Verified' : 'Get Verified'}
        intro={
          step === 4
            ? 'Your badge is live and your company is listed above companies that are not verified.'
            : 'Earn the Verified badge, move above other companies and let our team promote you.'
        }
        action={
          billing.invoices.length > 0 && (
            <ButtonLink href="/dashboard/company/billing" variant="secondary" size="sm">
              <FileText className="size-4" aria-hidden="true" /> Billing and invoices
            </ButtonLink>
          )
        }
      />
      <Steps current={step} />
      <div className="mt-6 space-y-6">
        {step === 1 && <PlanPanel billing={billing} user={user} />}
        {step === 2 && (
          <Panel title="Share your business details">
            {verification?.status === 'rejected' ? (
              <Notice tone="danger" icon={<AlertTriangle className="size-5" aria-hidden="true" />}>
                Our team could not verify the last details.{verification.reviewNote ? ` ${verification.reviewNote}` : ''} Please correct them and send again.
              </Notice>
            ) : (
              <p className="-mt-2 mb-6 text-ink-soft">Payment received. Our team checks these details, usually within two working days, then turns on your badge.</p>
            )}
            <div className={verification?.status === 'rejected' ? 'mt-6' : ''}>
              <VerificationForm previous={verification} />
            </div>
          </Panel>
        )}
        {step === 3 && verification && (
          <Panel>
            <Notice tone="wait" icon={<Hourglass className="size-5" aria-hidden="true" />}>
              <span className="font-semibold">Verifying your details.</span> We sent them to our team on {formatDay(verification.submittedAt)}. Your badge goes live as soon
              as they are approved.
            </Notice>
            <dl className="mt-6 grid gap-x-8 gap-y-4 text-[15px] sm:grid-cols-2">
              <Detail label="Registered business name" value={verification.legalName} />
              <Detail label="GSTIN" value={verification.gstin || 'Not given'} />
              <Detail label="PAN" value={verification.pan} />
              <Detail label="Registration number" value={verification.registrationNumber || 'Not given'} />
              <div className="sm:col-span-2">
                <Detail label="Registered address" value={verification.address} />
              </div>
            </dl>
          </Panel>
        )}
        {step === 4 && (
          <Panel>
            <p className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
              <BadgeCheck className="size-6 text-brand" aria-hidden="true" /> {plan.name} is active
            </p>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {ADD_ONS.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[15px] text-ink-soft">
                  <Check className="mt-0.5 size-4.5 shrink-0 text-success" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Panel>
        )}
        {paying && subscription && <RenewalPanel billing={billing} />}
      </div>
    </>
  );
}

function PlanPanel({ billing, user }: { billing: Billing; user: { firstName: string; lastName: string; email: string } }) {
  const { company, subscription, plan, plans } = billing;
  if (!company) return null;
  const live = company.status === 'published';
  const yearlySaving = plans.monthly.total * 12 - plans.yearly.total;
  return (
    <Panel>
      {subscription?.status === 'halted' && (
        <div className="mb-6">
          <Notice tone="danger" icon={<AlertTriangle className="size-5" aria-hidden="true" />}>
            Your last payment did not go through, so the Verified badge is off. Start the plan again to bring it back.
          </Notice>
        </div>
      )}
      {subscription && ENDED.includes(subscription.status) && (
        <div className="mb-6">
          <Notice tone="wait" icon={<Clock className="size-5" aria-hidden="true" />}>
            Your Verified plan has ended. Start it again whenever you are ready.
          </Notice>
        </div>
      )}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-display text-2xl font-semibold text-ink">{plan.name}</p>
          <p className="mt-1 text-ink-soft">
            <span className="font-display text-3xl font-semibold text-ink">{formatMoney(plan.total, plan.currency).replace(/\.00$/, '')}</span> / month, or{' '}
            {formatMoney(plans.yearly.total, plans.yearly.currency).replace(/\.00$/, '')} / year. GST included.
          </p>
          <p className="mt-1 text-sm text-ink-faint">
            Paying yearly saves {formatMoney(yearlySaving, plan.currency).replace(/\.00$/, '')}. Every payment gets an invoice with the GST shown separately.
          </p>
        </div>
        <div className="lg:w-[26rem] lg:shrink-0 lg:text-right">
          {!live ? (
            <PlanBlocked text="Your listing goes live after our team approves it. You can join Verified right after that." />
          ) : !billing.enabled ? (
            <PlanBlocked text="Online payment is being set up." />
          ) : (
            <VerifiedPlanChooser plans={plans} companyName={company.name} name={`${user.firstName} ${user.lastName}`} email={user.email} />
          )}
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
  );
}

function PlanBlocked({ text }: { text: string }) {
  return (
    <>
      <Button type="button" size="lg" disabled className="w-full sm:w-auto">
        Start Accelfied Verified
      </Button>
      <p className="mt-2 flex items-start gap-1.5 text-sm text-saffron-ink lg:justify-end">
        <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {text}
      </p>
    </>
  );
}

function RenewalPanel({ billing }: { billing: Billing }) {
  const { subscription } = billing;
  if (!subscription) return null;
  const plan = billing.plans[subscription.interval ?? 'monthly'];
  const period = plan.interval === 'yearly' ? 'year' : 'month';
  return (
    <Panel title="Your plan">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-ink-soft">
          {subscription.cancelAtCycleEnd
            ? subscription.currentEnd
              ? `Cancelled. Your plan and badge stay on until ${formatDay(subscription.currentEnd)}.`
              : `Cancelled. Your plan stays on until the end of this ${period}.`
            : subscription.currentEnd
              ? `Next payment of ${formatMoney(plan.total, plan.currency)} on ${formatDay(subscription.currentEnd)}.`
              : `Renews every ${period} at ${formatMoney(plan.total, plan.currency)}.`}
        </p>
        {!subscription.cancelAtCycleEnd && (
          <details className="group shrink-0">
            <summary className="cursor-pointer list-none text-sm font-medium text-ink-soft underline-offset-4 hover:text-danger hover:underline">Cancel plan</summary>
            <form action={cancelVerifiedPlan} className="mt-3 rounded-xl border border-line bg-paper p-4 text-sm sm:max-w-xs">
              <p className="text-ink-soft">The badge stays until the paid {period} ends, then it is removed and no more payments are taken.</p>
              <Button type="submit" variant="secondary" size="sm" className="mt-3">
                Yes, cancel at {period} end
              </Button>
            </form>
          </details>
        )}
      </div>
    </Panel>
  );
}

const STEPS = ['Join the plan', 'Share business details', 'Our team verifies', 'Badge is live'];

function Steps({ current }: { current: number }) {
  return (
    <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {STEPS.map((label, index) => {
        const number = index + 1;
        const done = number < current || current === 4;
        const active = number === current && current !== 4;
        return (
          <li
            key={label}
            aria-current={active ? 'step' : undefined}
            className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm ${
              active ? 'border-brand/40 bg-surface font-semibold text-ink shadow-[var(--shadow-card)]' : done ? 'border-line bg-surface text-ink-soft' : 'border-dashed border-line text-ink-faint'
            }`}
          >
            <span
              className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                done ? 'bg-success text-white' : active ? 'bg-brand text-white' : 'bg-paper-deep text-ink-faint'
              }`}
            >
              {done ? <Check className="size-3.5" aria-hidden="true" /> : number}
            </span>
            {label}
          </li>
        );
      })}
    </ol>
  );
}

function Notice({ tone, icon, children }: { tone: 'danger' | 'wait'; icon: ReactNode; children: ReactNode }) {
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-[15px] ${
        tone === 'danger' ? 'border-danger/30 bg-danger-tint text-danger' : 'border-saffron/30 bg-saffron-tint text-saffron-ink'
      }`}
    >
      <span className="mt-0.5 shrink-0">{icon}</span>
      <p>{children}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-ink-faint">{label}</dt>
      <dd className="mt-0.5 font-medium break-words text-ink">{value}</dd>
    </div>
  );
}
