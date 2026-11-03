import { ImageResponse } from 'next/og';
import { OG_SIZE, OgFrame } from '@/components/seo/og-frame';
import { getCompany } from '@/lib/data';
import { formatRating, pluralize } from '@/lib/format';

export const alt = 'Company profile on Accelfied';
export const size = OG_SIZE;
export const contentType = 'image/png';

/** Link preview for a company profile. Rating appears only when real published reviews exist. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const company = await getCompany((await params).slug);
  return new ImageResponse(
    (
      <OgFrame>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 78, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05, maxWidth: 820 }}>{company?.name ?? 'Accelfied'}</div>
            {company?.verified && (
              <div style={{ display: 'flex', fontSize: 28, fontWeight: 600, padding: '8px 20px', borderRadius: 999, background: '#1B7499' }}>
                Verified
              </div>
            )}
          </div>
          {company?.tagline && <div style={{ fontSize: 32, color: 'rgba(247,249,250,0.78)', maxWidth: 1000 }}>{company.tagline.slice(0, 120)}</div>}
          {company && company.rating.count > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 34 }}>
              <span style={{ fontWeight: 700 }}>{formatRating(company.rating.average)}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} width="34" height="34" viewBox="0 0 24 24">
                    <path
                      d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6-4.9-4.6 6.6-.8z"
                      fill={star <= Math.floor(company.rating.average + 0.25) ? '#F0A531' : 'rgba(247,249,250,0.25)'}
                    />
                  </svg>
                ))}
              </div>
              <span style={{ color: '#8CCBE2' }}>{pluralize(company.rating.count, 'client review')}</span>
            </div>
          )}
        </div>
      </OgFrame>
    ),
    size,
  );
}
