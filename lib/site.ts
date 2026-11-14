/**
 * Satu sumber kebenaran untuk seluruh konten bisnis.
 * Ganti nilai di sini saat data asli Roti Bakar Hersha sudah siap —
 * tidak ada teks bisnis yang di-hardcode di komponen.
 *
 * MULTI-OUTLET
 * ------------
 * - `outlets[0]` adalah outlet utama (rumah owner di Bonoroto). Nilainya
 *   dipakai otomatis oleh Header, Footer, dan JSON-LD lewat alias di bawah.
 * - Outlet kedua dan ketiga masih PLACEHOLDER level area (bukan alamat pasti).
 *   Saat lokasi aslinya sudah fix, ganti `name`, `address`, `maps`, `hours`,
 *   dan ubah `status` menjadi 'open'. Komentar di tiap outlet menandai bagian
 *   yang perlu diedit.
 */

const WA_NUMBER = '6281234567890'; // format internasional tanpa "+" & spasi

export type DayHours = {
  day: string;
  open: string;
  close: string;
};

export type Outlet = {
  id: string;
  /** Nama singkat yang tampil di pemilih outlet. */
  name: string;
  /** Badge kecil di samping nama, mis. "Outlet utama". */
  label: string;
  status: 'open' | 'coming-soon';
  address: {
    line1: string;
    line2: string;
    region: string;
    postalCode?: string;
    full: string;
  };
  maps: {
    embed: string;
    directions: string;
  };
  /** Kosongkan array jika jam buka belum ditentukan. */
  hours: readonly DayHours[];
  note?: string;
};

/**
 * Embed Google Maps publik tanpa API key. Cukup ganti query-nya dengan
 * alamat / "lat,lng" — tidak perlu koordinat khusus.
 */
const mapsEmbed = (query: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=id&z=17&output=embed`;

const mapsDirections = (query: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

const HOURS_STANDARD: DayHours[] = [
  { day: 'Senin', open: '16.00', close: '23.00' },
  { day: 'Selasa', open: '16.00', close: '23.00' },
  { day: 'Rabu', open: '16.00', close: '23.00' },
  { day: 'Kamis', open: '16.00', close: '23.00' },
  { day: 'Jumat', open: '15.00', close: '24.00' },
  { day: 'Sabtu', open: '15.00', close: '24.00' },
  { day: 'Minggu', open: '15.00', close: '23.00' },
];

const NO_HOURS: DayHours[] = [];

/** Alamat lengkap outlet utama — dipakai sebagai query peta. */
const BONOROTO_ADDRESS = {
  line1: 'Bonoroto, RT.3/RW.12',
  line2: 'Plesungan, Kec. Gondangrejo',
  region: 'Kabupaten Karanganyar, Jawa Tengah',
  postalCode: '52227',
  full: 'Bonoroto, RT.3/RW.12, Bonoroto, Plesungan, Kec. Gondangrejo, Kabupaten Karanganyar, Jawa Tengah 52227',
} as const;

/**
 * Koordinat pinpoint "HERSHA ROTI BAKAR 1" dari link Maps resmi:
 * https://maps.app.goo.gl/p9ieyrDArh4GZ5GK9
 */
const BONOROTO_COORDS = '-7.5328673,110.8431156';

export const outlets: readonly Outlet[] = [
  {
    id: 'bonoroto',
    name: 'Bonoroto',
    label: 'Outlet utama',
    status: 'open',
    address: BONOROTO_ADDRESS,
    maps: {
      embed: mapsEmbed(BONOROTO_COORDS),
      directions: mapsDirections(BONOROTO_COORDS),
    },
    hours: HOURS_STANDARD,
    note: 'Outlet di rumah owner — datang langsung atau pesan antar lewat WhatsApp.',
  },
  {
    // PLACEHOLDER: ganti dengan outlet asli saat sudah ada.
    id: 'karanganyar-kota',
    name: 'Karanganyar Kota',
    label: 'Segera hadir',
    status: 'coming-soon',
    address: {
      line1: 'Area Karanganyar Kota',
      line2: 'Kabupaten Karanganyar',
      region: 'Jawa Tengah',
      full: 'Karanganyar, Jawa Tengah',
    },
    maps: {
      embed: mapsEmbed('Karanganyar, Jawa Tengah'),
      directions: mapsDirections('Karanganyar, Jawa Tengah'),
    },
    hours: NO_HOURS,
    note: 'Lokasi dan jam buka menyusul. Titik peta hanya menandai area.',
  },
  {
    // PLACEHOLDER: ganti dengan outlet asli saat sudah ada.
    id: 'solo',
    name: 'Solo',
    label: 'Segera hadir',
    status: 'coming-soon',
    address: {
      line1: 'Area Solo',
      line2: 'Kota Surakarta',
      region: 'Jawa Tengah',
      full: 'Surakarta, Jawa Tengah',
    },
    maps: {
      embed: mapsEmbed('Surakarta, Jawa Tengah'),
      directions: mapsDirections('Surakarta, Jawa Tengah'),
    },
    hours: NO_HOURS,
    note: 'Lokasi dan jam buka menyusul. Titik peta hanya menandai area.',
  },
];

/** Outlet utama — dipakai Header, Footer, dan data terstruktur. */
export const primaryOutlet = outlets[0];

export const site = {
  name: 'Roti Bakar Hersha',
  shortName: 'Hersha',
  tagline: 'Roti bakar artisan, empuk ginuk ginuk, dipanggang di atas bara.',
  descriptor: 'Roti Bakar Empuk Ginuk Ginuk',
  description:
    'Roti bakar artisan dengan olesan buatan sendiri, dipanggang di atas bara, dan disusun lapis demi lapis. Pesan langsung via WhatsApp atau GoFood.',
  city: 'Karanganyar',
  region: 'Jawa Tengah',
  established: 2012,
  geo: {
    lat: -7.5328673,
    lng: 110.8431156,
  },
  whatsapp: {
    number: WA_NUMBER,
    display: '+62 812-3456-7890',
    link: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
      'Halo Roti Bakar Hersha! Saya mau pesan roti bakar. Boleh lihat pilihannya?',
    )}`,
    orderLink: (variantName?: string) =>
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
        variantName
          ? `Halo Roti Bakar Hersha! Saya mau pesan *${variantName}*. Masih tersedia?`
          : 'Halo Roti Bakar Hersha! Saya mau pesan roti bakar.',
      )}`,
  },
  instagram: {
    handle: '@rotibakarhersha',
    link: 'https://instagram.com/rotibakarhersha',
  },
  gofood: {
    label: 'Roti Bakar Hersha',
    link: 'https://gofood.co.id/',
  },
  outlets,
  // Alias outlet utama supaya komponen lama tidak perlu diubah.
  address: primaryOutlet.address,
  maps: primaryOutlet.maps,
  hours: primaryOutlet.hours,
  stats: [
    { value: '2012', label: 'Mulai dari gerobak kecil' },
    { value: '6', label: 'Varian signature' },
    { value: '100%', label: 'Olesan dibuat sendiri' },
  ],
  amenities: [
    'Dine-in & take away',
    'Tersedia di GoFood',
    'Halal',
    'Live grill di depan',
  ],
} as const;

export type SiteConfig = typeof site;
