import type { Metadata, Viewport } from 'next';
import { profile } from '@/data/profile';
import './globals.css';

export const metadata: Metadata = {
  title: `${profile.fullName} · Portafolio`,
  description: `Portafolio de ${profile.fullName}: ${profile.role}. Un libro, una fogata y una historia por descubrir.`,
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#17120c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Se cargan por <link> (y no con next/font) porque la escena 3D dibuja textos en
            texturas de canvas usando estos nombres de familia exactos. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Cinzel:wght@400;500;600&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
