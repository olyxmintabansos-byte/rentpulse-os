import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RentPulse OS | Smart Property & Kos-Kosan Rental Management',
  description: 'Sistem Operasi Manajemen Kos-Kosan, Kontrakan, Ruko, & Apartemen Sewa Terpadu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
