import { ExternalLink, Trash2 } from 'lucide-react';
import type { Metadata } from 'next';
import { removePortfolioItem } from '@/app/dashboard-actions';
import { DashboardHeader, Panel } from '@/components/dashboard/bits';
import { NoCompany } from '@/components/dashboard/no-company';
import { PortfolioForm } from '@/components/dashboard/portfolio-form';
import { getMyCompany } from '@/lib/account-data';

export const metadata: Metadata = { title: 'Portfolio' };

export default async function PortfolioPage() {
  const company = await getMyCompany('/dashboard/company/portfolio');
  if (!company || company.status === 'rejected') return <NoCompany />;
  return (
    <>
      <DashboardHeader eyebrow={company.name} title="Portfolio" intro="Show the projects you are proud of. They appear on your public profile." />
      {company.portfolio.length > 0 && (
        <ul className="mb-8 grid gap-4 sm:grid-cols-2">
          {company.portfolio.map((item) => (
            <li key={item.id} className="flex flex-col rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-ink">{item.title}</p>
                <form action={removePortfolioItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" aria-label={`Remove ${item.title}`} className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-ink-faint hover:bg-danger-tint hover:text-danger">
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </form>
              </div>
              {item.description && <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{item.description}</p>}
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-medium text-accent underline-offset-4 hover:underline">
                  View project
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
      <Panel title="Add a project">
        <PortfolioForm services={company.services.map(({ slug, name }) => ({ slug, name }))} />
      </Panel>
    </>
  );
}
