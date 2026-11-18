import type { Metadata } from 'next';
import Link from 'next/link';
import { DashboardHeader } from '@/components/dashboard/bits';
import { Pagination } from '@/components/directory/pagination';
import { ConversationList } from '@/components/messages/conversation-list';
import { LiveRefresh } from '@/components/messages/live-refresh';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { getMyCompany, getMyConversations, getUnreadCounts } from '@/lib/account-data';
import { pageParam } from '@/lib/page-param';
import { requireUser } from '@/lib/session';
import type { SenderRole } from '@/lib/types';

export const metadata: Metadata = { title: 'Messages' };

export default async function MessagesPage({ searchParams }: PageProps<'/dashboard/messages'>) {
  const params = await searchParams;
  const page = pageParam(params.page);
  const { user, token } = await requireUser('/dashboard/messages');
  const [company, unread] = await Promise.all([getMyCompany('/dashboard/messages'), getUnreadCounts(token)]);
  // Company owners land on their company inbox unless they chose the other one.
  const as: SenderRole = company && (params.as === 'company' || (params.as !== 'client' && (user.accountType === 'provider' || unread.company > 0))) ? 'company' : 'client';
  const list = await getMyConversations('/dashboard/messages', as, page);
  const tabs: Array<{ as: SenderRole; label: string; count: number }> = company
    ? [
        { as: 'company', label: `${company.name} inbox`, count: unread.company },
        { as: 'client', label: 'As a client', count: unread.client },
      ]
    : [];

  return (
    <>
      <LiveRefresh seconds={30} />
      <DashboardHeader
        eyebrow="Inbox"
        title="Messages"
        intro={as === 'company' ? 'Conversations with clients who wrote to your company or sent you a brief.' : 'Your conversations with companies. They reply here and we email you.'}
        action={as === 'client' ? <ButtonLink href="/agencies" size="sm" variant="secondary">Find a company</ButtonLink> : undefined}
      />
      {tabs.length > 0 && (
        <nav aria-label="Inbox" className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Link
              key={tab.as}
              href={`/dashboard/messages?as=${tab.as}`}
              aria-current={tab.as === as ? 'page' : undefined}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                tab.as === as ? 'bg-night text-paper' : 'bg-surface text-ink-soft ring-1 ring-line-strong hover:text-ink'
              }`}
            >
              {tab.label}
              {tab.count > 0 && <span className="rounded-full bg-brand px-1.5 text-xs text-white tabular-nums">{tab.count}</span>}
            </Link>
          ))}
        </nav>
      )}
      {list.items.length ? (
        <>
          <ConversationList items={list.items} />
          <Pagination page={list.page} totalPages={list.totalPages} hrefFor={(p) => `/dashboard/messages?as=${as}&page=${p}`} />
        </>
      ) : as === 'company' ? (
        <EmptyState title="No messages yet">When a client writes to your company or sends you a brief, the conversation shows up here.</EmptyState>
      ) : (
        <EmptyState title="No conversations yet" action={<ButtonLink href="/agencies">Browse companies</ButtonLink>}>
          Open any company profile and choose “Send a message” to ask a question before you hire.
        </EmptyState>
      )}
    </>
  );
}
