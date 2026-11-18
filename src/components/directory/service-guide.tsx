import { ArrowRight, Calculator, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { serviceGuide } from '@/lib/service-guides';
import type { Service } from '@/lib/types';

/** Hand-written hiring advice for a service, with the place name worked in ("How to choose a web development company in Jaipur"). */
export function ServiceGuide({ service, where }: { service: Service; where: string }) {
  const guide = serviceGuide(service.slug, service.groupSlug);
  const name = service.name.toLowerCase();
  return (
    <section className="mt-14 grid gap-8 rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12" aria-labelledby="service-guide">
      <div>
        <h2 id="service-guide" className="font-display text-2xl leading-snug font-semibold text-ink sm:text-3xl">
          How to choose a {name} company in {where}
        </h2>
        <p className="mt-4 leading-relaxed text-ink-soft">{guide.lead(where, name)}</p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-[15px]">
          <Link href={`/get-matched?service=${service.slug}`} className="group inline-flex items-center gap-1.5 font-medium text-accent hover:underline">
            Get a free shortlist <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          {guide.cost && (
            <Link href={guide.cost.href} className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline">
              <Calculator className="size-4" aria-hidden="true" /> {guide.cost.label}
            </Link>
          )}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-ink">Before you sign, check these</h3>
        <ul className="mt-4 space-y-3">
          {guide.checks.map((check) => (
            <li key={check} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-soft">
              <CheckCircle2 className="mt-1 size-4.5 shrink-0 text-brand" aria-hidden="true" />
              {check}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
