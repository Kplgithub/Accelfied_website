import { Lock } from 'lucide-react';
import type { Metadata } from 'next';
import { BadgeKit, type KitItem } from '@/components/dashboard/badge-kit';
import { DashboardHeader, Panel } from '@/components/dashboard/bits';
import { CopySnippet } from '@/components/dashboard/copy-snippet';
import { NoCompany } from '@/components/dashboard/no-company';
import { ButtonLink } from '@/components/ui/button';
import { AwardIcon, SealIcon } from '@/components/ui/seal-icon';
import { getMyCompany } from '@/lib/account-data';
import { badgeEmbedHtml, badgeSvg, BADGE_SIZE } from '@/lib/badge';
import { sealArt, toSvg } from '@/lib/badges/art';
import { badgeUrl, earnedBadges, embedHtml } from '@/lib/badges/catalog';
import { soraText } from '@/lib/badges/text';
import { getCompanyAwards } from '@/lib/data';
import { formatRating } from '@/lib/format';
import type { OwnedCompany, TopAward } from '@/lib/types';

export const metadata: Metadata = { title: 'Badges' };

const HERE = '/dashboard/company/badge';
const PREMIER = { reviews: 10, rating: 4.5 };

export default async function CompanyBadgePage() {
  const company = await getMyCompany(HERE);
  if (!company || company.status === 'rejected') return <NoCompany />;
  const live = company.status === 'published';
  const awards = live ? await getCompanyAwards(company.slug) : [];
  return (
    <>
      <DashboardHeader
        eyebrow={company.name}
        title="Badges"
        intro="Show clients that you are reviewed and trusted on Accelfied. Download your badges for social posts and proposals, or add them to your website with a link back to your profile."
      />
      {!live ? (
        <Panel>
          <p className="text-ink-soft">Your badges appear here as soon as your profile is live.</p>
        </Panel>
      ) : (
        <div className="space-y-8">
          <Status company={company} awards={awards} />
          {company.verified ? <Kit company={company} awards={awards} /> : <Locked company={company} />}
        </div>
      )}
    </>
  );
}

function Status({ company, awards }: { company: OwnedCompany; awards: TopAward[] }) {
  const { count, average } = company.rating;
  const toGo = Math.max(0, PREMIER.reviews - count);
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatusTile icon={<SealIcon className="size-7" />} title="Verified" earned={company.verified}>
        {company.verified ? 'Earned with your Verified plan.' : 'Comes with the Verified plan.'}
      </StatusTile>
      <StatusTile icon={<SealIcon premier className="size-7" />} title="Premier Verified" earned={company.premier}>
        {company.premier
          ? `Earned: ${count} reviews averaging ${formatRating(average)}.`
          : `Needs the Verified plan and ${PREMIER.reviews}+ reviews averaging ${PREMIER.rating}. You have ${count} ${count === 1 ? 'review' : 'reviews'}${count ? `, averaging ${formatRating(average)}` : ''}${toGo ? `, ${toGo} to go` : ''}.`}
      </StatusTile>
      <StatusTile icon={<AwardIcon className="size-7" />} title="Top company awards" earned={awards.length > 0}>
        {awards.length > 0
          ? `${awards.length} earned this year from your client reviews.`
          : 'For the top 10 companies per service and city with 5+ reviews averaging 4.5 or higher.'}
      </StatusTile>
    </div>
  );
}

function StatusTile({ icon, title, earned, children }: { icon: React.ReactNode; title: string; earned: boolean; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2.5 font-semibold text-ink">
          {icon}
          {title}
        </span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${earned ? 'bg-accent-tint text-accent' : 'bg-paper-deep text-ink-faint'}`}>{earned ? 'Earned' : 'Not yet'}</span>
      </div>
      <p className="mt-3 text-sm text-ink-soft">{children}</p>
    </div>
  );
}

function Kit({ company, awards }: { company: OwnedCompany; awards: TopAward[] }) {
  const items: KitItem[] = earnedBadges(company, awards).map((item) => ({
    id: item.id,
    group: item.group,
    title: item.title,
    note: item.note,
    width: item.width,
    height: item.height,
    pngWidths: item.pngWidths,
    base: {
      light: badgeUrl(company.slug, item.id, 'light').replace(/\.svg$/, ''),
      dark: badgeUrl(company.slug, item.id, 'dark').replace(/\.svg$/, ''),
    },
    embed: { light: embedHtml(company, item, 'light'), dark: embedHtml(company, item, 'dark') },
  }));
  return <BadgeKit items={items} />;
}

/** Companies without the Verified plan see what they would get, and keep the plain profile badge. */
function Locked({ company }: { company: OwnedCompany }) {
  const preview = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  const seal = preview(toSvg(sealArt('verified', 'light', soraText), 'Verified badge'));
  const premier = preview(toSvg(sealArt('premier', 'light', soraText), 'Premier Verified badge'));
  return (
    <>
      <Panel>
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="relative flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-paper-deep p-6">
            {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG preview */}
            <img src={seal} alt="The Verified badge" width={140} height={140} className="opacity-90 grayscale-[35%]" />
            {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG preview */}
            <img src={premier} alt="The Premier Verified badge" width={110} height={110} className="opacity-80 grayscale-[35%]" />
            <span className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-full bg-night text-paper">
              <Lock className="size-4" aria-hidden="true" />
              <span className="sr-only">Locked</span>
            </span>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Unlock your Verified badges</h2>
            <p className="mt-2 text-ink-soft">
              With the Verified plan you get the Verified badge on your profile and in listings, high quality badge files (SVG and PNG up to 2048px), banners for social posts, and website code that links back to your profile. Premier Verified and Top company awards unlock as your client reviews grow.
            </p>
            <div className="mt-5">
              <ButtonLink href="/dashboard/company/verified">Get Accelfied</ButtonLink>
            </div>
          </div>
        </div>
      </Panel>
      <BasicBadge company={company} />
    </>
  );
}

function BasicBadge({ company }: { company: OwnedCompany }) {
  const preview = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(badgeSvg(company))}`;
  return (
    <Panel title="Free profile badge">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center justify-center rounded-2xl bg-paper-deep p-6">
          {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG preview, nothing to optimise */}
          <img src={preview} alt="Preview of your Accelfied badge" width={BADGE_SIZE.width} height={BADGE_SIZE.height} />
        </div>
        <p className="text-[15px] text-ink-soft">Every live profile can show this badge. It says Listed or Reviewed on Accelfied and links to your profile.</p>
      </div>
      <div className="mt-6">
        <CopySnippet code={badgeEmbedHtml(company)} label="Badge code" />
      </div>
    </Panel>
  );
}
