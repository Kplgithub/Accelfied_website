import type { AccountType } from './types';

export interface AccountLink {
  href: string;
  label: string;
  icon: 'home' | 'chart' | 'folder' | 'star' | 'edit' | 'bookmark' | 'chat' | 'brief' | 'pen' | 'user' | 'settings' | 'building' | 'search';
}

export interface AccountLinkGroup {
  title: string;
  links: AccountLink[];
}

const COMPANY: AccountLinkGroup = {
  title: 'Your company',
  links: [
    { href: '/dashboard', label: 'Company dashboard', icon: 'home' },
    { href: '/dashboard/company/analytics', label: 'Performance', icon: 'chart' },
    { href: '/dashboard/company/projects', label: 'Projects', icon: 'folder' },
    { href: '/dashboard/company/reviews/request', label: 'Request a client review', icon: 'star' },
    { href: '/dashboard/company', label: 'Edit company profile', icon: 'edit' },
  ],
};

const HIRING: AccountLinkGroup = {
  title: 'Hiring',
  links: [
    { href: '/dashboard/briefs', label: 'My project briefs', icon: 'brief' },
    { href: '/dashboard/shortlist', label: 'Shortlist', icon: 'bookmark' },
    { href: '/dashboard/messages', label: 'Messages', icon: 'chat' },
    { href: '/get-matched', label: 'Get matched with companies', icon: 'search' },
    { href: '/write-a-review', label: 'Review a company', icon: 'pen' },
  ],
};

const YOU: AccountLinkGroup = {
  title: 'You',
  links: [
    { href: '/dashboard/profile', label: 'My profile', icon: 'user' },
    { href: '/dashboard/settings', label: 'Account settings', icon: 'settings' },
  ],
};

/** Shortcuts in the account menu. Company owners see their company tools first; clients can still list a company. */
export function accountLinkGroups(accountType: AccountType): AccountLinkGroup[] {
  if (accountType === 'provider') return [COMPANY, HIRING, YOU];
  return [
    { ...HIRING, links: [{ href: '/dashboard', label: 'Dashboard', icon: 'home' }, ...HIRING.links] },
    { title: 'Your company', links: [{ href: '/get-listed', label: 'List your company', icon: 'building' }] },
    YOU,
  ];
}
