import { initials } from '@/lib/format';

/**
 * Company logos come from arbitrary hosts, so a plain <img> is used instead of
 * next/image (which needs every host allow-listed). Missing logos fall back to
 * a monogram.
 */
export function CompanyLogo({ name, logoUrl, size = 56 }: { name: string; logoUrl: string; size?: number }) {
  const style = { width: size, height: size };
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={`${name} logo`}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="shrink-0 rounded-2xl border border-line bg-surface object-contain p-1.5"
        style={style}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-accent-tint font-display font-semibold text-accent"
      style={{ ...style, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </span>
  );
}
