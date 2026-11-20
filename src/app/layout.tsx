import type { Metadata, Viewport } from 'next';
import { Fraunces, Geist } from 'next/font/google';
import { GoogleTagManager, GoogleTagManagerNoScript } from '@/components/analytics/google-tag-manager';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { NavigationProgress } from '@/components/layout/navigation-progress';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'], display: 'swap' });
const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
  axes: ['opsz'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Accelfied: Best IT, Software & Marketing Companies in India',
    template: '%s | Accelfied',
  },
  description:
    'Compare software, app, web design and digital marketing companies across India by checked client reviews, rates and budgets. Free for businesses.',
  openGraph: { siteName: 'Accelfied', type: 'website', locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#f7f9fa',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geist.variable} ${fraunces.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <GoogleTagManagerNoScript />
        <NavigationProgress />
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-brand px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <div data-public-extra="">
          <AnnouncementBar />
        </div>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <GoogleTagManager />
      </body>
    </html>
  );
}
