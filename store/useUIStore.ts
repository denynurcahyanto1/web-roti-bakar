'use client';

import { create } from 'zustand';
import { DEFAULT_VARIANT, type VariantKey } from '@/lib/menu';

type UIState = {
  /** Varian yang sedang tampil di hero & modal. */
  variant: VariantKey;
  setVariant: (key: VariantKey) => void;
  /** Varian yang modalnya terbuka (null = tertutup). */
  activeItem: VariantKey | null;
  openItem: (key: VariantKey) => void;
  closeItem: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  variant: DEFAULT_VARIANT,
  setVariant: (key) => set({ variant: key }),
  activeItem: null,
  openItem: (key) => set({ variant: key, activeItem: key }),
  closeItem: () => set({ activeItem: null }),
}));
