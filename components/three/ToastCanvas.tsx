'use client';

import dynamic from 'next/dynamic';
import { Component, useEffect, useState, type ComponentProps, type ReactNode } from 'react';
import type ToastScene from './ToastScene';

/**
 * Canvas dimuat hanya di client (ssr: false) karena WebGL tidak ada saat SSR
 * dan drei memakai hook browser-only. Wrapper ini yang boleh diimpor
 * komponen server maupun client.
 */
const LazyToastScene = dynamic(() => import('./ToastScene'), {
  ssr: false,
  loading: () => <SceneSkeleton />,
});

export default function ToastCanvas(props: ComponentProps<typeof ToastScene>) {
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const probe = document.createElement('canvas');
      const gl = probe.getContext('webgl2') ?? probe.getContext('webgl');
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      setWebgl(Boolean(gl));
    } catch {
      setWebgl(false);
    }
  }, []);

  if (webgl === false) return <SceneUnavailable />;
  if (webgl === null) return <SceneSkeleton />;

  return (
    <SceneBoundary>
      <LazyToastScene {...props} />
    </SceneBoundary>
  );
}

/**
 * Perangkat tanpa WebGL (browser lama, GPU diblokir, mode hemat) tetap harus
 * melihat sesuatu yang utuh, bukan area kosong atau layar error.
 */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <SceneUnavailable /> : this.props.children;
  }
}

function SceneSkeleton() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative h-40 w-40">
        <div className="absolute inset-0 animate-pulse-soft rounded-full bg-cheese/20 blur-2xl" />
        <div className="absolute inset-6 rounded-full border border-cheese/20" />
      </div>
    </div>
  );
}

function SceneUnavailable() {
  return (
    <div className="absolute inset-0 grid place-items-center px-6 text-center">
      <div className="max-w-[15rem]">
        <div className="mx-auto h-20 w-32 rounded-[40%_40%_30%_30%/60%_60%_40%_40%] bg-[radial-gradient(80%_80%_at_50%_20%,#f0c673,#b4761f_72%,#6d451a_100%)] shadow-[0_24px_50px_-24px_rgba(0,0,0,0.8)]" />
        <p className="mt-5 text-[11px] leading-relaxed text-cream/50">
          Model 3D tidak bisa dimuat di perangkat ini. Semua varian dan lapisannya tetap
          bisa dilihat di bagian menu.
        </p>
      </div>
    </div>
  );
}
