import type { Metadata, Viewport } from 'next';
import { Manrope, Satisfy, Sora } from 'next/font/google';

import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { site } from '@/lib/site';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

// Script untuk wordmark logo "Hersha" (mendekati lettering di logo asli).
const satisfy = Satisfy({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-logo',
  display: 'swap',
});

const title = 'Roti Bakar Hersha — Empuk Ginuk Ginuk, Dipanggang di Atas Bara';

export const metadata: Metadata = {
  title: {
    default: title,
    template: '%s · Roti Bakar Hersha',
  },
  description: site.description,
  keywords: [
    'roti bakar',
    'roti bakar bandung',
    'roti bakar hersha',
    'coklat keju',
    'roti bakar karanganyar',
    'kuliner karanganyar',
    'roti bakar solo',
    'gofood roti bakar',
  ],
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: site.name,
    title,
    description: site.description,
    url: 'https://rotibakarhersha.com',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0a0908',
  colorScheme: 'dark',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: site.name,
  description: site.description,
  servesCuisine: ['Indonesian', 'Dessert', 'Toast'],
  priceRange: 'Rp 20.000 – Rp 30.000',
  telephone: site.whatsapp.display,
  url: 'https://rotibakarhersha.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: site.city,
    addressRegion: site.region,
    postalCode: site.address.postalCode,
    addressCountry: 'ID',
  },
  areaServed: ['Karanganyar', 'Solo', 'Jawa Tengah'],
  hasMap: site.maps.directions,
  geo: {
    '@type': 'GeoCoordinates',
    latitude: site.geo.lat,
    longitude: site.geo.lng,
  },
  sameAs: [site.instagram.link, site.gofood.link],
  openingHoursSpecification: site.hours.map((row) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: row.day,
    opens: row.open.replace('.', ':'),
    closes: row.close === '24.00' ? '23:59' : row.close.replace('.', ':'),
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${sora.variable} ${manrope.variable} ${satisfy.variable}`}>
      <body className="bg-ink font-body text-cream antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-cream focus:px-5 focus:py-3 focus:text-[13px] focus:font-semibold focus:text-ink"
        >
          Lewati ke konten
        </a>

        <SmoothScroll />
        <CustomCursor />
        <Header />

        <main id="main">{children}</main>

        <Footer />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
