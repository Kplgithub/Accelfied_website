/** Readable names for the pages a company appears on. */
export function pageName(path: string): string {
  if (path === '/') return 'Home page';
  if (path === '/agencies') return 'All companies';
  if (path === '/dashboard/shortlist') return 'Client shortlists';
  const parts = path.split('/').filter(Boolean);
  if (parts[0] === 'agencies') return parts.slice(1).map((part) => part.replace(/-/g, ' ')).join(' in ').replace(/^\w/, (c) => c.toUpperCase());
  if (parts[0] === 'blog') return parts[1] ? `Blog: ${parts[1].replace(/-/g, ' ')}` : 'Blog';
  if (parts[0] === 'profile') return 'Other company profiles';
  if (parts[0] === 'industries' && parts[1]) return `Industry: ${parts[1].replace(/-/g, ' ')}`;
  return path;
}
