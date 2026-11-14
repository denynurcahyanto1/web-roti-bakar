'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
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
  return <LazyToastScene {...props} />;
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
