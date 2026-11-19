import type { Metadata } from 'next';
import { cache, Suspense } from 'react';
import { CompanySidebarCard } from '@/components/dashboard/company-identity';
import { DashboardNav, type NavGroup } from '@/components/dashboard/dashboard-nav';
import { NavSkeleton } from '@/components/skeleton/dashboard';
import { DashboardSkeleton } from '@/components/skeleton/skeleton';
import { VerifyNudge } from '@/components/dashboard/verify-nudge';
import { myVerifyStage, STAGE_COPY } from '@/lib/verification-stage';
import { Container } from '@/components/ui/container';
import { getUnreadCounts } from '@/lib/account-data';
import { apiPrivateGet } from '@/lib/api';
import { getCurrentUser, getSessionToken } from '@/lib/session';
import type { OwnedCompany } from '@/lib/types';

export const metadata: Metadata = {
  title: { default: 'Dashboard', template: '%s | Dashboard | Accelfied' },
  robots: { index: false },
};

export default function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
  return (
    <Container className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 lg:py-12 print:block print:py-0">
      {/* On desktop the sidebar fits the screen and scrolls on its own, so reaching a lower link
          never scrolls the page, and the page does not jump back up after the click. */}
      <aside className="min-w-0 print:hidden lg:sticky lg:top-32 lg:max-h-[calc(100dvh-9.5rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pr-1 lg:[scrollbar-width:thin]">
        <Suspense fallback={<NavSkeleton />}>
          <Nav />
        </Suspense>
      </aside>
      <div className="min-w-0">
        <Suspense fallback={null}>
          <Nudge />
        </Suspense>
        <Suspense fallback={<DashboardSkeleton />}>{children}</Suspense>
      </div>
    </Container>
  );
}

/** One /v1/me/company call per request, shared by the nav and the Verified reminder. */
const loadMyCompany = cache(async (token: string) => (await apiPrivateGet<{ company: OwnedCompany | null }>('/v1/me/company', token)).company);

async function Nudge() {
  const token = await getSessionToken();
  if (!token) return null;
  const company = await loadMyCompany(token);
  if (!company || company.verified || company.status === 'rejected' || company.status === 'suspended') return null;
  const stage = await myVerifyStage();
  if (stage === 'pay') return <VerifyNudge />;
  return <VerifyNudge message={STAGE_COPY[stage].text} action={STAGE_COPY[stage].action} />;
}

async function Nav() {
  // Each page sends signed-out visitors to log in with its own address, so the nav only renders.
  const [user, token] = await Promise.all([getCurrentUser(), getSessionToken()]);
  if (!user || !token) return null;
  const [company, unread] = await Promise.all([loadMyCompany(token), getUnreadCounts(token)]);
  const messages = { href: '/dashboard/messages', label: 'Messages', icon: 'messages', count: unread.client + unread.company, prefix: true } as const;
  const hiring: NavGroup = {
    title: 'Hiring',
    links: [
      { href: '/dashboard/briefs', label: 'Project briefs', icon: 'brief', prefix: true },
      { href: '/dashboard/shortlist', label: 'Shortlist', icon: 'shortlist' },
      { href: '/dashboard/requests', label: 'Quotes sent', icon: 'quotes' },
      { href: '/dashboard/reviews', label: 'My reviews', icon: 'myReviews' },
    ],
  };
  const settings: NavGroup['links'] = [
    { href: '/dashboard/profile', label: 'My profile', icon: 'profile' },
    { href: '/dashboard/settings', label: 'Account settings', icon: 'settings' },
  ];
  const groups: NavGroup[] = [];
  if (company) {
    // Grouped by what an owner is trying to do: run the listing, see results, get found, manage the account.
    groups.push(
      {
        title: 'Overview',
        links: [
          { href: '/dashboard', label: 'Dashboard', icon: 'home' },
          { href: '/dashboard/company', label: 'Edit profile', icon: 'edit' },
          { href: '/dashboard/company/reviews', label: 'Client reviews', icon: 'reviews', prefix: true },
          messages,
          // Project requests open once the company is Verified.
          ...(company.verified ? [{ href: '/dashboard/company/requests', label: 'Project requests', icon: 'requests' } as const] : []),
        ],
      },
      {
        title: 'Performance',
        links: [
          { href: '/dashboard/company/analytics', label: 'Analytics', icon: 'analytics' },
          { href: '/dashboard/company/projects', label: 'Projects', icon: 'projects', prefix: true },
          { href: '/dashboard/company/badge', label: 'Badges', icon: 'badges' },
        ],
      },
      {
        title: 'Marketing',
        links: [
          { href: '/dashboard/company/portfolio', label: 'Portfolio', icon: 'portfolio' },
          { href: '/dashboard/company/blog', label: 'Write a blog', icon: 'blog', prefix: true },
          { href: '/dashboard/company/sponsored', label: 'Sponsored places', icon: 'sponsored' },
        ],
      },
      hiring,
      {
        title: 'Account',
        links: [
          { href: '/dashboard/company/verified', label: company.verified ? 'Verified plan' : 'Get Accelfied', icon: 'verified' },
          { href: '/dashboard/company/team', label: 'Team', icon: 'team' },
          { href: '/dashboard/company/billing', label: 'Billing', icon: 'billing' },
          ...settings,
        ],
      },
    );
  } else {
    const listCompany: NavGroup = { title: 'My company', links: [{ href: '/dashboard/company', label: 'List your company', icon: 'edit' }] };
    groups.push({ title: 'Overview', links: [{ href: '/dashboard', label: 'Dashboard', icon: 'home' }, messages] });
    if (user.accountType === 'provider') groups.push(listCompany, hiring);
    else groups.push(hiring, listCompany);
    groups.push({ title: 'Account', links: settings });
  }
  return (
    <>
      {company && <CompanySidebarCard company={company} />}
      <DashboardNav groups={groups} />
    </>
  );
}
