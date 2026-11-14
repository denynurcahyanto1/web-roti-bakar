'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

import type { MenuVariant } from '@/lib/menu';
import { createCrumbTexture } from '@/lib/textures';
import { clamp, hashString } from '@/lib/utils';
import { BreadSlice } from './toast/BreadSlice';
import { SpreadLayer } from './toast/SpreadLayer';
import { Toppings } from './toast/Toppings';
import { LayerTag } from './toast/LayerTag';

/** Posisi istirahat & jarak pisah tiap lapisan saat exploded view. */
const LAYERS = {
  base: { rest: 0, explode: -0.14, delay: 0 },
  spread: { rest: 0.4, explode: 0.98, delay: 0.05 },
  toppings: { rest: 0.48, explode: 1.7, delay: 0.1 },
  top: { rest: 0.83, explode: 2.45, delay: 0.16 },
} as const;

type ToastModelProps = {
  variant: MenuVariant;
  /** Nilai 0–1 dari luar: scroll, tombol, atau state modal. */
  progressRef: RefObject<number>;
  labels?: boolean;
  idleMotion?: boolean;
};

export function ToastModel({ variant, progressRef, labels = false, idleMotion = true }: ToastModelProps) {
  const rootRef = useRef<THREE.Group>(null);
  const swapRef = useRef<THREE.Group>(null);
  const baseRef = useRef<THREE.Group>(null);
  const spreadRef = useRef<THREE.Group>(null);
  const toppingsRef = useRef<THREE.Group>(null);
  const topRef = useRef<THREE.Group>(null);

  /** Nilai progress yang sudah dihaluskan, dibaca juga oleh label 3D. */
  const visualRef = useRef(0);

  const texture = useMemo(() => createCrumbTexture(variant.palette), [variant.palette]);
  useEffect(() => () => texture.dispose(), [texture]);

  // Animasi masuk tiap kali varian berganti (bukan remount penuh).
  useEffect(() => {
    const swap = swapRef.current;
    if (!swap) return;
    const timeline = gsap.timeline();
    timeline
      .fromTo(
        swap.scale,
        { x: 0.84, y: 0.84, z: 0.84 },
        { x: 1, y: 1, z: 1, duration: 1, ease: 'back.out(1.4)' },
      )
      .fromTo(swap.rotation, { y: -0.26 }, { y: 0, duration: 1.05, ease: 'power3.out' }, 0);
    return () => {
      timeline.kill();
    };
  }, [variant.key]);

  useFrame((state, delta) => {
    const root = rootRef.current;
    if (!root) return;

    const dt = Math.min(delta, 0.05);
    const target = clamp(progressRef.current ?? 0, 0, 1);

    // Damping eksponensial: gerak tetap mulus walau target melompat.
    visualRef.current = THREE.MathUtils.damp(visualRef.current, target, 5.5, dt);
    const p = visualRef.current;
    const eased = p * p * (3 - 2 * p);
    const time = state.clock.elapsedTime;

    // Skala & geser keseluruhan supaya seluruh tumpukan tetap masuk frame.
    // Tumpukan tertutup berpusat di y ≈ 0.42 (sama dengan target kamera),
    // jadi saat terbongkar model digeser turun agar tetap di tengah layar.
    root.scale.setScalar(1 - 0.25 * eased);
    root.position.y = -0.86 * eased + (idleMotion ? Math.sin(time * 0.85) * 0.035 * (1 - eased) : 0);
    root.rotation.x = -0.045 * eased;
    root.rotation.z = idleMotion ? Math.sin(time * 0.5) * 0.007 * (1 - eased) : 0;

    applyLayer(baseRef.current, LAYERS.base, eased, time);
    applyLayer(spreadRef.current, LAYERS.spread, eased, time);
    applyLayer(toppingsRef.current, LAYERS.toppings, eased, time);
    applyLayer(topRef.current, LAYERS.top, eased, time);

    // Topping sedikit bergeser ke samping saat terbongkar agar tidak
    // tertutup lapisan di atasnya ketika dilihat dari sudut miring.
    if (toppingsRef.current) {
      toppingsRef.current.position.x = 0.09 * eased;
    }
  });

  const seed = useMemo(() => hashString(variant.key), [variant.key]);

  return (
    <group ref={rootRef}>
      <group ref={swapRef}>
        <group ref={baseRef} position={[0, LAYERS.base.rest, 0]}>
          <BreadSlice palette={variant.palette} texture={texture} />
          {labels && (
            <LayerTag
              index="01"
              label="Roti bawah"
              position={[-2.45, 0.02, 0]}
              visualRef={visualRef}
              order={0}
            />
          )}
        </group>

        <group ref={spreadRef} position={[0, LAYERS.spread.rest, 0]}>
          <SpreadLayer variant={variant} />
          {labels && (
            <LayerTag
              index="02"
              label="Olesan"
              position={[-2.45, 0.02, 0]}
              visualRef={visualRef}
              order={1}
            />
          )}
        </group>

        <group ref={toppingsRef} position={[0, LAYERS.toppings.rest, 0]}>
          <Toppings specs={variant.toppings} seed={seed} />
          {labels && (
            <LayerTag
              index="03"
              label="Topping"
              position={[-2.45, 0.02, 0]}
              visualRef={visualRef}
              order={2}
            />
          )}
        </group>

        <group ref={topRef} position={[0, LAYERS.top.rest, 0]} rotation={[0, 0.035, 0]}>
          <BreadSlice palette={variant.palette} texture={texture} />
          {labels && (
            <LayerTag
              index="04"
              label="Roti atas"
              position={[-2.45, 0.02, 0]}
              visualRef={visualRef}
              order={3}
            />
          )}
        </group>
      </group>
    </group>
  );
}

function applyLayer(
  group: THREE.Group | null,
  config: { rest: number; explode: number; delay: number },
  progress: number,
  time: number,
) {
  if (!group) return;
  const stage = smoothstep(clamp((progress - config.delay) / (1 - config.delay), 0, 1));
  group.position.y = config.rest + config.explode * stage;
  // Goyangan sangat halus saat tumpukan masih utuh.
  group.rotation.z = Math.sin(time * 0.7 + config.delay * 12) * 0.004 * (1 - stage);
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}
