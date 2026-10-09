import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Campingpilot – Campingplatz-Verwaltung leicht gemacht',
  description:
    'Reservierungs- und Verwaltungssystem für Wohnmobilparks und Campingplätze. Stellplätze, Reservierungen, Preise und Abrechnung – alles in einer Lösung.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
