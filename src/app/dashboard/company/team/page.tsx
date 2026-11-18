import { ExternalLink, Trash2 } from 'lucide-react';
import type { Metadata } from 'next';
import { removeTeamMember } from '@/app/dashboard-actions';
import { PersonAvatar } from '@/components/company/person-avatar';
import { DashboardHeader, Panel } from '@/components/dashboard/bits';
import { NoCompany } from '@/components/dashboard/no-company';
import { TeamForm } from '@/components/dashboard/team-form';
import { getMyCompany } from '@/lib/account-data';

export const metadata: Metadata = { title: 'Team' };

export default async function TeamPage() {
  const company = await getMyCompany('/dashboard/company/team');
  if (!company || company.status === 'rejected') return <NoCompany />;
  return (
    <>
      <DashboardHeader
        eyebrow={company.name}
        title="Team"
        intro="Introduce the people clients will work with. They appear in the Team section of your public profile, in this order."
      />
      {company.team.length > 0 ? (
        <ul className="mb-8 grid gap-4 sm:grid-cols-2">
          {company.team.map((member) => (
            <li key={member.id} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
              <PersonAvatar name={member.name} photoUrl={member.photoUrl} size={56} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{member.name}</p>
                {member.role && <p className="truncate text-sm text-ink-soft">{member.role}</p>}
                {member.linkedinUrl && (
                  <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:underline">
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                    LinkedIn
                  </a>
                )}
              </div>
              <form action={removeTeamMember}>
                <input type="hidden" name="id" value={member.id} />
                <button
                  type="submit"
                  aria-label={`Remove ${member.name}`}
                  className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-ink-faint hover:bg-danger-tint hover:text-danger"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-8 rounded-2xl border border-dashed border-line-strong px-5 py-6 text-ink-soft">
          No team members yet. Profiles that show real people feel more trustworthy to clients.
        </p>
      )}
      <Panel title="Add a team member">
        <TeamForm />
      </Panel>
    </>
  );
}
