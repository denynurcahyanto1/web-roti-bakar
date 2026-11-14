'use client';

import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import type { MenuVariant } from '@/lib/menu';
import { mulberry32 } from '@/lib/utils';

/**
 * Lapisan olesan. Varian "gloss" (cokelat/nutella) mendapat clearcoat,
 * varian "satin" (keju/srikaya) lebih matte. envMapIntensity ditahan rendah
 * agar olesan tidak "blow out" jadi putih.
 */
export function SpreadLayer({ variant }: { variant: MenuVariant }) {
  const { palette, spreadFinish } = variant;
  const glossy = spreadFinish === 'gloss';

  // Gumpalan tipis di permukaan: memecah siluet kotak sempurna supaya
  // terbaca sebagai olesan yang dioles, bukan lempengan cokelat.
  const smears = useMemo(() => {
    const rand = mulberry32(0x1b7c4a53);
    return Array.from({ length: 7 }, () => ({
      x: (rand() - 0.5) * 2.5,
      z: (rand() - 0.5) * 1.6,
      s: 0.34 + rand() * 0.36,
      r: rand() * Math.PI,
    }));
  }, []);

  return (
    <group>
      <RoundedBox args={[3.16, 0.14, 1.98]} radius={0.06} smoothness={5} castShadow>
        <meshPhysicalMaterial
          color={palette.spread}
          roughness={glossy ? 0.34 : 0.58}
          metalness={0}
          clearcoat={glossy ? 0.32 : 0.12}
          clearcoatRoughness={glossy ? 0.3 : 0.45}
          sheen={glossy ? 0.12 : 0.3}
          sheenColor={palette.glow}
          sheenRoughness={0.7}
          envMapIntensity={0.22}
        />
      </RoundedBox>

      {smears.map((smear, index) => (
        <mesh
          key={`smear-${index}`}
          position={[smear.x, 0.065, smear.z]}
          rotation={[0, smear.r, 0]}
          scale={[smear.s, 0.035, smear.s * 0.78]}
        >
          <sphereGeometry args={[1, 16, 12]} />
          <meshPhysicalMaterial
            color={palette.spread}
            roughness={glossy ? 0.32 : 0.56}
            clearcoat={glossy ? 0.35 : 0.1}
            clearcoatRoughness={0.3}
            envMapIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}
