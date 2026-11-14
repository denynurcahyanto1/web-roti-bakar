'use client';

import { useRef, type RefObject } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { clamp } from '@/lib/utils';

type LayerTagProps = {
  index: string;
  label: string;
  position: [number, number, number];
  visualRef: RefObject<number>;
  /** Urutan kemunculan supaya label tidak muncul serentak. */
  order?: number;
};

/**
 * Label melayang yang menempel ke lapisan 3D (bukan posisi layar tetap),
 * jadi tetap akurat saat model diputar. Opasitas diatur langsung lewat DOM
 * di dalam useFrame agar tidak memicu re-render React tiap frame.
 *
 * Latar gelap semi-transparan dipakai supaya label tetap terbaca ketika
 * kebetulan berada di atas permukaan roti yang terang.
 */
export function LayerTag({ index, label, position, visualRef, order = 0 }: LayerTagProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    const element = elementRef.current;
    if (!element) return;
    const progress = visualRef.current ?? 0;
    const local = clamp((progress - 0.42 - order * 0.04) / 0.34, 0, 1);
    element.style.opacity = local.toFixed(3);
    element.style.transform = `translate3d(${(1 - local) * 14}px, 0, 0)`;
  });

  return (
    <Html position={position} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
      <div
        ref={elementRef}
        className="flex select-none items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-ink/75 py-1.5 pl-2.5 pr-3 opacity-0 will-change-transform"
        style={{ opacity: 0 }}
      >
        <span className="font-body text-[9px] tabular-nums tracking-[0.18em] text-cheese/80">
          {index}
        </span>
        <span className="h-px w-4 bg-gradient-to-r from-cheese/60 to-transparent" />
        <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-cream/90 sm:text-[10px]">
          {label}
        </span>
      </div>
    </Html>
  );
}
