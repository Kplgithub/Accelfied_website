import type { ProfileHealth } from './profile-health';
import type { OwnedCompany } from './types';

export interface RecommendedTask {
  key: string;
  title: string;
  tip: string;
  href: string;
  /** Rough time it takes, shown beside the task. */
  minutes: number;
  done: boolean;
}

const MINUTES: Record<string, number> = {
  company: 10, basics: 2, services: 5, industries: 2, clients: 5, locations: 3, social: 2, awards: 5, packages: 15, portfolio: 15, team: 10,
};

/**
 * What a company owner can do next, most useful first: profile sections,
 * reviews and the Verified plan. "Done" is always worked out from real data.
 */
export function recommendedTasks(company: OwnedCompany, health: ProfileHealth): RecommendedTask[] {
  const reviews = company.rating.count;
  const extra: RecommendedTask[] = [
    {
      key: 'first-review',
      title: 'Get your first client review',
      tip: 'Send a past client your review link. One review lifts you above every company with none.',
      href: '/dashboard/company/reviews',
      minutes: 3,
      done: reviews >= 1,
    },
    {
      key: 'three-reviews',
      title: 'Reach three client reviews',
      tip: 'Three good reviews in one service earn you that service’s certification.',
      href: '/dashboard/company/projects',
      minutes: 5,
      done: reviews >= 3,
    },
    {
      key: 'get-verified',
      title: 'Get Accelfied',
      tip: 'Verified companies show a trust badge and rank above unverified ones.',
      href: '/dashboard/company/verified',
      minutes: 5,
      done: company.verified,
    },
    {
      key: 'website-badge',
      title: 'Add your badge to your website',
      tip: 'Visitors to your site can open your reviews in one click.',
      href: '/dashboard/company/badge',
      minutes: 5,
      // We cannot see the owner's website, so this one is done when they skip it.
      done: false,
    },
  ];
  const sections: RecommendedTask[] = health.sections.map((section) => ({
    key: `profile-${section.key}`,
    title: section.title,
    tip: section.tip,
    href: section.href,
    minutes: MINUTES[section.key] ?? 5,
    done: section.done,
  }));
  // Reviews first while there are none, then the most valuable profile sections.
  const order = [...health.todo.map((section) => `profile-${section.key}`)];
  const byValue = (task: RecommendedTask) => {
    if (task.key === 'first-review') return -2;
    if (task.key === 'get-verified') return 50;
    const index = order.indexOf(task.key);
    return index === -1 ? 100 : index;
  };
  return [...extra, ...sections].sort((a, b) => byValue(a) - byValue(b));
}
