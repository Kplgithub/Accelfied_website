import type { Metadata } from 'next';
import Link from 'next/link';
import { DashboardHeader, Panel } from '@/components/dashboard/bits';
import { Avatar } from '@/components/layout/account-menu';
import { MyProfileForm } from '@/components/vendor/my-profile-form';
import { requireUser } from '@/lib/session';
import { getMyProfile } from '@/lib/vendor-tools';

export const metadata: Metadata = { title: 'My profile' };

const HERE = '/dashboard/profile';

export default async function MyProfilePage() {
  const { user } = await requireUser(HERE);
  const profile = await getMyProfile(HERE);
  return (
    <>
      <DashboardHeader
        eyebrow="Settings"
        title="My profile"
        intro={
          <>
            About you as a person, separate from any company listing. Your name and password are in{' '}
            <Link href="/dashboard/settings" className="font-medium text-accent hover:underline">
              Account settings
            </Link>
            .
          </>
        }
      />
      <div className="mb-6 flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
        <Avatar firstName={user.firstName} lastName={user.lastName} avatarUrl={profile.avatarUrl} size={56} />
        <div className="min-w-0">
          <p className="truncate font-display text-xl font-semibold text-ink">
            {user.firstName} {user.lastName}
          </p>
          <p className="truncate text-sm text-ink-soft">{[profile.jobTitle, profile.companyName].filter(Boolean).join(' at ') || user.email}</p>
        </div>
      </div>
      <Panel>
        <MyProfileForm profile={profile} />
      </Panel>
    </>
  );
}
