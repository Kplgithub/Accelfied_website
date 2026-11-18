import { formatDay, TIME_ZONE } from '@/lib/format';
import type { ChatMessage } from '@/lib/types';

const time = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: TIME_ZONE });

/** Messages grouped by IST day, mine on the right. */
export function MessageBubbles({ messages, otherName }: { messages: ChatMessage[]; otherName: string }) {
  const days = messages.map((message) => formatDay(message.createdAt));
  return (
    <ol className="flex flex-col gap-3" aria-label="Messages">
      {messages.map((message, index) => {
        const day = days[index]!;
        const showDay = index === 0 || day !== days[index - 1];
        return (
          <li key={message.id} className="flex flex-col">
            {showDay && (
              <p className="my-3 self-center rounded-full bg-paper-deep px-3 py-1 text-xs font-medium text-ink-soft">{day}</p>
            )}
            <div className={`flex max-w-[85%] flex-col sm:max-w-[75%] ${message.mine ? 'self-end items-end' : 'self-start items-start'}`}>
              <p className="sr-only">{message.mine ? 'You' : otherName}:</p>
              <div
                className={`rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed break-words whitespace-pre-line ${
                  message.mine ? 'rounded-br-md bg-night text-paper' : 'rounded-bl-md border border-line bg-surface text-ink'
                }`}
              >
                {message.body}
              </div>
              <time dateTime={message.createdAt} className="mt-1 px-1 text-[12px] text-ink-faint">
                {time.format(new Date(message.createdAt))} IST
              </time>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
