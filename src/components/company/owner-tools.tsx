import { BarChart3, BadgeCheck, LayoutDashboard, Package, PenLine, Send } from 'lucide-react';
import Link from 'next/link';
import { apiPrivateGet } from '@/lib/api';
import { getCurrentUser, getSessionToken } from '@/lib/session';
import type { OwnedCompany } from '@/lib/types';

/**
 * A slim toolbar the company's own owner sees on their public profile, with shortcuts
 * to fix what they spot. Everyone else gets nothing, so the public page stays the same.
 */
export async function OwnerTools({ slug }: { slug: string }) {
  const user = await getCurrentUser();
  if (!user || user.accountType !== 'provider') return null;
  const token = await getSessionToken();
  if (!token) return null;
  const company = await apiPrivateGet<{ company: OwnedCompany | null }>('/v1/me/company', token)
    .then((res) => res.company)
    .catch(() => null);
  if (!company || company.slug !== slug) return null;

  const tools = [
    { href: '/dashboard/company', label: 'Edit profile', icon: PenLine },
    { href: '/dashboard/company/packages', label: 'Packages', icon: Package },
    { href: '/dashboard/company/reviews', label: 'Request reviews', icon: Send },
    { href: '/dashboard/company/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="border-b border-white/10 bg-night text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p className="flex items-center gap-2 text-sm">
          <LayoutDashboard className="size-4 text-saffron" aria-hidden="true" />
          <span>
            <span className="font-semibold">This is your profile.</span>{' '}
            <span className="text-white/70">
              {company.status === 'published' ? 'Clients see it exactly like this.' : 'It goes live once our team approves it.'}
            </span>
          </span>
        </p>
        <nav aria-label="Owner tools" className="-mx-1 flex gap-1 overflow-x-auto pb-1 lg:pb-0">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
            >
              <tool.icon className="size-4" aria-hidden="true" />
              {tool.label}
            </Link>
          ))}
          {!company.verified && (
            <Link
              href="/dashboard/company/verified"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
            >
              <BadgeCheck className="size-4" aria-hidden="true" />
              Get Verified
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
