import type { ReactNode } from 'react';
import {
  BRAND_RED,
  LOGO_HEIGHT,
  LOGO_WIDTH,
  MARK_ARROW_BOTTOM,
  MARK_ARROW_TOP,
  MARK_TILE,
  WORDMARK_DOT,
  WORDMARK_PATH,
} from '../layout/brand-mark';

/** Shared look for link preview images: brand colours, logo mark and wordmark. Rendered by next/og. */
export function OgFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        background: 'linear-gradient(135deg, #17313B 0%, #17313B 55%, #1B7499 140%)',
        color: '#F7F9FA',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <svg width={(LOGO_WIDTH * 64) / LOGO_HEIGHT} height="64" viewBox={`0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}`}>
          <path d={MARK_TILE} fill={BRAND_RED} />
          <path d={MARK_ARROW_TOP} fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <path d={MARK_ARROW_BOTTOM} fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <path d={WORDMARK_PATH} fill="#F7F9FA" />
          <circle cx={WORDMARK_DOT.cx} cy={WORDMARK_DOT.cy} r={WORDMARK_DOT.r} fill={BRAND_RED} />
        </svg>
      </div>
      {children}
    </div>
  );
}

export const OG_SIZE = { width: 1200, height: 630 };
