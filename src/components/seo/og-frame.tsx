import type { ReactNode } from 'react';

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
        <svg width="64" height="64" viewBox="0 0 36 36">
          <rect width="36" height="36" rx="10" fill="#C7362F" />
          <path d="M9.5 26.5L18 9.5l8.5 17" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 21.2c3.6-1.6 7.6-1.9 12.4-.6" fill="none" stroke="#8CCBE2" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>Accelfied</span>
      </div>
      {children}
    </div>
  );
}

export const OG_SIZE = { width: 1200, height: 630 };
