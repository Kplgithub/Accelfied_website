import type { Metadata } from 'next';
import { DashboardHeader, Panel } from '@/components/dashboard/bits';
import { CopySnippet } from '@/components/dashboard/copy-snippet';
import { NoCompany } from '@/components/dashboard/no-company';
import { ButtonLink } from '@/components/ui/button';
import { getMyCompany } from '@/lib/account-data';
import { badgeEmbedHtml, badgeSvg, BADGE_SIZE } from '@/lib/badge';

export const metadata: Metadata = { title: 'Website badge' };

const HERE = '/dashboard/company/badge';

export default async function CompanyBadgePage() {
  const company = await getMyCompany(HERE);
  if (!company || company.status === 'rejected') return <NoCompany />;
  const live = company.status === 'published';
  // The preview is drawn from the same code as the live badge, with this account's own data.
  const preview = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(badgeSvg(company))}`;
  return (
    <>
      <DashboardHeader
        eyebrow={company.name}
        title="Website badge"
        intro="Show visitors to your website that real clients review you on Accelfied. The badge links to your profile and updates itself as new reviews are published."
      />
      {live ? (
        <div className="space-y-8">
          <Panel title="Your badge">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex items-center justify-center rounded-2xl bg-paper-deep p-6">
                {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG preview, nothing to optimise */}
                <img src={preview} alt="Preview of your Accelfied badge" width={BADGE_SIZE.width} height={BADGE_SIZE.height} />
              </div>
              <p className="text-[15px] text-ink-soft">
                {company.verified
                  ? 'Your badge says Verified on Accelfied, because your company is on the Verified plan.'
                  : 'Your badge says Listed or Reviewed on Accelfied. It changes to Verified on Accelfied when you join the Verified plan.'}
              </p>
            </div>
            {!company.verified && (
              <div className="mt-5">
                <ButtonLink href="/dashboard/company/verified" variant="secondary" size="sm">
                  Get Verified
                </ButtonLink>
              </div>
            )}
          </Panel>
          <Panel title="Add it to your website">
            <p className="mb-4 text-ink-soft">Paste this code where you want the badge to appear, for example in your footer or on your About page.</p>
            <CopySnippet code={badgeEmbedHtml(company)} label="Badge code" />
          </Panel>
        </div>
      ) : (
        <Panel>
          <p className="text-ink-soft">Your badge appears here as soon as your profile is live.</p>
        </Panel>
      )}
    </>
  );
}
