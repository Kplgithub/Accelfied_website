'use client';

import {
  BadgeCheck,
  BarChart3,
  Bookmark,
  Briefcase,
  CreditCard,
  FileText,
  FolderKanban,
  Images,
  Inbox,
  LayoutDashboard,
  type LucideIcon,
  Megaphone,
  MessageSquare,
  MessageSquareQuote,
  Medal,
  PenLine,
  PenSquare,
  Send,
  Settings,
  Star,
  UserRound,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** Icons are named, not passed, because the layout that builds the groups runs on the server. */
const ICONS = {
  home: LayoutDashboard,
  edit: PenLine,
  reviews: MessageSquareQuote,
  messages: MessageSquare,
  requests: Inbox,
  analytics: BarChart3,
  projects: FolderKanban,
  badges: Medal,
  portfolio: Images,
  blog: PenSquare,
  sponsored: Megaphone,
  verified: BadgeCheck,
  team: Users,
  billing: CreditCard,
  profile: UserRound,
  settings: Settings,
  brief: FileText,
  shortlist: Bookmark,
  quotes: Send,
  myReviews: Star,
} satisfies Record<string, LucideIcon>;

export type NavIcon = keyof typeof ICONS;

export interface NavGroup {
  title: string;
  links: Array<{ href: string; label: string; icon?: NavIcon; count?: number; prefix?: boolean }>;
}

export function DashboardNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  const scroller = useRef<HTMLElement>(null);
  // On phones the links are one scrolling row; bring the current page into view.
  useEffect(() => {
    const nav = scroller.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (nav && active && nav.scrollWidth > nav.clientWidth) {
      nav.scrollTo({ left: active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2 });
    }
    // On desktop the sidebar scrolls on its own; keep the current page's link inside it.
    const side = nav?.closest('aside');
    if (side && active && side.scrollHeight > side.clientHeight) {
      const link = active.getBoundingClientRect();
      const box = side.getBoundingClientRect();
      if (link.top < box.top || link.bottom > box.bottom) side.scrollTop += link.top - box.top - (box.height - link.height) / 2;
    }
  }, [pathname]);
  return (
    <nav ref={scroller} aria-label="Dashboard" className="relative -mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
      <div className="flex gap-6 lg:flex-col lg:gap-5">
        {groups.map((group) => (
          <div key={group.title} className="shrink-0">
            <p className="mb-1.5 hidden px-3.5 text-[11px] font-semibold tracking-[0.14em] text-ink-faint uppercase lg:block">{group.title}</p>
            <ul className="flex gap-1 lg:flex-col lg:gap-0.5">
              {group.links.map((link) => {
                const Icon = link.icon ? ICONS[link.icon] : Briefcase;
                const active = pathname === link.href || (link.prefix === true && pathname.startsWith(`${link.href}/`));
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={`group flex items-center gap-2.5 rounded-full px-3.5 py-2 text-[15px] whitespace-nowrap transition-colors lg:rounded-xl ${
                        active ? 'bg-night font-medium text-paper' : 'text-ink-soft hover:bg-ink/5 hover:text-ink'
                      }`}
                    >
                      <Icon className={`size-4 shrink-0 ${active ? 'text-paper' : 'text-ink-faint group-hover:text-ink'}`} aria-hidden="true" />
                      <span className="flex-1">{link.label}</span>
                      {link.count ? (
                        <span className="rounded-full bg-brand px-1.5 text-xs font-semibold text-white tabular-nums">
                          <span className="sr-only">, unread: </span>
                          {link.count > 99 ? '99+' : link.count}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
