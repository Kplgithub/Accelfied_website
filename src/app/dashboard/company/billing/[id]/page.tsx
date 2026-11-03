import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PrintButton } from '@/components/dashboard/print-button';
import { getMyInvoice } from '@/lib/account-data';
import { formatDay } from '@/lib/format';
import { formatPaise } from '@/lib/verified-plan';

export const metadata: Metadata = { title: 'Invoice' };

/** SAC for online information and advertising services. */
const SAC = '998365';

export default async function InvoicePage({ params }: PageProps<'/dashboard/company/billing/[id]'>) {
  const { id } = await params;
  const invoice = await getMyInvoice(`/dashboard/company/billing/${id}`, id);
  if (!invoice) notFound();

  const intraState = invoice.igst === 0;
  const rows: Array<[string, number]> = intraState
    ? [
        ['CGST at 9%', invoice.cgst],
        ['SGST at 9%', invoice.sgst],
      ]
    : [['IGST at 18%', invoice.igst]];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/dashboard/company/billing" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden="true" /> Billing
        </Link>
        <PrintButton />
      </div>

      <article className="rounded-[var(--radius-card)] border border-line bg-white p-6 text-[15px] text-ink shadow-[var(--shadow-card)] sm:p-10 print:border-0 print:p-0 print:shadow-none">
        <header className="flex flex-col gap-6 border-b border-line pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-2xl font-semibold">{invoice.seller.legalName}</p>
            {invoice.seller.address && <p className="mt-1 max-w-xs whitespace-pre-line text-ink-soft">{invoice.seller.address}</p>}
            {invoice.seller.gstin && <p className="mt-1 text-ink-soft">GSTIN {invoice.seller.gstin}</p>}
          </div>
          <div className="sm:text-right">
            <h1 className="font-display text-xl font-semibold tracking-wide text-brand uppercase">Tax invoice</h1>
            <dl className="mt-2 space-y-0.5 text-ink-soft">
              <div>
                <dt className="inline">Invoice no. </dt>
                <dd className="inline font-medium text-ink">{invoice.number}</dd>
              </div>
              <div>
                <dt className="inline">Date </dt>
                <dd className="inline">{formatDay(invoice.paidAt)}</dd>
              </div>
            </dl>
          </div>
        </header>

        <section className="grid gap-6 border-b border-line py-6 sm:grid-cols-2">
          <div>
            <h2 className="text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase">Billed to</h2>
            <p className="mt-2 font-medium">{invoice.billedTo.name}</p>
            {invoice.billedTo.address && <p className="mt-1 whitespace-pre-line text-ink-soft">{invoice.billedTo.address}</p>}
            <p className="mt-1 text-ink-soft">{invoice.billedTo.gstin ? `GSTIN ${invoice.billedTo.gstin}` : 'Unregistered (no GSTIN)'}</p>
          </div>
          <div className="sm:text-right">
            <h2 className="text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase">Payment</h2>
            <p className="mt-2 text-ink-soft">Paid online by Razorpay</p>
            <p className="mt-1 text-ink-soft break-all">Ref. {invoice.razorpayPaymentId}</p>
          </div>
        </section>

        <table className="mt-6 w-full text-left">
          <thead className="border-b border-line text-sm text-ink-faint">
            <tr>
              <th scope="col" className="py-2 font-medium">Description</th>
              <th scope="col" className="py-2 font-medium">SAC</th>
              <th scope="col" className="py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line">
              <td className="py-3 pr-4">
                <p className="font-medium">{invoice.description}</p>
                {invoice.periodStart && invoice.periodEnd && (
                  <p className="text-sm text-ink-soft">
                    {formatDay(invoice.periodStart)} to {formatDay(invoice.periodEnd)}
                  </p>
                )}
              </td>
              <td className="py-3 pr-4 text-ink-soft">{SAC}</td>
              <td className="py-3 text-right tabular-nums">{formatPaise(invoice.taxable)}</td>
            </tr>
          </tbody>
        </table>

        <dl className="mt-4 ml-auto max-w-xs space-y-1.5 tabular-nums">
          <div className="flex justify-between gap-6 text-ink-soft">
            <dt>Taxable value</dt>
            <dd>{formatPaise(invoice.taxable)}</dd>
          </div>
          {rows.map(([label, amount]) => (
            <div key={label} className="flex justify-between gap-6 text-ink-soft">
              <dt>{label}</dt>
              <dd>{formatPaise(amount)}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-6 border-t border-line pt-2 text-lg font-semibold">
            <dt>Total paid</dt>
            <dd>{formatPaise(invoice.total)}</dd>
          </div>
        </dl>

        <p className="mt-10 text-sm text-ink-faint">This is a computer generated invoice and needs no signature.</p>
      </article>
    </>
  );
}
