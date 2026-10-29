'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { logout } from '@/app/auth-actions';

interface Props {
  links: Array<{ href: string; label: string }>;
  account?: { firstName: string; email: string } | null;
}

export function MobileMenu({ links, account = null }: Props) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-ink/5"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 top-16 bottom-0 z-40 animate-rise bg-paper px-4 pt-4 pb-8">
          <nav aria-label="Mobile" className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 font-display text-2xl text-ink"
              >
                {link.label}
              </Link>
            ))}
            {account && (
              <Link href="/dashboard" onClick={() => setOpen(false)} className="border-b border-line py-4 font-display text-2xl text-ink">
                Dashboard
              </Link>
            )}
            <Link
              href="/get-a-quote"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-brand font-medium text-white"
            >
              Get a quote
            </Link>
            {account ? (
              <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-4 py-3">
                <div className="min-w-0">
                  <p className="font-medium text-ink">{account.firstName}</p>
                  <p className="truncate text-sm text-ink-soft">{account.email}</p>
                </div>
                <form action={logout}>
                  <button type="submit" className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-ink ring-1 ring-line-strong">
                    Log out
                  </button>
                </form>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Link href="/login" onClick={() => setOpen(false)} className="inline-flex h-12 items-center justify-center rounded-full font-medium text-ink ring-1 ring-line-strong">
                  Log in
                </Link>
                <Link href="/join" onClick={() => setOpen(false)} className="inline-flex h-12 items-center justify-center rounded-full font-medium text-ink ring-1 ring-line-strong">
                  Join free
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
