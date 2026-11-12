import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'DeporAnalytics | Telemetría Táctica de Élite & Scouting con Gemini IA',
  description:
    'Plataforma de análisis táctico de fútbol y telemetría deportiva estilo broadcast de la Premier League y EA Sports FC, impulsada al 100% por Gemini API.',
  keywords: [
    'fútbol',
    'tactical analysis',
    'mapa de calor',
    'sports telemetry',
    'Gemini AI',
    'scouting',
    'Nike Football Labs',
  ],
};

export const viewport: Viewport = {
  themeColor: '#070B0E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="stadium-mesh-bg min-h-screen text-[var(--color-text-main)] antialiased selection:bg-volt selection:text-stadium-base">
        {children}
      </body>
    </html>
  );
}
