import type { Metadata } from 'next';
import '../styles/globals.css';
import { inter, poppins, montserrat } from '@/lib/fonts';
import { ClientLayout } from '@/components/layout/client-layout';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'JobMate - Connect with Local Service Specialists',
  description: 'Find trusted specialists for maintenance and handyman jobs in your area.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JobMate',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jobmate.app',
    title: 'JobMate - Connect with Local Service Specialists',
    description: 'Find trusted specialists for maintenance and handyman jobs in your area.',
    siteName: 'JobMate',
  },
};

export const themeColor = '#00a3ff';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
