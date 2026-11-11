import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { profile } from '@/data/profile';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${profile.fullName} · Portafolio`,
  description: `Portafolio de ${profile.fullName}: desarrollador Full Stack · Backend, IA y experiencias web. Portfolio in Spanish and English.`,
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#0b0a10',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`scroll-smooth ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
