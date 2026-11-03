import { ImageResponse } from 'next/og';
import { OG_SIZE, OgFrame } from '@/components/seo/og-frame';

export const alt = 'Accelfied: find agencies your peers trust';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <OgFrame>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 950 }}>
            Hire a company you can trust with your project.
          </div>
          <div style={{ fontSize: 32, color: '#8CCBE2' }}>Compare agencies by verified client reviews, rates and real work.</div>
        </div>
      </OgFrame>
    ),
    size,
  );
}
