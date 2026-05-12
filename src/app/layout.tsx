import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pakistan Halal Investment Platform',
  description: 'A voice-controlled halal investment platform for Pakistan',
  icons: { icon: '🕌' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ur" dir="rtl">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
