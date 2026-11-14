# Roti Bakar Hersha

Website satu halaman untuk **Roti Bakar Hersha — Roti Bakar Empuk Ginuk Ginuk** (Karanganyar, Jawa Tengah). Fokusnya satu: roti bakar Bandung tebal yang bisa diputar, di-zoom, dan dibongkar lapisannya langsung di browser.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **React Three Fiber / Three.js / Drei** untuk model 3D prosedural
- **GSAP + ScrollTrigger** untuk animasi scroll dan exploded view
- **Lenis** untuk smooth scroll (digerakkan oleh `gsap.ticker`)
- **Tailwind CSS** untuk styling
- Font: Sora (display), Manrope (body), Satisfy (wordmark logo)

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # jalankan hasil build
npx tsc --noEmit # cek tipe
```

## Mengedit konten

Semua teks bisnis terpusat di dua file:

| File | Isi |
| --- | --- |
| `lib/site.ts` | Nama brand, tagline, WhatsApp, Instagram, GoFood, daftar outlet, jam buka, statistik, fasilitas |
| `lib/menu.ts` | 6 varian rasa, harga, palet warna, spesifikasi topping 3D |

### Data yang masih placeholder

Ganti sebelum go-live:

- `WA_NUMBER` di `lib/site.ts` — saat ini `6281234567890`.
- `instagram.handle` / `instagram.link` — masih `@rotibakarhersha`.
- `gofood.link` — masih halaman utama GoFood.
- **Outlet 2 & 3** (`karanganyar-kota`, `solo`) — masih placeholder level area, bukan alamat pasti. Lihat bagian berikut.

## Multi-outlet

Outlet didefinisikan sebagai array di `lib/site.ts`:

```ts
export const outlets: readonly Outlet[] = [
  { id: 'bonoroto', name: 'Bonoroto', status: 'open', ... },
  { id: 'karanganyar-kota', status: 'coming-soon', ... },
  { id: 'solo', status: 'coming-soon', ... },
];
```

- **`outlets[0]` adalah outlet utama.** Alamat, peta, dan jamnya otomatis dipakai Header, Footer, dan JSON-LD lewat alias `site.address`, `site.maps`, `site.hours`.
- Pin outlet utama memakai koordinat resmi `-7.5328673, 110.8431156` (link `maps.app.goo.gl/p9ieyrDArh4GZ5GK9`). Ganti `BONOROTO_COORDS` di `lib/site.ts` kalau titiknya bergeser.
- Untuk menambah outlet, salin satu objek dan isi `id`, `name`, `label`, `address`, `maps`, `hours`, `note`.
- `maps.embed` / `maps.directions` dibuat otomatis dari query alamat lewat helper `mapsEmbed()` / `mapsDirections()`. Cukup isi `address.full` dengan alamat lengkap atau `"lat,lng"`.
- Outlet dengan `status: 'coming-soon'` tampil dengan badge "Segera hadir", tanpa daftar jam (isi `hours: []` kalau belum ada jadwal).
- Jam buka memakai format `"16.00"` / `"24.00"`. Status buka/tutup dihitung otomatis di `lib/hours.ts` (mendukung jam lewat tengah malam).

Pemilih outlet ada di section **Lokasi**; peta dan kartu alamat ikut berganti tanpa reload.

## Logo

Logo asli adalah wordmark script "Hersha" dengan teks **ROTI BAKAR / EMPUK GINUK GINUK / SINCE 2012**. Saat ini direplika secara tipografis lewat `components/ui/BrandWordmark.tsx` (font Satisfy) supaya tetap tajam di semua ukuran dan tidak butuh aset bitmap.

Kalau sudah punya file logo resmi:

1. Taruh di `public/logo.png` (atau `.svg`).
2. Ganti isi `BrandWordmark` dengan `next/image`:

```tsx
import Image from 'next/image';

<Image src="/logo.png" alt="Roti Bakar Hersha" width={160} height={160} priority />
```

Lalu sesuaikan ukuran di Header (`text-[32px]`) dan Footer (`text-[42px]`) karena keduanya memakai komponen yang sama.

## Model 3D

Model dibuat prosedural — tidak perlu file GLB:

- `components/three/ToastScene.tsx` — kamera, lighting studio hangat, OrbitControls, bridge zoom/reset.
- `components/three/ToastModel.tsx` — susunan lapisan + animasi explode per frame.
- `components/three/toast/BreadSlice.tsx` — roti Bandung tebal (0.72 unit), crumb, crust, grill grooves.
- `components/three/toast/SpreadLayer.tsx` — selai/keju sebagai slab tipis + smear di permukaan.
- `components/three/toast/Toppings.tsx` — topping instanced (keju serut, cokelat, dll).
- `lib/textures.ts` — tekstur crumb dan grill dibuat di canvas, dipakai sebagai `map` + `bumpMap`.

Interaksi:

- **Drag** untuk memutar 360°.
- **Shift + scroll** atau **pinch** untuk zoom; tombol `+ / −` tersedia agar scroll halaman tidak pernah direbut.
- Scroll hero / tombol **Bongkar lapisan** untuk exploded view.
- Klik kartu menu membuka modal 3D varian tersebut.

### Memakai GLB sendiri

Set `NEXT_PUBLIC_TOAST_MODEL_URL=/models/roti.glb` di `.env.local`, lalu beri nama node sesuai lapisan:

```
bread_bottom, spread, toppings, bread_top
```

Tanpa variabel itu, model prosedural yang dipakai.

## Struktur

```
app/
  layout.tsx        metadata, font, JSON-LD, Header/Footer
  page.tsx          susunan section
  globals.css       token desain, grain, custom cursor
components/
  layout/           Header (nav + overlay mobile), Footer
  sections/         Hero, MenuSection, MenuModal, StorySection, LocationSection
  three/            Canvas, scene, model, lapisan roti, partikel
  ui/               tombol magnetik, reveal, marquee, cursor, BrandWordmark
  providers/        SmoothScroll (Lenis + GSAP)
lib/
  site.ts           konten bisnis + outlet
  menu.ts           varian + palet 3D
  hours.ts          logika jam buka
  textures.ts       tekstur prosedural
  gsap.ts / lenis.ts
store/
  useUIStore.ts     varian aktif + modal
```

## Catatan performa & aksesibilitas

- Canvas 3D hanya aktif saat terlihat; `frameloop` dihentikan ketika modal/overlay terbuka.
- Peta Google di-lazy-load lewat `IntersectionObserver` dan baru fade-in setelah tile siap (tidak ada kilatan putih).
- Preferensi `prefers-reduced-motion` dihormati oleh animasi GSAP dan smooth scroll.
- Fokus keyboard terlihat, ada skip-link, tombol punya label, dan canvas tetap bisa dipakai tanpa drag (tombol zoom/explode tersedia).
- `prefers-reduced-motion` + layar kecil: UI disederhanakan, tapi model tetap bisa digeser.

## Deadline konten

Harga di `lib/menu.ts` masih contoh (Rp 20.000–30.000). Sesuaikan dengan menu asli sebelum publikasi.
