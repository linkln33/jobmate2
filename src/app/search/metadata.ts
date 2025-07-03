import type { Metadata, Viewport } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'JobMate Search',
  description: 'Search for jobs, specialists, and services on JobMate.',
  openGraph: {
    title: 'JobMate Search',
    description: 'Search for jobs, specialists, and services on JobMate.',
    url: 'https://jobmate.vercel.app/search',
    siteName: 'JobMate',
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};
