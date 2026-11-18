import Link from 'next/link';
import { formatDate } from '@/lib/format';
import type { Conversation } from '@/lib/types';
import { CompanyLogo } from '../company/company-logo';
import { PersonAvatar } from '../company/person-avatar';

/** The inbox rows. Unread conversations are bold and carry a count. */
export function ConversationList({ items }: { items: Conversation[] }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
      {items.map((item) => {
        const other = item.role === 'client' ? item.company.name : item.client.name;
        const fromMe = item.lastSenderRole === item.role;
        const unread = item.unread > 0;
        return (
          <li key={item.id}>
            <Link
              href={`/dashboard/messages/${item.id}`}
              className="flex items-start gap-4 px-4 py-4 transition-colors hover:bg-paper focus-visible:bg-paper sm:px-6"
            >
              {item.role === 'client' ? (
                <CompanyLogo name={item.company.name} logoUrl={item.company.logoUrl} size={44} />
              ) : (
                <PersonAvatar name={item.client.name} photoUrl="" size={44} />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className={`truncate text-[15px] ${unread ? 'font-semibold text-ink' : 'font-medium text-ink'}`}>{other}</p>
                  <time dateTime={item.lastMessageAt} className="shrink-0 text-[13px] text-ink-faint">
                    {formatDate(item.lastMessageAt)}
                  </time>
                </div>
                {(item.subject || item.fromBrief) && (
                  <p className="mt-0.5 truncate text-[13px] text-ink-soft">
                    {item.fromBrief && <span className="mr-1.5 rounded-full bg-saffron-tint px-2 py-0.5 text-[11px] font-medium text-saffron-ink">Brief</span>}
                    {item.subject}
                  </p>
                )}
                <div className="mt-1 flex items-center gap-3">
                  <p className={`line-clamp-1 flex-1 text-sm ${unread ? 'text-ink' : 'text-ink-soft'}`}>
                    {fromMe && <span className="text-ink-faint">You: </span>}
                    {item.lastPreview || 'No messages yet'}
                  </p>
                  {unread && (
                    <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-brand px-1.5 py-0.5 text-xs font-semibold text-white tabular-nums">
                      <span className="sr-only">Unread: </span>
                      {item.unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
