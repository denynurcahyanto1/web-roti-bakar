'use client';

import { RoundedBox } from '@react-three/drei';
import type { Texture } from 'three';
import type { ToastPalette } from '@/lib/menu';

type BreadSliceProps = {
  palette: ToastPalette;
  texture: Texture;
  width?: number;
  depth?: number;
  thickness?: number;
};

/**
 * Satu potong roti bakar Bandung: tebal, hampir persegi, dengan kerak tipis
 * di tepi dan permukaan remah yang lebar.
 *
 * Penting: remah sengaja dibuat LEBIH TINGGI dari kerak (± 0.02 unit) supaya
 * permukaan atasnya benar-benar terlihat. Kalau remah ditanam di dalam kerak,
 * seluruh sisi atas roti akan tertutup warna kerak datar dan tekstur pori
 * serta garis panggang tidak pernah muncul.
 */
export function BreadSlice({
  palette,
  texture,
  width = 3.3,
  depth = 2.1,
  thickness = 0.72,
}: BreadSliceProps) {
  return (
    <group>
      {/* Kerak: tepi tipis dengan sudut membulat kecil, bukan bun. */}
      <RoundedBox args={[width, thickness, depth]} radius={0.14} smoothness={5} castShadow receiveShadow>
        <meshStandardMaterial
          color={palette.crust}
          roughness={0.8}
          metalness={0.02}
          envMapIntensity={0.22}
        />
      </RoundedBox>

      {/* Remah: hampir selebar kerak, jadi sisi potongan juga terlihat
          bertekstur seperti roti bakar yang dioles mentega — bukan dinding
          kerak polos. Kerak hanya menyisakan garis tipis di tepi atas/bawah. */}
      <RoundedBox
        args={[width - 0.02, thickness - 0.06, depth - 0.02]}
        radius={0.12}
        smoothness={5}
        position={[0, 0.04, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={texture}
          bumpMap={texture}
          bumpScale={0.045}
          roughness={0.95}
          metalness={0}
          envMapIntensity={0.2}
        />
      </RoundedBox>
    </group>
  );
}
