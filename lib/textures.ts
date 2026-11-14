import * as THREE from 'three';
import { mulberry32 } from './utils';
import type { ToastPalette } from './menu';

/**
 * Membuat tekstur pori roti + garis bakar secara procedural.
 * Tidak ada file gambar eksternal → tidak ada request jaringan tambahan
 * dan hasilnya bisa diwarnai ulang per varian.
 */
export function createCrumbTexture(palette: ToastPalette) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  const rand = mulberry32(0x9e3779b9);

  // Warna dasar remah
  ctx.fillStyle = palette.crumb;
  ctx.fillRect(0, 0, size, size);

  // Bercak besar agar permukaan tidak terlihat flat
  for (let i = 0; i < 46; i += 1) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 40 + rand() * 130;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    const light = rand() > 0.45;
    grad.addColorStop(0, hexToRgba(light ? palette.crumbLight : palette.crumbDark, 0.16));
    grad.addColorStop(1, hexToRgba(light ? palette.crumbLight : palette.crumbDark, 0));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pori-pori halus
  for (let i = 0; i < 2100; i += 1) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 0.8 + rand() * 3.4;
    const dark = rand() > 0.35;
    ctx.fillStyle = hexToRgba(dark ? palette.crumbDark : palette.crumbLight, 0.1 + rand() * 0.26);
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (0.6 + rand() * 0.8), rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  // Lubang udara besar khas roti tawar
  for (let i = 0; i < 24; i += 1) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 5 + rand() * 12;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, hexToRgba(palette.crumbDark, 0.42));
    grad.addColorStop(0.7, hexToRgba(palette.crumbDark, 0.18));
    grad.addColorStop(1, hexToRgba(palette.crumbDark, 0));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.82, rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bekas panggang: garis-garis horizontal rapat seperti roti bakar Bandung
  // yang ditekan di pemanggang. Warna gelap + highlight tipis di bawahnya
  // supaya saat dipakai sebagai bumpMap alurnya terlihat nyata.
  for (let gy = 14; gy < size; gy += 32) {
    const groove = ctx.createLinearGradient(0, gy - 8, 0, gy + 8);
    groove.addColorStop(0, hexToRgba(palette.crumbDark, 0));
    groove.addColorStop(0.4, hexToRgba(palette.crumbDark, 0.5));
    groove.addColorStop(0.6, hexToRgba(palette.crumbDark, 0.45));
    groove.addColorStop(1, hexToRgba(palette.crumbDark, 0));
    ctx.fillStyle = groove;
    ctx.fillRect(0, gy - 8, size, 16);

    // inti garis yang lebih tajam supaya bekas pemanggang terbaca jelas
    ctx.fillStyle = hexToRgba(palette.crumbDark, 0.32);
    ctx.fillRect(0, gy - 1, size, 2);

    const highlight = ctx.createLinearGradient(0, gy + 7, 0, gy + 14);
    highlight.addColorStop(0, hexToRgba(palette.crumbLight, 0.26));
    highlight.addColorStop(1, hexToRgba(palette.crumbLight, 0));
    ctx.fillStyle = highlight;
    ctx.fillRect(0, gy + 7, size, 7);
  }

  // Tepi roti lebih matang (vignette)
  const edge = ctx.createRadialGradient(size / 2, size / 2, size * 0.22, size / 2, size / 2, size * 0.72);
  edge.addColorStop(0, hexToRgba(palette.crumbDark, 0));
  edge.addColorStop(1, hexToRgba(palette.crumbDark, 0.46));
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

/** Ubah #rrggbb + alpha menjadi rgba() untuk canvas 2D. */
function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
