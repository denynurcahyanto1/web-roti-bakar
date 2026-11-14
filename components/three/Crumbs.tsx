'use client';

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ToastPalette } from '@/lib/menu';
import { mulberry32 } from '@/lib/utils';

type Crumb = {
  x: number;
  y: number;
  z: number;
  speed: number;
  sway: number;
  phase: number;
  size: number;
  spin: number;
  rotation: number;
};

/**
 * Serpihan roti/keju yang jatuh pelan. Semua partikel satu InstancedMesh,
 * posisi diperbarui di useFrame tanpa menyentuh state React.
 */
export function Crumbs({
  palette,
  count = 64,
  reducedMotion = false,
}: {
  palette: ToastPalette;
  count?: number;
  reducedMotion?: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const crumbs = useMemo<Crumb[]>(() => {
    const rand = mulberry32(0x2f8b3c1d);
    return Array.from({ length: count }, () => ({
      x: (rand() - 0.5) * 4.6,
      y: rand() * 5.4 - 1.6,
      z: (rand() - 0.5) * 1.8,
      speed: 0.16 + rand() * 0.4,
      sway: 0.1 + rand() * 0.35,
      phase: rand() * Math.PI * 2,
      size: 0.01 + rand() * 0.026,
      spin: (rand() - 0.5) * 1.4,
      rotation: rand() * Math.PI,
    }));
  }, [count]);

  // Warna bervariasi: remah roti, keju, dan cokelat.
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const tones = [new THREE.Color(palette.crumb), new THREE.Color(palette.crust), new THREE.Color(palette.glow)];
    crumbs.forEach((_, index) => {
      mesh.setColorAt(index, tones[index % tones.length]);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [crumbs, palette.crumb, palette.crust, palette.glow]);

  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  }, []);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;

    crumbs.forEach((crumb, index) => {
      if (!reducedMotion) {
        crumb.y -= crumb.speed * dt;
        crumb.rotation += crumb.spin * dt;
        if (crumb.y < -2.1) crumb.y = 3.4;
      }
      dummy.position.set(
        crumb.x + Math.sin(time * 0.6 + crumb.phase) * crumb.sway * 0.35,
        crumb.y,
        crumb.z,
      );
      dummy.rotation.set(crumb.rotation, crumb.rotation * 0.7, 0);
      dummy.scale.setScalar(crumb.size * (reducedMotion ? 0.7 : 1));
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 0.7]} />
      <meshStandardMaterial
        roughness={0.7}
        metalness={0}
        transparent
        opacity={0.62}
        depthWrite={false}
        toneMapped
      />
    </instancedMesh>
  );
}
