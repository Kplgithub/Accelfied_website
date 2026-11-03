/** All dates on the site are shown in Indian Standard Time. */
export const TIME_ZONE = 'Asia/Kolkata';

const monthYear = new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric', timeZone: TIME_ZONE });
const fullDate = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: TIME_ZONE,
});
const dayOnly = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: TIME_ZONE });
const compact = new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat('en-IN');

export function formatMonthYear(iso: string): string {
  return monthYear.format(new Date(iso));
}

export function formatDate(iso: string): string {
  return `${fullDate.format(new Date(iso))} IST`;
}

/** Calendar day in IST, without the time. */
export function formatDay(iso: string): string {
  return dayOnly.format(new Date(iso));
}

export function formatCount(value: number): string {
  return value >= 10_000 ? compact.format(value) : whole.format(value);
}

export function formatRating(value: number): string {
  return value.toFixed(1);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${formatCount(count)} ${count === 1 ? singular : plural}`;
}

export function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
