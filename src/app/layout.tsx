import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import '../styles/tailwind.css';
import BackToTop from '@/components/BackToTop';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; // <-- Import Footer (sesuaikan path jika berbeda)
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';
import CommandPalette from '@/components/CommandPalette';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://fandyalmana.my.id'),
  title: 'Fandy Aziz — Educator, Builder & Digital Explorer',
  description: 'Personal portfolio of Fandy Aziz showcasing education, web development, digital transformation, and vocational innovation from East Java, Indonesia.',
  verification: {
    google: 'google-site-verification=aFwjWKDVbOw1HtrmLP21uCMO1UIXLR0A2UJYqPqSMYw'
  },
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
  openGraph: {
    title: 'Fandy Aziz — Educator, Builder & Digital Explorer',
    description: 'Building digital experiences for education through technology, vocational learning, and real-world innovation.',
    url: 'https://fandyalmana.my.id',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fandy Aziz — Educator, Builder & Digital Explorer',
    description: 'Building digital experiences for education through technology, vocational learning, and real-world innovation.',
    images: ['/assets/images/app_logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <BackToTop />
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}