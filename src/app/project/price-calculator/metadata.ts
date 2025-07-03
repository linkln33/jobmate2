import type { Metadata, Viewport } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'JobMate Price Calculator',
  description: 'Calculate project prices and estimates for your services.',
  openGraph: {
    title: 'JobMate Price Calculator',
    description: 'Calculate project prices and estimates for your services.',
    url: 'https://jobmate.vercel.app/project/price-calculator',
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
