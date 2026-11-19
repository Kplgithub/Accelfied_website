'use client';

import {
  Bookmark,
  Building2,
  ChartNoAxesColumn,
  ChevronDown,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PenLine,
  Search,
  Settings,
  SquarePen,
  Star,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { logout } from '@/app/auth-actions';
import { accountLinkGroups, type AccountLink } from '@/lib/account-links';
import type { AccountType } from '@/lib/types';

export const ACCOUNT_ICONS: Record<AccountLink['icon'], LucideIcon> = {
  home: LayoutDashboard,
  chart: ChartNoAxesColumn,
  folder: FolderKanban,
  star: Star,
  edit: SquarePen,
  bookmark: Bookmark,
  chat: MessageSquare,
  brief: FileText,
  pen: PenLine,
  user: UserRound,
  settings: Settings,
  building: Building2,
  search: Search,
};

interface Props {
  firstName: string;
  lastName: string;
  email: string;
  accountType: AccountType;
  avatarUrl?: string;
}

export function Avatar({ firstName, lastName, avatarUrl, size = 32 }: { firstName: string; lastName: string; avatarUrl?: string; size?: number }) {
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
  return avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element -- uploaded pictures are already resized by the API
    <img src={avatarUrl} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover ring-2 ring-surface" style={{ width: size, height: size }} />
  ) : (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-night font-semibold text-paper" style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {initials}
    </span>
  );
}

export function AccountMenu({ firstName, lastName, email, accountType, avatarUrl }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const groups = accountLinkGroups(accountType);

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex cursor-pointer items-center gap-2 rounded-full py-1 pr-2.5 pl-1 text-ink transition-colors hover:bg-ink/5"
      >
        <Avatar firstName={firstName} lastName={lastName} avatarUrl={avatarUrl} />
        <span className="max-w-28 truncate text-[15px] font-medium">{firstName}</span>
        <ChevronDown className={`size-4 text-ink-soft transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute top-full right-0 mt-2 max-h-[calc(100dvh-6rem)] w-[300px] animate-rise overflow-y-auto overscroll-contain rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow-lift)]"
        >
          <div className="flex items-center gap-3 rounded-xl bg-paper px-3 py-3">
            <Avatar firstName={firstName} lastName={lastName} avatarUrl={avatarUrl} size={40} />
            <div className="min-w-0">
              <p className="truncate font-medium text-ink">
                {firstName} {lastName}
              </p>
              <p className="truncate text-sm text-ink-soft">{email}</p>
            </div>
          </div>
          {groups.map((group) => (
            <div key={group.title} className="mt-2 border-t border-line pt-2 first-of-type:border-0">
              <p className="px-3 pt-1 pb-1.5 text-[11px] font-semibold tracking-[0.14em] text-ink-faint uppercase">{group.title}</p>
              {group.links.map((link) => {
                const Icon = ACCOUNT_ICONS[link.icon];
                return (
                  <Link
                    key={link.href}
                    role="menuitem"
                    href={link.href}
                    onClick={close}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2 text-[15px] text-ink transition-colors hover:bg-paper"
                  >
                    <Icon className="size-4 text-ink-soft transition-colors group-hover:text-accent" aria-hidden="true" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          ))}
          <form action={logout} className="mt-2 border-t border-line pt-2">
            <button role="menuitem" type="submit" className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-[15px] text-ink hover:bg-paper">
              <LogOut className="size-4 text-ink-soft" aria-hidden="true" />
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
