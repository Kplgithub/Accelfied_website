import { checkPath, rosettePath } from '@/lib/badges/art';

/**
 * Accelfied's Verified mark: the eight-point rosette from the badge seal with a check.
 * Blue teal for Verified; brick red over a soft red rosette for Premier Verified.
 */
export function SealIcon({ premier = false, className = 'size-4' }: { premier?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      {premier && <path d={rosettePath(12, 12, 8.6, 2.4, 22.5)} fill="#C7362F" fillOpacity={0.45} />}
      <path d={rosettePath(12, 12, 8.2, 2.4)} fill={premier ? '#C7362F' : '#1B7499'} />
      <path d={checkPath(12, 12, 18.7)} fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Small award ribbon icon for "Top {service} company" awards. */
export function AwardIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d="M7.4 15.5h3.2V23l-1.6-1.4L7.4 23z" fill="#C7362F" transform="rotate(8 9 16)" />
      <path d="M13.4 15.5h3.2V23l-1.6-1.4-1.6 1.4z" fill="#C7362F" transform="rotate(-8 15 16)" />
      <rect x="3.5" y="1.5" width="17" height="16" rx="4.2" fill="#17313B" />
      <rect x="3.5" y="12.6" width="17" height="4.9" fill="#C7362F" />
      <rect x="3.5" y="1.5" width="17" height="16" rx="4.2" fill="none" stroke="#17313B" strokeWidth="1.2" />
      <path d="M8.6 9.4 12 6l3.4 3.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
