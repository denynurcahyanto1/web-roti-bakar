export type VariantKey =
  | 'coklat-keju'
  | 'cheese-crunchy'
  | 'pisang'
  | 'nutella'
  | 'srikaya'
  | 'strawberry';

export type ToppingKind =
  | 'shreds'
  | 'meses'
  | 'slices'
  | 'nuts'
  | 'flakes'
  | 'blobs';

export type ToppingSpec = {
  kind: ToppingKind;
  color: string;
  count: number;
  /** Pengali ukuran per potongan. */
  scale: number;
};

export type ToastPalette = {
  crust: string;
  crumb: string;
  crumbDark: string;
  crumbLight: string;
  spread: string;
  spreadDeep: string;
  glow: string;
};

export type MenuVariant = {
  key: VariantKey;
  name: string;
  short: string;
  description: string;
  price: number;
  badge?: string;
  /** Nada untuk ilustrasi kartu menu (CSS/SVG). */
  card: { from: string; to: string; accent: string };
  palette: ToastPalette;
  /** gloss = olesan cokelat/menkilap, satin = keju/krim. */
  spreadFinish: 'gloss' | 'satin';
  toppings: ToppingSpec[];
};

/**
 * Warna roti dasar. Semua varian memakai roti yang sama — yang berbeda
 * hanya olesan dan toppingnya. Nilai ini sengaja golden/tosta seperti
 * roti bakar Bandung, bukan cokelat tua.
 */
const BREAD = {
  crust: '#b4761f',
  crumb: '#f0c673',
  crumbDark: '#b07c2c',
  crumbLight: '#fae2ab',
} as const;

/**
 * Varian dipakai bersama oleh model 3D dan kartu menu, sehingga warna
 * di kartu selalu sinkron dengan warna roti di canvas.
 */
export const MENU: MenuVariant[] = [
  {
    key: 'coklat-keju',
    name: 'Coklat Keju Lumer',
    short: 'Coklat Keju',
    description:
      'Roti panggang garing dengan cokelat compound lumer dan parutan keju cheddar yang asin-gurih.',
    price: 22000,
    badge: 'Best seller',
    card: { from: '#2a1a10', to: '#0f0b08', accent: '#e8a87c' },
    palette: {
      ...BREAD,
      spread: '#3a1d10',
      spreadDeep: '#1d0f08',
      glow: '#e8a87c',
    },
    spreadFinish: 'gloss',
    toppings: [
      { kind: 'shreds', color: '#f6cf8e', count: 120, scale: 1 },
      { kind: 'blobs', color: '#2c160c', count: 16, scale: 0.9 },
    ],
  },
  {
    key: 'cheese-crunchy',
    name: 'Cheese Crunchy',
    short: 'Cheese Crunchy',
    description:
      'Saus keju creamy, keju parut panggang, dan remahan garing yang bikin tiap gigitan bertekstur.',
    price: 24000,
    card: { from: '#2b2113', to: '#100d08', accent: '#f2c98a' },
    palette: {
      ...BREAD,
      spread: '#e3a94f',
      spreadDeep: '#b87f2d',
      glow: '#f2c98a',
    },
    spreadFinish: 'satin',
    toppings: [
      { kind: 'shreds', color: '#f9dda4', count: 140, scale: 1.1 },
      { kind: 'flakes', color: '#c98a45', count: 44, scale: 1 },
    ],
  },
  {
    key: 'pisang',
    name: 'Spesial Pisang',
    short: 'Spesial Pisang',
    description:
      'Irisan pisang raja manis, cokelat hangat, dan taburan meses. Rasa warung yang dibawa ke level lain.',
    price: 23000,
    card: { from: '#2a2011', to: '#0f0c08', accent: '#f0d79a' },
    palette: {
      ...BREAD,
      spread: '#40200f',
      spreadDeep: '#201006',
      glow: '#f0d79a',
    },
    spreadFinish: 'gloss',
    toppings: [
      { kind: 'slices', color: '#f4e2b0', count: 9, scale: 1 },
      { kind: 'meses', color: '#3b2013', count: 90, scale: 1 },
    ],
  },
  {
    key: 'nutella',
    name: 'Nutella Hazelnut',
    short: 'Nutella',
    description:
      'Hazelnut spread pekat dengan kacang panggang utuh. Untuk yang tidak mau kompromi soal cokelat.',
    price: 28000,
    badge: 'Premium',
    card: { from: '#2c1c10', to: '#100b08', accent: '#d9b478' },
    palette: {
      ...BREAD,
      spread: '#38200f',
      spreadDeep: '#1a0e06',
      glow: '#d9b478',
    },
    spreadFinish: 'gloss',
    toppings: [
      { kind: 'nuts', color: '#b97f4a', count: 26, scale: 1 },
      { kind: 'blobs', color: '#2a160b', count: 14, scale: 0.8 },
    ],
  },
  {
    key: 'srikaya',
    name: 'Srikaya Pandan',
    short: 'Srikaya Pandan',
    description:
      'Srikaya pandan buatan sendiri, manis lembut dengan wangi daun pandan dan kelapa sangrai.',
    price: 21000,
    card: { from: '#1f2513', to: '#0b0d08', accent: '#bcd488' },
    palette: {
      ...BREAD,
      spread: '#a8c46b',
      spreadDeep: '#7f9a4b',
      glow: '#bcd488',
    },
    spreadFinish: 'satin',
    toppings: [
      { kind: 'flakes', color: '#f7f0d9', count: 60, scale: 1 },
      { kind: 'blobs', color: '#cbe0a0', count: 12, scale: 0.9 },
    ],
  },
  {
    key: 'strawberry',
    name: 'Strawberry Cream',
    short: 'Strawberry',
    description:
      'Selai stroberi asam-manis berpadu cream cheese dingin dan remahan biskuit renyah.',
    price: 25000,
    card: { from: '#2a1418', to: '#0f0809', accent: '#e79aa8' },
    palette: {
      ...BREAD,
      spread: '#cf5468',
      spreadDeep: '#a33149',
      glow: '#e79aa8',
    },
    spreadFinish: 'satin',
    toppings: [
      { kind: 'blobs', color: '#f8f0e2', count: 24, scale: 1 },
      { kind: 'flakes', color: '#f2dfc4', count: 34, scale: 0.9 },
    ],
  },
];

export const VARIANT_KEYS = MENU.map((m) => m.key);

export const DEFAULT_VARIANT: VariantKey = 'coklat-keju';

export function getVariant(key: VariantKey): MenuVariant {
  return MENU.find((item) => item.key === key) ?? MENU[0];
}
