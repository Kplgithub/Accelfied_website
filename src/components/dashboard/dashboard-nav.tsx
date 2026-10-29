'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavGroup {
  title: string;
  links: Array<{ href: string; label: string }>;
}

export function DashboardNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Dashboard" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
      <div className="flex gap-6 lg:flex-col lg:gap-7">
        {groups.map((group) => (
          <div key={group.title} className="shrink-0">
            <p className="mb-2 hidden text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase lg:block">{group.title}</p>
            <ul className="flex gap-1 lg:flex-col">
              {group.links.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={`block rounded-full px-3.5 py-2 text-[15px] whitespace-nowrap transition-colors lg:rounded-xl ${
                        active ? 'bg-night font-medium text-paper' : 'text-ink-soft hover:bg-ink/5 hover:text-ink'
                      }`}
                    >
                      {link.label}
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
