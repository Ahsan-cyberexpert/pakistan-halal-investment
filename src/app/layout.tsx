import type { Metadata } from 'next';
import './globals.css';

export const viewport = {
  themeColor: '#059669',
  width: 'device-width',
  viewportFit: 'cover',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://roziq.vercel.app'),
  title: {
    default: 'Roziq | Pakistan\'s First Halal Wealth OS',
    template: '%s | Roziq',
  },
  description: 'The sovereign financial operating system for the modern Muslim. Shariah-compliant investing, automated Zakat, Hajj savings, and Riba-free growth — all in one place.',
  keywords: ['halal investing', 'Pakistan fintech', 'Shariah compliant', 'Zakat calculator', 'Islamic finance', 'PSX stocks', 'Sukuk', 'Roziq'],
  authors: [{ name: 'Roziq Team' }],
  creator: 'Roziq',
  publisher: 'Roziq',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://roziq.vercel.app',
    siteName: 'Roziq',
    title: 'Roziq | Pakistan\'s First Halal Wealth OS',
    description: 'Build wealth that stays pure. Shariah-compliant investing for the modern Muslim.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Roziq Halal Wealth OS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roziq | Pakistan\'s First Halal Wealth OS',
    description: 'Build wealth that stays pure. Shariah-compliant investing for the modern Muslim.',
    images: ['/og-image.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Roziq',
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icon.png',
    shortcut: '/icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-context="marketing" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
