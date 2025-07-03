import type { Metadata, Viewport } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'JobMate Waitlist',
  description: 'Join the JobMate waitlist to get early access to our platform.',
  openGraph: {
    title: 'JobMate Waitlist',
    description: 'Join the JobMate waitlist to get early access to our platform.',
    url: 'https://jobmate.vercel.app/waitlist',
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
