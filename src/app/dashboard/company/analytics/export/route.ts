import { ApiError, apiPrivateGet } from '@/lib/api';
import { pageName } from '@/lib/page-name';
import { getSessionToken } from '@/lib/session';
import { PERFORMANCE_DAYS, type Performance } from '@/lib/vendor-tools';

/** Quotes a CSV cell, and stops spreadsheet apps from running cells that start like a formula. */
function cell(value: string | number): string {
  const text = String(value);
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

/** The analytics page as a spreadsheet: one row per day, then one row per page. Dates are IST days. */
export async function GET(request: Request): Promise<Response> {
  const token = await getSessionToken();
  if (!token) return new Response('Please log in again.', { status: 401 });
  const params = new URL(request.url).searchParams;
  const raw = Number(params.get('days'));
  const days = (PERFORMANCE_DAYS as readonly number[]).includes(raw) ? raw : 90;
  const page = (params.get('page') ?? '').slice(0, 300);
  let stats: Performance;
  try {
    stats = await apiPrivateGet<Performance>('/v1/me/company/performance', token, { days, ...(page ? { page } : {}) });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 502;
    return new Response(status === 404 ? 'No company listing on this account.' : 'Could not export right now.', { status });
  }
  const lines: string[] = [];
  lines.push(['Day (IST)', 'Seen in lists', 'Profile views', ...(stats.page ? [] : ['Website clicks'])].map(cell).join(','));
  for (const row of stats.series) {
    lines.push([row.day, row.impressions, row.views, ...(stats.page ? [] : [row.websiteClicks])].map(cell).join(','));
  }
  lines.push('');
  lines.push(['Page', 'Address', 'Seen in lists', 'Profile views', 'Average position'].map(cell).join(','));
  for (const row of stats.pages) {
    lines.push([pageName(row.page), row.page, row.impressions, row.views, row.avgPosition || ''].map(cell).join(','));
  }
  const name = `accelfied-performance-${stats.from}-to-${stats.to}${stats.page ? '-one-page' : ''}.csv`;
  return new Response(`﻿${lines.join('\r\n')}\r\n`, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${name}"`,
      'cache-control': 'private, no-store',
    },
  });
}
