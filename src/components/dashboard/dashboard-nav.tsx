'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export interface NavGroup {
  title: string;
  links: Array<{ href: string; label: string; count?: number; prefix?: boolean }>;
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
  }, [pathname]);
  return (
    <nav ref={scroller} aria-label="Dashboard" className="relative -mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
      <div className="flex gap-6 lg:flex-col lg:gap-7">
        {groups.map((group) => (
          <div key={group.title} className="shrink-0">
            <p className="mb-2 hidden text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase lg:block">{group.title}</p>
            <ul className="flex gap-1 lg:flex-col">
              {group.links.map((link) => {
                const active = pathname === link.href || (link.prefix === true && pathname.startsWith(`${link.href}/`));
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center justify-between gap-2 rounded-full px-3.5 py-2 text-[15px] whitespace-nowrap transition-colors lg:rounded-xl ${
                        active ? 'bg-night font-medium text-paper' : 'text-ink-soft hover:bg-ink/5 hover:text-ink'
                      }`}
                    >
                      {link.label}
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
