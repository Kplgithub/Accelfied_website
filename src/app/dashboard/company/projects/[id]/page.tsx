import { ArrowLeft, CheckCircle2, Clock3, ExternalLink, FolderOpen, XCircle } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Panel } from '@/components/dashboard/bits';
import { NoCompany } from '@/components/dashboard/no-company';
import { Stars } from '@/components/ui/stars';
import { FeaturedToggle } from '@/components/vendor/featured-toggle';
import { ProjectPortfolioForm } from '@/components/vendor/project-portfolio-form';
import { getMyCompany } from '@/lib/account-data';
import { formatDate, formatMonthYear } from '@/lib/format';
import { budgetLabel } from '@/lib/labels';
import { getMyProject } from '@/lib/vendor-tools';

export const metadata: Metadata = { title: 'Project' };

const STATUS = {
  published: { icon: CheckCircle2, title: (client: string) => `Your project for ${client} is live`, text: 'This review shows on your profile. This is what clients see.' },
  pending: { icon: Clock3, title: (client: string) => `Your project for ${client} is being checked`, text: 'Our team confirms the reviewer and the project, usually within two working days.' },
  rejected: { icon: XCircle, title: (client: string) => `The review from ${client} was not approved`, text: 'It does not show on your profile or count towards your rating.' },
} as const;

const RATINGS = [
  { key: 'quality', label: 'Quality' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'cost', label: 'Cost' },
  { key: 'willingToRefer', label: 'Would refer' },
] as const;

const SECTIONS = [
  { key: 'background', label: 'About the client' },
  { key: 'challenge', label: 'The challenge' },
  { key: 'solution', label: 'What the team did' },
  { key: 'results', label: 'Results' },
] as const;

export default async function ProjectPage({ params }: PageProps<'/dashboard/company/projects/[id]'>) {
  const { id } = await params;
  const here = `/dashboard/company/projects/${id}`;
  const company = await getMyCompany(here);
  if (!company || company.status === 'rejected') return <NoCompany />;
  const project = await getMyProject(here, id);
  if (!project) notFound();
  const { review } = project;
  const client = project.reviewer.companyName || project.reviewer.name;
  const status = STATUS[project.status];
  const StatusIcon = status.icon;

  return (
    <>
      <Link href="/dashboard/company/projects" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to projects
      </Link>

      <header
        className={`relative mb-6 overflow-hidden rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-lift)] sm:p-7 ${
          project.status === 'published' ? 'bg-night text-paper' : project.status === 'pending' ? 'border border-saffron/40 bg-saffron-tint text-ink' : 'border border-danger/30 bg-danger-tint text-ink'
        }`}
      >
        {project.status === 'published' && <div className="pointer-events-none absolute -top-20 -right-12 size-60 rounded-full bg-accent/35 blur-3xl" aria-hidden="true" />}
        <div className="relative flex items-start gap-4">
          <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${project.status === 'published' ? 'bg-white/10' : 'bg-surface'}`}>
            <StatusIcon className={`size-6 ${project.status === 'published' ? 'text-accent-soft' : project.status === 'pending' ? 'text-saffron-ink' : 'text-danger'}`} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-2xl leading-tight font-semibold sm:text-3xl">{status.title(client)}</h1>
            <p className={`mt-1 ${project.status === 'published' ? 'text-paper/75' : 'text-ink-soft'}`}>{status.text}</p>
            {project.moderationNote && <p className="mt-2 text-sm font-medium">Note from our team: {project.moderationNote}</p>}
          </div>
        </div>
      </header>

      <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase">
        {project.project.serviceName} · {project.project.title}
      </p>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Panel>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold text-ink">{project.verified ? 'Verified review' : 'Client review'}</h2>
              {project.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-tint px-2.5 py-1 text-xs font-medium text-accent">
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                  Reviewer confirmed
                </span>
              )}
            </div>
            {project.status === 'published' && (
              <div className="mb-6">
                <FeaturedToggle reviewId={project.id} featured={project.featured} />
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-night font-semibold text-paper">{project.reviewer.name.slice(0, 1).toUpperCase()}</span>
              <div className="min-w-0">
                <p className="font-medium text-ink">
                  {project.reviewer.name}
                  {project.reviewer.anonymous && <span className="ml-2 rounded-full bg-paper-deep px-2 py-0.5 text-xs font-normal text-ink-soft">Shown without name</span>}
                </p>
                <p className="text-sm text-ink-soft">
                  {project.reviewer.jobTitle}, {project.reviewer.companyName}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Stars value={review.ratings.overall} size={18} />
              <span className="font-semibold text-ink tabular-nums">{review.ratings.overall.toFixed(1)}</span>
            </div>
            <blockquote className="mt-4 border-l-2 border-accent pl-4 text-[15px] text-ink italic">“{firstSentence(review.content.results)}”</blockquote>
            <div className="mt-6 space-y-5">
              {SECTIONS.map((section) => (
                <section key={section.key}>
                  <h3 className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">{section.label}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed whitespace-pre-line text-ink-soft">{review.content[section.key]}</p>
                </section>
              ))}
            </div>
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Ratings">
            <dl className="space-y-3">
              {RATINGS.map((rating) => (
                <div key={rating.key} className="flex items-center justify-between gap-3">
                  <dt className="text-sm text-ink-soft">{rating.label}</dt>
                  <dd className="flex items-center gap-2">
                    <Stars value={review.ratings[rating.key]} size={14} />
                    <span className="w-7 text-right text-sm font-medium text-ink tabular-nums">{review.ratings[rating.key].toFixed(1)}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>
          <Panel title="Project details">
            <dl className="space-y-3 text-sm">
              <Row label="Service" value={review.project.serviceName} />
              <Row label="Budget" value={budgetLabel(review.project.budget)} />
              <Row label="Started" value={formatMonthYear(review.project.startedOn)} />
              <Row label="Ended" value={review.project.ongoing ? 'Still running' : review.project.endedOn ? formatMonthYear(review.project.endedOn) : '–'} />
              <Row label="Received" value={formatDate(project.createdAt)} />
              {project.publishedAt && <Row label="Published" value={formatDate(project.publishedAt)} />}
            </dl>
          </Panel>
          <section id="portfolio" className="scroll-mt-32 rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-ink">
              <FolderOpen className="size-5 text-accent" aria-hidden="true" />
              Portfolio item
            </h2>
            {project.portfolioItem ? (
              <div>
                {project.portfolioItem.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element -- uploaded pictures are already resized by the API
                  <img src={project.portfolioItem.imageUrl} alt="" loading="lazy" decoding="async" className="mb-4 aspect-[16/10] w-full rounded-xl bg-paper-deep object-cover" />
                )}
                <p className="font-medium text-ink">{project.portfolioItem.title}</p>
                {project.portfolioItem.description && <p className="mt-1 text-sm text-ink-soft">{project.portfolioItem.description}</p>}
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  {project.portfolioItem.url && (
                    <a href={project.portfolioItem.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-accent hover:underline">
                      Open project <ExternalLink className="size-3.5" aria-hidden="true" />
                    </a>
                  )}
                  <Link href="/dashboard/company/portfolio" className="font-medium text-ink-soft hover:text-ink">
                    Manage portfolio
                  </Link>
                </div>
              </div>
            ) : project.status === 'rejected' ? (
              <p className="text-sm text-ink-soft">Projects without an approved review cannot be added.</p>
            ) : (
              <ProjectPortfolioForm projectId={project.id} title={project.project.title} />
            )}
          </section>
        </aside>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

/** The opening line of the results, as a short quote at the top. */
function firstSentence(text: string): string {
  const sentence = text.split(/(?<=[.!?])\s+/)[0] ?? text;
  return sentence.length > 220 ? `${sentence.slice(0, 217)}…` : sentence;
}
