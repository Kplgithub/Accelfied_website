import type { Socials } from '@/lib/types';

const LABELS: Record<keyof Socials, string> = {
  linkedin: 'LinkedIn',
  x: 'X',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
};

/**
 * Small marks for social networks, drawn here because the icon set has no
 * brand logos. Each sits in a circle so they read as one row.
 */
function Mark({ network }: { network: keyof Socials }) {
  switch (network) {
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor">
          <rect x="3" y="9" width="3.6" height="12" rx="0.6" />
          <circle cx="4.8" cy="5" r="2.1" />
          <path d="M9.6 9h3.4v1.7c.6-1.1 2-2 3.9-2 3.2 0 4.1 2 4.1 5V21h-3.6v-6.6c0-1.6-.4-2.7-1.9-2.7-1.6 0-2.3 1.2-2.3 2.8V21H9.6z" />
        </svg>
      );
    case 'x':
      return (
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor">
          <path d="M4 3h4.6l4.1 5.8L17.7 3H20l-6.2 7.1L21 21h-4.6l-4.5-6.3L6.3 21H4l6.8-7.8z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor">
          <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.6-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor">
          <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8M10 15V9l5.2 3z" />
        </svg>
      );
  }
}

/** A row of links to a company's social pages. Renders nothing when there are none. */
export function SocialLinks({ socials, companyName }: { socials: Socials; companyName: string }) {
  const entries = (Object.keys(LABELS) as Array<keyof Socials>).filter((key) => socials[key]);
  if (!entries.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {entries.map((key) => (
        <li key={key}>
          <a
            href={socials[key]}
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label={`${companyName} on ${LABELS[key]}`}
            className="grid size-9 place-items-center rounded-full border border-line bg-surface text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
          >
            <Mark network={key} />
          </a>
        </li>
      ))}
    </ul>
  );
}
