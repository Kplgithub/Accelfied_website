import type { Metadata } from 'next';
import { DashboardHeader, Panel } from '@/components/dashboard/bits';
import { NameForm, PasswordForm } from '@/components/dashboard/settings-forms';
import { formatDate } from '@/lib/format';
import { requireUser } from '@/lib/session';

export const metadata: Metadata = { title: 'Account settings' };

export default async function SettingsPage() {
  const { user } = await requireUser('/dashboard/settings');
  return (
    <>
      <DashboardHeader
        eyebrow="Settings"
        title="Account settings"
        intro={
          <>
            Signed in as <span className="font-medium text-ink">{user.email}</span>. Member since {formatDate(user.createdAt)}.
          </>
        }
      />
      <div className="space-y-8">
        <Panel title="Your name">
          <NameForm firstName={user.firstName} lastName={user.lastName} />
        </Panel>
        <Panel title="Password">
          <PasswordForm />
        </Panel>
      </div>
    </>
  );
}
