import type { Metadata } from 'next';
import '../styles/globals.css';
import { inter, poppins, montserrat } from '@/lib/fonts';
import { ClientLayout } from '@/components/layout/client-layout';
import { cookies } from 'next/headers';

async function getInitialAuth() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value || null;
    if (!token) return { user: null, token: null };
    // Call internal API to fetch user on the server
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      // Ensure this runs on the server without caching stale auth
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    if (!res.ok) return { user: null, token: null };
    const user = await res.json();
    return { user, token };
  } catch (e) {
    return { user: null, token: null };
  }
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
