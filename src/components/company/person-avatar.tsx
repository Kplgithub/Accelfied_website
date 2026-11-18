/** A team member's photo, or their initials when there is none. */
export function PersonAvatar({ name, photoUrl, size = 64 }: { name: string; photoUrl: string; size?: number }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- photos come from our uploads or older external links
      <img src={photoUrl} alt="" width={size} height={size} loading="lazy" decoding="async" className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="grid shrink-0 place-items-center rounded-full bg-night font-display font-semibold text-paper"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {initials}
    </span>
  );
}
