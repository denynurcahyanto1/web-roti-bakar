'use client';

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { ToppingKind, ToppingSpec } from '@/lib/menu';
import { mulberry32 } from '@/lib/utils';

type Item = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

/**
 * Topping dirender sebagai satu InstancedMesh per jenis, jadi 100+ potong
 * keju tetap hanya satu draw call.
 */
export function Toppings({ specs, seed }: { specs: ToppingSpec[]; seed: number }) {
  return (
    <group>
      {specs.map((spec, index) => (
        <ToppingPieces key={`${spec.kind}-${index}`} spec={spec} seed={seed + index * 7919} />
      ))}
    </group>
  );
}

function ToppingPieces({ spec, seed }: { spec: ToppingSpec; seed: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const items = useMemo(() => buildItems(spec, seed), [spec, seed]);
  const geometry = useMemo(() => createGeometry(spec.kind), [spec.kind]);
  const material = useMemo(() => createMaterial(spec), [spec]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    items.forEach((item, index) => {
      dummy.position.set(...item.position);
      dummy.rotation.set(...item.rotation);
      dummy.scale.set(...item.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items, geometry]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, items.length]}
      frustumCulled={false}
      castShadow
    />
  );
}

function buildItems(spec: ToppingSpec, seed: number): Item[] {
  const rand = mulberry32(seed);
  const { kind, count, scale } = spec;

  if (kind === 'slices') {
    // Irisan pisang disusun longgar 3x3 agar tidak saling menembus.
    const grid = [-0.78, 0, 0.78];
    return Array.from({ length: count }, (_, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3) % 3;
      return {
        position: [
          (grid[col] ?? 0) + (rand() - 0.5) * 0.16,
          0.065,
          (grid[row] ?? 0) + (rand() - 0.5) * 0.16,
        ],
        rotation: [0, rand() * Math.PI * 2, 0],
        scale: [scale * (0.88 + rand() * 0.24), scale, scale * (0.88 + rand() * 0.24)],
      };
    });
  }

  return Array.from({ length: count }, () => {
    // Distribusi cakram: rapat di tengah, jarang di tepi — seperti taburan asli.
    const angle = rand() * Math.PI * 2;
    const radius = Math.sqrt(rand()) * 1.5;
    const x = Math.cos(angle) * radius * 1.02;
    const z = Math.sin(angle) * radius * 0.7;

    const flat = kind === 'shreds' || kind === 'flakes' || kind === 'blobs';
    const baseY =
      kind === 'shreds'
        ? 0.035 + rand() * 0.02 + (rand() > 0.62 ? 0.025 + rand() * 0.02 : 0)
        : flat
          ? 0.035 + rand() * 0.03
          : 0.04 + rand() * 0.05;

    // Taburan pipih (keju parut, remahan) hanya boleh miring sedikit,
    // kalau tidak hasilnya terlihat seperti tumpukan ranting.
    const rotation: [number, number, number] = flat
      ? [(rand() - 0.5) * 0.5, rand() * Math.PI * 2, (rand() - 0.5) * 0.5]
      : [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI];

    let itemScale: [number, number, number] = [scale, scale, scale];
    if (kind === 'meses') itemScale = [scale, scale * 0.55, scale];
    if (kind === 'blobs') itemScale = [scale, scale * 0.5, scale];
    if (kind === 'shreds') itemScale = [scale * (0.75 + rand() * 0.5), scale, scale * (0.85 + rand() * 0.45)];
    if (kind === 'flakes') itemScale = [scale * (0.8 + rand() * 0.5), scale, scale * (0.8 + rand() * 0.5)];

    return {
      position: [x, baseY, z],
      rotation,
      scale: itemScale,
    };
  });
}

function createGeometry(kind: ToppingKind) {
  switch (kind) {
    case 'shreds':
      // Keju parut: batang pendek dan tipis, bukan balok panjang.
      return new THREE.BoxGeometry(0.062, 0.042, 0.19);
    case 'meses':
      return new THREE.SphereGeometry(0.045, 8, 6);
    case 'nuts':
      return new THREE.SphereGeometry(0.105, 12, 10);
    case 'flakes':
      return new THREE.BoxGeometry(0.17, 0.024, 0.1);
    case 'blobs':
      return new THREE.SphereGeometry(0.13, 14, 10);
    case 'slices':
    default:
      return new THREE.CylinderGeometry(0.2, 0.2, 0.08, 22);
  }
}

function createMaterial(spec: ToppingSpec) {
  const shiny = spec.kind === 'blobs' || spec.kind === 'slices';

  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(spec.color),
    roughness: shiny ? 0.3 : 0.62,
    metalness: 0,
    clearcoat: shiny ? 0.7 : 0.06,
    clearcoatRoughness: shiny ? 0.24 : 0.5,
    sheen: spec.kind === 'shreds' ? 0.12 : 0,
    sheenColor: new THREE.Color(spec.color),
    envMapIntensity: 0.2,
  });
}
