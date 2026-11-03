import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/data';

/** A thin bar above the header, switched on from the admin panel. */
export async function AnnouncementBar() {
  const { announcement } = await getSiteSettings();
  if (!announcement.active || !announcement.text) return null;
  const external = announcement.href.startsWith('https://');
  return (
    <div className="bg-night text-paper print:hidden">
      <p className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-sm">
        <span>{announcement.text}</span>
        {announcement.href && announcement.linkLabel && (
          <Link
            href={announcement.href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="inline-flex items-center gap-1 font-semibold text-accent-soft underline-offset-4 hover:text-white hover:underline"
          >
            {announcement.linkLabel} <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        )}
      </p>
    </div>
  );
}
