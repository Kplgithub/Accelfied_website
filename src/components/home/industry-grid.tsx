import {
  ArrowUpRight,
  Banknote,
  BedDouble,
  Briefcase,
  Car,
  Cpu,
  Factory,
  Gamepad2,
  GraduationCap,
  HandHeart,
  HeartPulse,
  House,
  Landmark,
  Megaphone,
  Music,
  Newspaper,
  RadioTower,
  Scale,
  ShoppingBag,
  Store,
  Truck,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';
import { INDUSTRIES } from '@/lib/labels';

const ICONS: Record<string, LucideIcon> = {
  'Advertising & marketing': Megaphone,
  'Arts, entertainment & music': Music,
  Automotive: Car,
  'Business services': Briefcase,
  'Consumer products': ShoppingBag,
  Education: GraduationCap,
  'Energy & natural resources': Zap,
  'Financial services': Banknote,
  Gaming: Gamepad2,
  Government: Landmark,
  'Healthcare & medical': HeartPulse,
  'Hospitality & leisure': BedDouble,
  'Information technology': Cpu,
  Legal: Scale,
  Manufacturing: Factory,
  Media: Newspaper,
  'Non-profit': HandHeart,
  'Real estate': House,
  Retail: Store,
  'Supply chain, logistics & transport': Truck,
  Telecommunications: RadioTower,
};

/** Every industry as an icon tile linking to companies that have worked in it. */
export function IndustryGrid() {
  const industries = INDUSTRIES.filter((industry) => industry !== 'Other');
  return (
    <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {industries.map((industry, index) => {
        const Icon = ICONS[industry] ?? Briefcase;
        return (
          <Reveal as="li" key={industry} delay={(index % 7) * 45} className="h-full">
            <Link
              href={`/agencies?industry=${encodeURIComponent(industry)}`}
              className="group relative flex h-full min-h-32 flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-line bg-surface p-4 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="flex items-start justify-between">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-paper text-accent ring-1 ring-line transition-colors duration-300 group-hover:bg-accent group-hover:text-white group-hover:ring-accent">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <ArrowUpRight className="size-4 text-ink-faint opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden="true" />
              </span>
              <span className="text-[15px] leading-snug font-medium text-ink">{industry}</span>
            </Link>
          </Reveal>
        );
      })}
    </ul>
  );
}
