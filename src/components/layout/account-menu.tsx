'use client';

import { ChevronDown, LayoutDashboard, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { logout } from '@/app/auth-actions';

interface Props {
  firstName: string;
  lastName: string;
  email: string;
}

export function AccountMenu({ firstName, lastName, email }: Props) {
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

  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
  const close = () => setOpen(false);

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex cursor-pointer items-center gap-2 rounded-full py-1 pr-2.5 pl-1 text-ink transition-colors hover:bg-ink/5"
      >
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-night text-[13px] font-semibold text-paper">{initials}</span>
        <span className="text-[15px] font-medium">{firstName}</span>
        <ChevronDown className={`size-4 text-ink-soft transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className="absolute top-full right-0 mt-2 w-64 animate-rise rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow-lift)]">
          <div className="border-b border-line px-3 pt-2 pb-3">
            <p className="font-medium text-ink">
              {firstName} {lastName}
            </p>
            <p className="truncate text-sm text-ink-soft">{email}</p>
          </div>
          <Link role="menuitem" href="/dashboard" onClick={close} className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] text-ink hover:bg-paper">
            <LayoutDashboard className="size-4 text-ink-soft" aria-hidden="true" />
            Dashboard
          </Link>
          <Link role="menuitem" href="/dashboard/settings" onClick={close} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] text-ink hover:bg-paper">
            <Settings className="size-4 text-ink-soft" aria-hidden="true" />
            Account settings
          </Link>
          <form action={logout}>
            <button role="menuitem" type="submit" className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] text-ink hover:bg-paper">
              <LogOut className="size-4 text-ink-soft" aria-hidden="true" />
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
