/** Gabungkan className secara kondisional tanpa dependensi tambahan. */
export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

/** Rp 22.000 — spasi non-breaking supaya harga tidak pernah terpotong. */
export function formatIDR(value: number) {
  return `Rp\u00A0${new Intl.NumberFormat('id-ID').format(value)}`;
}

/** PRNG deterministik: geometri 3D selalu sama di setiap render. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function random() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Seed stabil dari string (dipakai untuk variasi topping per varian). */
export function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
