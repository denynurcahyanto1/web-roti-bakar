'use client';

import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import gsap from 'gsap';

import type { MenuVariant } from '@/lib/menu';
import { isCoarsePointer, prefersReducedMotion } from '@/lib/motion';
import { toastControls } from '@/lib/toast-controls';
import { ToastModel } from './ToastModel';
import { GltfToast } from './GltfToast';
import { Crumbs } from './Crumbs';

const MODEL_URL = process.env.NEXT_PUBLIC_TOAST_MODEL_URL;

export type ToastSceneProps = {
  variant: MenuVariant;
  /** Nilai 0–1 untuk exploded view. Ditulis dari luar (scroll/tombol/state). */
  progressRef: RefObject<number>;
  /** Kanal kontrol kamera, mis. "hero" atau "modal". */
  channel: string;
  autoRotate?: boolean;
  labels?: boolean;
  particles?: boolean;
  interactive?: boolean;
  /** Hentikan render loop saat canvas tidak terlihat (mis. modal terbuka). */
  paused?: boolean;
  className?: string;
};

export default function ToastScene({
  variant,
  progressRef,
  channel,
  autoRotate = true,
  labels = false,
  particles = true,
  interactive = true,
  paused = false,
  className,
}: ToastSceneProps) {
  return (
    <div className={className} style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [2.4, 4.2, 6.4], fov: 30, near: 0.1, far: 60 }}
        frameloop={paused ? 'never' : 'always'}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.98;
        }}
      >
        <Suspense fallback={null}>
          <Experience
            variant={variant}
            progressRef={progressRef}
            channel={channel}
            autoRotate={autoRotate}
            labels={labels}
            particles={particles}
            interactive={interactive}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

type ExperienceProps = Omit<ToastSceneProps, 'paused' | 'className'>;

function Experience({
  variant,
  progressRef,
  channel,
  autoRotate = true,
  labels = false,
  particles = true,
  interactive = true,
}: ExperienceProps) {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const coarse = useMemo(() => isCoarsePointer(), []);

  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [dragging, setDragging] = useState(false);
  const [shiftZoom, setShiftZoom] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Aktifkan zoom roda hanya saat Shift ditahan, supaya scroll halaman
  // (yang menggerakkan exploded view) tidak pernah "tertangkap" canvas.
  useEffect(() => {
    if (!interactive) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') setShiftZoom(true);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift') setShiftZoom(false);
    };
    const onBlur = () => setShiftZoom(false);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [interactive]);

  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    [],
  );

  // Simpan posisi kamera awal agar double-click bisa reset.
  useEffect(() => {
    const id = window.setTimeout(() => controlsRef.current?.saveState(), 120);
    return () => window.clearTimeout(id);
  }, []);

  const handleStart = () => {
    setDragging(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  };

  const handleEnd = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setDragging(false), 2400);
  };

  const particleCount = coarse ? 20 : 34;

  return (
    <>
      {/* ---------------------------------------------------------- */}
      {/*  Lighting studio: key hangat, rim amber, fill dingin tipis   */}
      {/* ---------------------------------------------------------- */}
      <ambientLight intensity={0.32} color="#ffe7cc" />
      <hemisphereLight args={['#ffd9ae', '#120a05', 0.36]} />
      <directionalLight position={[4.5, 6.5, 4]} intensity={2.35} color="#ffd6a3" />
      <directionalLight position={[-5.5, 2.2, -3.5]} intensity={1.85} color="#e8a87c" />
      <spotLight
        position={[0, 7, 2.5]}
        angle={0.55}
        penumbra={1}
        intensity={1.5}
        color="#fff3de"
        distance={22}
        decay={2}
      />
      <pointLight position={[-3, -1.2, 3]} intensity={1} color="#ff9a52" distance={12} decay={2} />

      {/* Refleksi lembut untuk olesan mengkilap — dibuat lokal, tanpa HDR eksternal. */}
      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.1}
          color="#ffdcb0"
          position={[0, 5, -6]}
          scale={[12, 6, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          color="#e8a87c"
          position={[-7, 1.5, 2]}
          rotation-y={Math.PI / 2}
          scale={[10, 5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.1}
          color="#fff6ea"
          position={[7, 3, 3]}
          rotation-y={-Math.PI / 2}
          scale={[8, 5, 1]}
        />
        <Lightformer form="circle" intensity={0.7} color="#3a2418" position={[0, -5, 0]} scale={10} />
      </Environment>

      <CameraRig />

      {MODEL_URL ? (
        <GltfToast url={MODEL_URL} progressRef={progressRef} palette={variant.palette} />
      ) : (
        <ToastModel
          variant={variant}
          progressRef={progressRef}
          labels={labels}
          idleMotion={!reduced}
        />
      )}

      {particles && (
        <Crumbs palette={variant.palette} count={particleCount} reducedMotion={reduced} />
      )}

      <ContactShadows
        position={[0, -0.46, 0]}
        opacity={0.55}
        scale={10}
        blur={2.6}
        far={4}
        resolution={256}
        color="#170d06"
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enabled={interactive}
        enablePan={false}
        enableZoom={interactive && (coarse || shiftZoom)}
        minDistance={4.4}
        maxDistance={14}
        minPolarAngle={Math.PI * 0.14}
        maxPolarAngle={Math.PI * 0.62}
        target={[0, 0.42, 0]}
        enableDamping
        dampingFactor={0.075}
        rotateSpeed={0.75}
        autoRotate={autoRotate && !reduced && !dragging}
        autoRotateSpeed={0.5}
        onStart={handleStart}
        onEnd={handleEnd}
      />

      <ControlBridge channel={channel} />
    </>
  );
}

/** Menyesuaikan jarak kamera agar roti selalu "pas" di layar apa pun. */
function CameraRig() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const perspective = camera as THREE.PerspectiveCamera;
    const fovRad = (perspective.fov * Math.PI) / 180;
    // Lebar dunia yang harus masuk frame. Potret butuh lebih sempit supaya
    // roti tidak tenggelam di layar tinggi; lanskap butuh ruang untuk label.
    const desiredWidth = aspect < 1 ? 5.6 : 7.15;
    const distance = THREE.MathUtils.clamp(
      desiredWidth / (2 * Math.tan(fovRad / 2) * aspect),
      5.8,
      16,
    );

    // Sudut pandang agak dari atas (≈27°) supaya permukaan panggang roti
    // atas terlihat, bukan hanya sisi sampingnya.
    const target = new THREE.Vector3(0, 0.42, 0);
    const direction = new THREE.Vector3(0.32, 0.46, 0.83).normalize();
    camera.position.copy(target).addScaledVector(direction, distance);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

/** Menghubungkan tombol zoom/reset di DOM dengan kamera 3D. */
function ControlBridge({ channel }: { channel: string }) {
  const { camera } = useThree();
  const controls = useThree((state) => state.controls) as OrbitControlsImpl | null;

  useEffect(() => {
    return toastControls.onZoom(channel, (direction) => {
      if (!controls) return;
      const target = controls.target;
      const offset = camera.position.clone().sub(target);
      const nextDistance = THREE.MathUtils.clamp(
        offset.length() * (direction > 0 ? 0.85 : 1.18),
        4.4,
        14,
      );
      offset.normalize().multiplyScalar(nextDistance);
      const destination = target.clone().add(offset);

      gsap.to(camera.position, {
        x: destination.x,
        y: destination.y,
        z: destination.z,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate: () => controls.update(),
      });
    });
  }, [channel, camera, controls]);

  useEffect(() => {
    return toastControls.onReset(channel, () => {
      controls?.reset();
    });
  }, [channel, controls]);

  return null;
}
