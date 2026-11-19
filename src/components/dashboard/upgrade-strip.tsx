import 'server-only';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { istYear, sealArt, toSvg } from '@/lib/badges/art';
import { soraText } from '@/lib/badges/text';
import { myVerifyStage, PLAN_PAGE, STAGE_COPY } from '@/lib/verification-stage';
import { formatPrice, VERIFIED_PLAN } from '@/lib/verified-plan';

let badge: { year: number; src: string } | null = null;
function badgeSrc(): string {
  const year = istYear();
  if (!badge || badge.year !== year) {
    badge = { year, src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(toSvg(sealArt('verified', 'dark', soraText, year, 'u'), 'Verified badge'))}` };
  }
  return badge.src;
}

/** "Upgrade to the Verified plan" strip for companies without it, on the pages in verify-nudge.tsx STRIP_PAGES. Prices come from the plan constants. */
export async function UpgradeStrip({ company }: { company: { verified: boolean; status: string } | null }) {
  if (!company || company.verified || company.status === 'rejected' || company.status === 'suspended') return null;
  const stage = await myVerifyStage();
  // Paid but not approved yet: point to the one step left instead of selling the plan again.
  if (stage !== 'pay') {
    const copy = STAGE_COPY[stage];
    return (
      <section aria-label="Verification status" className="mb-8 overflow-hidden rounded-[var(--radius-card)] bg-night text-paper shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-5 px-6 py-5 md:flex-row md:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG of our own badge */}
          <img src={badgeSrc()} alt="" width={66} height={81} className="shrink-0" />
          <div className="flex-1">
            <p className="font-display text-xl font-semibold">{copy.title}</p>
            <p className="mt-1 max-w-2xl text-[15px] text-paper/85">{copy.text}</p>
          </div>
          <Link href={PLAN_PAGE} className="inline-flex h-11 shrink-0 items-center justify-center self-start rounded-full bg-brand px-6 text-[15px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-brand-strong md:self-center">
            {copy.action}
          </Link>
        </div>
      </section>
    );
  }
  const points = [
    'Verified badge on your profile, in listings and on your own website',
    'Listed above companies that are not verified',
    `${formatPrice(VERIFIED_PLAN.monthly)} a month or ${formatPrice(VERIFIED_PLAN.yearly)} a year, GST included`,
  ];
  return (
    <section aria-label="Upgrade to the Verified plan" className="mb-8 overflow-hidden rounded-[var(--radius-card)] bg-night text-paper shadow-[var(--shadow-card)]">
      <div className="flex flex-col md:flex-row md:items-stretch">
        <div className="relative flex items-center gap-4 bg-[#0D2028] px-6 py-5 md:w-[340px] md:shrink-0 md:[clip-path:polygon(0_0,88%_0,100%_50%,88%_100%,0_100%)] md:pr-12">
          {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG of our own badge */}
          <img src={badgeSrc()} alt="" width={66} height={81} className="shrink-0" />
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[#8CCBE2] uppercase">Upgrade to</p>
            <p className="font-display text-2xl leading-tight font-semibold whitespace-nowrap">Verified plan</p>
          </div>
        </div>
        <ul className="flex-1 space-y-2 px-6 py-5 text-[15px] text-paper/90 md:py-6">
          {points.map((point) => (
            <li key={point} className="flex gap-2.5">
              <Check className="mt-0.5 size-4 shrink-0 text-[#8CCBE2]" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
        <div className="flex items-center px-6 pb-6 md:py-5 md:pr-7 md:pb-5">
          <Link href="/dashboard/company/verified" className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-[15px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-brand-strong">
            Get Accelfied
          </Link>
        </div>
      </div>
    </section>
  );
}
