'use client';

import { useMemo, useRef, type RefObject } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ToastPalette } from '@/lib/menu';
import { clamp } from '@/lib/utils';

/**
 * Jalur opsional memakai model GLB asli.
 *
 * Aktifkan dengan menambahkan ke `.env.local`:
 *   NEXT_PUBLIC_TOAST_MODEL_URL=/models/toast.glb
 *
 * Konvensi nama node di file GLB:
 *   bread_bottom | spread | toppings | bread_top
 * Node dengan nama lain tetap dirender, hanya tidak ikut dianimasikan.
 */
const LAYER_MAP = [
  { names: ['bread_bottom', 'rotibawah', 'base'], offset: -0.14, delay: 0 },
  { names: ['spread', 'olesan'], offset: 1.02, delay: 0.05 },
  { names: ['toppings', 'topping'], offset: 1.74, delay: 0.1 },
  { names: ['bread_top', 'rotiatas', 'top'], offset: 2.55, delay: 0.16 },
];

type GltfToastProps = {
  url: string;
  progressRef: RefObject<number>;
  palette: ToastPalette;
};

export function GltfToast({ url, progressRef, palette }: GltfToastProps) {
  const gltf = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  // Clone supaya cache useGLTF tidak termutasi antar instance.
  const model = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    cloned.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const name = object.name.toLowerCase();
      const material = object.material;
      if (!(material instanceof THREE.MeshStandardMaterial)) return;
      if (name.includes('spread') || name.includes('olesan')) {
        object.material = material.clone();
        object.material.color.set(palette.spread);
      }
      if (name.includes('topping')) {
        object.material = material.clone();
        object.material.color.set(palette.crumbLight);
      }
    });

    // Normalisasi ukuran: model apa pun diskalakan ke lebar ±3.3 unit.
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = size.x > 0 ? 3.3 / size.x : 1;
    cloned.scale.setScalar(scale);
    cloned.position.sub(center.multiplyScalar(scale));
    cloned.position.y = 0.98;
    return cloned;
  }, [gltf.scene, palette.spread, palette.crumbLight]);

  const baseY = useMemo(() => {
    const map = new Map<string, number>();
    model.traverse((object) => {
      map.set(object.uuid, object.position.y);
    });
    return map;
  }, [model]);

  const visual = useRef(0);

  useFrame((_, delta) => {
    visual.current = THREE.MathUtils.damp(visual.current, clamp(progressRef.current ?? 0, 0, 1), 5.5, Math.min(delta, 0.05));
    const p = visual.current;
    const eased = p * p * (3 - 2 * p);

    model.traverse((object) => {
      const match = LAYER_MAP.find((layer) =>
        layer.names.some((name) => object.name.toLowerCase().includes(name)),
      );
      if (!match) return;
      const start = baseY.get(object.uuid) ?? 0;
      const stage = smoothstep(clamp((eased - match.delay) / (1 - match.delay), 0, 1));
      object.position.y = start + match.offset * stage;
    });
  });

  return (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  );
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}
