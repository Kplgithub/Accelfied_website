import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DashboardNav, type NavGroup } from '@/components/dashboard/dashboard-nav';
import { Container } from '@/components/ui/container';
import { apiPrivateGet } from '@/lib/api';
import { getCurrentUser, getSessionToken } from '@/lib/session';
import type { OwnedCompany } from '@/lib/types';

export const metadata: Metadata = {
  title: { default: 'Dashboard', template: '%s | Dashboard | Accelfied' },
  robots: { index: false },
};

export default function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
  return (
    <Container className="grid gap-8 py-8 lg:grid-cols-[220px_1fr] lg:gap-12 lg:py-12">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <Suspense fallback={<div className="h-10 lg:h-80" />}>
          <Nav />
        </Suspense>
      </aside>
      <div className="min-w-0">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-[var(--radius-card)] bg-surface" />}>{children}</Suspense>
      </div>
    </Container>
  );
}

async function Nav() {
  // Each page sends signed-out visitors to log in with its own address, so the nav only renders.
  const [user, token] = await Promise.all([getCurrentUser(), getSessionToken()]);
  if (!user || !token) return null;
  const { company } = await apiPrivateGet<{ company: OwnedCompany | null }>('/v1/me/company', token);
  const groups: NavGroup[] = [{ title: 'Account', links: [{ href: '/dashboard', label: 'Overview' }] }];
  const companyGroup: NavGroup = {
    title: 'My company',
    links: company
      ? [
          { href: '/dashboard/company', label: 'Company profile' },
          { href: '/dashboard/company/requests', label: 'Project requests' },
          { href: '/dashboard/company/reviews', label: 'Client reviews' },
          { href: '/dashboard/company/portfolio', label: 'Portfolio' },
        ]
      : [{ href: '/dashboard/company', label: 'List your company' }],
  };
  const hiringGroup: NavGroup = {
    title: 'Hiring',
    links: [
      { href: '/dashboard/requests', label: 'My briefs' },
      { href: '/dashboard/reviews', label: 'My reviews' },
    ],
  };
  if (user.accountType === 'provider' || company) groups.push(companyGroup, hiringGroup);
  else groups.push(hiringGroup, companyGroup);
  groups.push({ title: 'Settings', links: [{ href: '/dashboard/settings', label: 'Account settings' }] });
  return <DashboardNav groups={groups} />;
}
