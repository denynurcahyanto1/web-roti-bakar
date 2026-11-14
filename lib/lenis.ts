'use client';

import type Lenis from 'lenis';

/**
 * Jembatan kecil antara React dan instance Lenis.
 * Dipakai oleh header, tombol CTA, dan modal untuk mengunci/menggeser scroll
 * tanpa perlu melempar context ke seluruh pohon komponen.
 */
let instance: Lenis | null = null;

export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

export function lockScroll() {
  instance?.stop();
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('lenis-stopped');
  }
}

export function unlockScroll() {
  instance?.start();
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('lenis-stopped');
  }
}

/** Scroll halus ke sebuah section berdasarkan id (tanpa "#"). */
export function scrollToSection(id: string, offset = -72) {
  const target = document.getElementById(id);
  if (!target) return;
  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.35 });
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function scrollToTop() {
  if (instance) {
    instance.scrollTo(0, { duration: 1.5 });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
