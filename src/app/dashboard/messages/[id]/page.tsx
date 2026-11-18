import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CompanyLogo } from '@/components/company/company-logo';
import { PersonAvatar } from '@/components/company/person-avatar';
import { LiveRefresh } from '@/components/messages/live-refresh';
import { MessageBubbles } from '@/components/messages/message-bubbles';
import { ReplyForm } from '@/components/messages/reply-form';
import { ScrollToEnd } from '@/components/messages/scroll-to-end';
import { getThread } from '@/lib/account-data';

export const metadata: Metadata = { title: 'Conversation' };

export default async function ConversationPage({ params, searchParams }: PageProps<'/dashboard/messages/[id]'>) {
  const { id } = await params;
  const before = (await searchParams).before;
  const cursor = typeof before === 'string' && /^[a-f\d]{24}$/i.test(before) ? before : undefined;
  const thread = await getThread(`/dashboard/messages/${id}`, id, cursor);
  if (!thread) notFound();
  const { conversation, messages, olderCursor } = thread;
  const asClient = conversation.role === 'client';
  const otherName = asClient ? conversation.company.name : conversation.client.name;
  const last = messages.at(-1)?.id ?? 'empty';

  return (
    <div className="flex flex-col">
      {!cursor && <LiveRefresh seconds={15} />}
      <Link
        href={`/dashboard/messages?as=${conversation.role}`}
        className="mb-5 inline-flex items-center gap-1.5 self-start text-sm font-medium text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All messages
      </Link>
      <header className="flex items-center gap-4 rounded-t-[var(--radius-card)] border border-line bg-surface px-5 py-4 sm:px-6">
        {asClient ? <CompanyLogo name={otherName} logoUrl={conversation.company.logoUrl} size={48} /> : <PersonAvatar name={otherName} photoUrl="" size={48} />}
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-xl font-semibold text-ink">{otherName}</h1>
          <p className="truncate text-sm text-ink-soft">
            {conversation.subject || (asClient ? 'Conversation with this company' : 'Client conversation')}
            {conversation.fromBrief && !asClient && (
              <>
                {' · '}
                <Link href="/dashboard/company/requests" className="font-medium text-accent underline-offset-4 hover:underline">
                  See the brief
                </Link>
              </>
            )}
          </p>
        </div>
        {asClient && conversation.company.slug && (
          <Link href={`/profile/${conversation.company.slug}`} className="hidden shrink-0 text-sm font-medium text-accent underline-offset-4 hover:underline sm:inline">
            View profile
          </Link>
        )}
      </header>
      <section aria-label={`Conversation with ${otherName}`} className="border-x border-line bg-paper px-4 py-5 sm:px-6">
        {olderCursor && (
          <div className="mb-4 text-center">
            <Link href={`/dashboard/messages/${id}?before=${olderCursor}`} className="text-sm font-medium text-accent underline-offset-4 hover:underline">
              Show older messages
            </Link>
          </div>
        )}
        {cursor && (
          <div className="mb-4 text-center">
            <Link href={`/dashboard/messages/${id}`} className="text-sm font-medium text-accent underline-offset-4 hover:underline">
              Back to the latest messages
            </Link>
          </div>
        )}
        {messages.length ? (
          <MessageBubbles messages={messages} otherName={otherName} />
        ) : (
          <p className="py-10 text-center text-ink-soft">No messages yet. Say hello.</p>
        )}
        {!cursor && <ScrollToEnd marker={last} />}
      </section>
      <div className="rounded-b-[var(--radius-card)] border border-line bg-surface p-3 sm:p-4">
        <ReplyForm conversationId={conversation.id} placeholder={`Write to ${otherName}…`} />
      </div>
      <p className="mt-3 text-[13px] text-ink-faint">
        {asClient
          ? 'Keep payments and contracts on paper you trust. Accelfied never asks you to pay a company through a message.'
          : 'Clients get an email when you reply, so answer here rather than by phone when you can.'}
      </p>
    </div>
  );
}
