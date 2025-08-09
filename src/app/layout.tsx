import type { Metadata } from 'next';
import '../styles/globals.css';
import { inter, poppins, montserrat } from '@/lib/fonts';
import { ClientLayout } from '@/components/layout/client-layout';
import { getUserFromCookies } from '@/lib/server-auth';

async function getInitialAuth() {
  return await getUserFromCookies();
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'JobMate - Connect with Local Service Specialists',
  description: 'Find trusted specialists for maintenance and handyman jobs in your area.',
  manifest: '/manifest.json',
  themeColor: '#00a3ff',
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token } = await getInitialAuth();
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ClientLayout initialUser={user} initialToken={token}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
