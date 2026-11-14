'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Kursor kustom: titik kecil + cincin yang mengikuti pointer dengan easing.
 * Hanya aktif pada perangkat bertitik presisi (mouse/trackpad).
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>('[data-cursor]');
      if (!trigger) {
        setActive(false);
        setLabel(null);
        return;
      }
      setActive(true);
      const value = trigger.dataset.cursor;
      setLabel(value && value !== 'hover' ? value : null);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      root.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[120] hidden md:block">
      <div
        ref={ringRef}
        className={[
          'absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border',
          'transition-[width,height,background-color,border-color,opacity] duration-300 ease-out-expo',
          active
            ? 'border-transparent bg-cream/95 text-ink'
            : 'border-cream/35 bg-transparent text-transparent',
        ].join(' ')}
        style={{ marginLeft: -22, marginTop: -22 }}
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">
          {label ?? ''}
        </span>
      </div>
      <div
        ref={dotRef}
        className={[
          'absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-cheese',
          'transition-opacity duration-200',
          active ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
        style={{ marginLeft: -3, marginTop: -3 }}
      />
    </div>
  );
}
