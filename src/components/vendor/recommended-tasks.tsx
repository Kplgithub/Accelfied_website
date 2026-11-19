'use client';

import { ArrowRight, CheckCircle2, Clock3, RotateCcw, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useOptimistic, useState, useTransition } from 'react';
import { setTaskSkipped } from '@/app/vendor-tools-actions';
import type { RecommendedTask } from '@/lib/tasks';

type Tab = 'todo' | 'skipped' | 'done';
const PAGE = 5;

export function RecommendedTasks({ tasks, skipped }: { tasks: RecommendedTask[]; skipped: string[] }) {
  const [tab, setTab] = useState<Tab>('todo');
  const [showAll, setShowAll] = useState(false);
  const [problem, setProblem] = useState('');
  const [, startTransition] = useTransition();
  const [skippedNow, toggle] = useOptimistic(skipped, (current: string[], change: { key: string; skip: boolean }) =>
    change.skip ? [...new Set([...current, change.key])] : current.filter((key) => key !== change.key),
  );
  const isSkipped = (task: RecommendedTask) => !task.done && skippedNow.includes(task.key);
  const lists: Record<Tab, RecommendedTask[]> = {
    todo: tasks.filter((task) => !task.done && !isSkipped(task)),
    skipped: tasks.filter(isSkipped),
    done: tasks.filter((task) => task.done),
  };
  const current = lists[tab];
  const visible = showAll ? current : current.slice(0, PAGE);

  const change = (key: string, skip: boolean) => {
    setProblem('');
    startTransition(async () => {
      toggle({ key, skip });
      const result = await setTaskSkipped(key, skip);
      if (!result.ok) setProblem('That did not save. Please try again.');
    });
  };

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'todo', label: 'To do' },
    { id: 'skipped', label: 'Skipped' },
    { id: 'done', label: 'Done' },
  ];

  return (
    <section className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
            <Sparkles className="size-5 text-saffron" aria-hidden="true" />
            Recommended next steps
          </h2>
          <p className="mt-1 text-sm text-ink-soft">Small jobs that bring more profile views and more briefs.</p>
        </div>
        <p className="text-sm text-ink-soft tabular-nums">
          {lists.done.length} of {tasks.length} done
        </p>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-paper-deep">
        <div className="h-full rounded-full bg-gradient-to-r from-accent to-success transition-[width] duration-700" style={{ width: `${(lists.done.length / Math.max(1, tasks.length)) * 100}%` }} />
      </div>
      <div role="tablist" aria-label="Task lists" className="mt-5 inline-flex rounded-full bg-paper p-1 ring-1 ring-line">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => {
              setTab(item.id);
              setShowAll(false);
            }}
            className={`cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors sm:px-4 ${tab === item.id ? 'bg-night text-paper shadow-sm' : 'text-ink-soft hover:text-ink'}`}
          >
            {item.label} <span className="tabular-nums opacity-70">({lists[item.id].length})</span>
          </button>
        ))}
      </div>
      {problem && (
        <p role="alert" className="mt-3 text-sm font-medium text-danger">
          {problem}
        </p>
      )}
      <ul role="tabpanel" className="mt-4 divide-y divide-line">
        {visible.map((task) => (
          <li key={task.key} className="flex items-center gap-3 py-3.5 animate-rise">
            {tab === 'done' ? (
              <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden="true" />
            ) : (
              <span className="size-5 shrink-0 rounded-full border-2 border-line-strong" aria-hidden="true" />
            )}
            <div className="min-w-0 flex-1">
              {tab === 'done' ? (
                <p className="font-medium text-ink-soft line-through decoration-ink-faint/60">{task.title}</p>
              ) : (
                <Link href={task.href} className="group inline-flex items-center gap-1.5 font-medium text-ink hover:text-accent">
                  {task.title}
                  <ArrowRight className="size-3.5 text-accent transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              )}
              <p className="text-sm text-ink-soft">{task.tip}</p>
              {tab !== 'done' && (
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-ink-faint">
                  <Clock3 className="size-3" aria-hidden="true" />
                  About {task.minutes} min
                </p>
              )}
            </div>
            {tab === 'todo' && (
              <button type="button" onClick={() => change(task.key, true)} className="shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-sm text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink">
                Skip
              </button>
            )}
            {tab === 'skipped' && (
              <button
                type="button"
                onClick={() => change(task.key, false)}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent-tint"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Restore
              </button>
            )}
          </li>
        ))}
        {current.length === 0 && (
          <li className="py-6 text-center text-sm text-ink-soft">
            {tab === 'todo' ? 'Nothing left to do. Your profile is in great shape.' : tab === 'skipped' ? 'You have not skipped anything.' : 'Finished tasks show here.'}
          </li>
        )}
      </ul>
      {current.length > PAGE && (
        <button type="button" onClick={() => setShowAll((value) => !value)} className="mt-2 cursor-pointer text-sm font-medium text-accent hover:underline">
          {showAll ? 'Show fewer' : `Show all ${current.length}`}
        </button>
      )}
    </section>
  );
}
