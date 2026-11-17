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
  metadataBase: new URL(site.url),
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
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: site.name,
    title,
    description: site.description,
    url: site.url,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Roti Bakar Hersha — Roti Bakar Empuk Ginuk Ginuk',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: site.description,
    images: ['/og.png'],
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
  url: site.url,
  image: `${site.url}/og.png`,
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
  openingHoursSpecification: site.hours.map((row, index) => ({
    '@type': 'OpeningHoursSpecification',
    // Schema.org memakai nama hari bahasa Inggris; nama Indonesia tidak dikenali crawler.
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][
      index
    ],
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
