import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { SafetyHeader } from '@/components/SafetyHeader';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SILENCE.OBJECTS — Command Center',
  description: 'Structural self-observation system. You control the pattern.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-neutral-950 font-sans text-neutral-100 antialiased`}
      >
        <SafetyHeader />
        <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
