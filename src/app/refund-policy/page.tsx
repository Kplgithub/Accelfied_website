import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, legalDetails, MailOrContact } from '@/components/legal/legal-page';
import { getSiteSettings } from '@/lib/data';
import { formatPrice, VERIFIED_PLAN } from '@/lib/verified-plan';

export const metadata: Metadata = {
  title: 'Refund and cancellation policy',
  description: 'How the Accelfied Verified plan is billed, how to cancel and when we refund.',
  alternates: { canonical: '/refund-policy' },
};

export default async function RefundPolicyPage() {
  const d = legalDetails(await getSiteSettings());
  const price = formatPrice(VERIFIED_PLAN.monthly);
  return (
    <LegalPage
      eyebrow="Billing"
      title="Refund and cancellation policy"
      updatedOn={d.updatedOn}
      intro="Listing your company, collecting reviews and receiving briefs are free. This page covers the one paid product, Accelfied Verified."
    >
      <h2>How billing works</h2>
      <p>
        {VERIFIED_PLAN.name} costs {price} a month, GST included. Razorpay charges your card at the start of each monthly period, and you get an invoice for every payment
        in your <Link href="/dashboard/company/billing">billing page</Link>.
      </p>

      <h2>Cancelling</h2>
      <p>
        You can cancel at any time from your <Link href="/dashboard/company/verified">Verified plan page</Link>. The plan and badge stay active until the end of the period
        you paid for, and no further payments are taken.
      </p>

      <h2>When we refund</h2>
      <ul>
        <li>You were charged twice for the same period, or charged after you cancelled.</li>
        <li>Our team could not verify your business after your first payment. We refund that payment in full.</li>
        <li>A technical fault on our side stopped the plan from working for most of a paid period.</li>
      </ul>
      <p>We do not refund part of a month after a period has started, or a period in which the plan worked as described.</p>

      <h2>How to ask</h2>
      <p>
        Write to <MailOrContact email={d.supportEmail} /> within 30 days of the payment, with your company name and invoice number. We reply within 3 working days. Approved
        refunds go back to the original card through Razorpay and usually arrive within 5 to 7 working days, depending on your bank.
      </p>
    </LegalPage>
  );
}
