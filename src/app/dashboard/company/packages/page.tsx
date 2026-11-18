import { EyeOff, Pencil, Trash2 } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { removePackage } from '@/app/profile-section-actions';
import { DashboardHeader, Panel } from '@/components/dashboard/bits';
import { NoCompany } from '@/components/dashboard/no-company';
import { PackageForm } from '@/components/dashboard/sections/package-form';
import { ButtonLink } from '@/components/ui/button';
import { getMyCompanyDetails } from '@/lib/account-data';

export const metadata: Metadata = { title: 'Packages' };

const HERE = '/dashboard/company/packages';
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default async function PackagesPage({ searchParams }: PageProps<'/dashboard/company/packages'>) {
  const { edit } = await searchParams;
  const data = await getMyCompanyDetails(HERE);
  if (!data || data.company.status === 'rejected') return <NoCompany />;
  const { company, details } = data;
  const editing = details.packages.find((item) => item.id === edit);
  const full = details.packages.length >= 8;

  return (
    <>
      <DashboardHeader
        eyebrow="My company"
        title="Packages"
        intro="Give clients a clear price range with Starter, Growth and Scale options. They show up under Pricing on your profile."
        action={
          company.status === 'published' && details.packages.length > 0 ? (
            <ButtonLink href={`/profile/${company.slug}#pricing`} variant="secondary" size="sm">
              See on profile
            </ButtonLink>
          ) : undefined
        }
      />
      {details.packages.length > 0 && (
        <Panel title={`My packages (${details.packages.length}/8)`} className="mb-8">
          <ul className="divide-y divide-line">
            {details.packages.map((item) => (
              <li key={item.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-medium text-ink">
                    {item.title}
                    {item.status === 'hidden' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-paper-deep px-2 py-0.5 text-xs text-ink-soft">
                        <EyeOff className="size-3" aria-hidden="true" />
                        Hidden
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-ink-soft">
                    {item.serviceName} · {item.tiers.map((tier) => usd.format(tier.price)).join(' / ')}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link href={`${HERE}?edit=${item.id}#editor`} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-sm font-medium text-ink hover:border-ink">
                    <Pencil className="size-3.5" aria-hidden="true" />
                    Edit
                  </Link>
                  <form action={removePackage}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-ink-soft hover:bg-danger-tint hover:text-danger" aria-label={`Delete ${item.title}`}>
                      <Trash2 className="size-4" />
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}
      <div id="editor" className="scroll-mt-32">
        {editing ? (
          <Panel title={`Edit: ${editing.title}`}>
            <PackageForm key={editing.id} item={editing} services={company.services} />
            <Link href={HERE} className="mt-4 inline-block text-sm text-ink-soft hover:text-ink">
              Done editing
            </Link>
          </Panel>
        ) : full ? (
          <Panel>
            <p className="text-ink-soft">You have 8 packages, the most a profile can show. Delete one to add another.</p>
          </Panel>
        ) : (
          <Panel title={details.packages.length ? 'Add another package' : 'Add your first package'}>
            <PackageForm services={company.services} onDone={HERE} />
          </Panel>
        )}
      </div>
    </>
  );
}
