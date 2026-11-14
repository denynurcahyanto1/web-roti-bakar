'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'solid' | 'ghost' | 'dark';
  external?: boolean;
  strength?: number;
  ariaLabel?: string;
};

const VARIANTS = {
  solid:
    'bg-cream text-ink hover:bg-white shadow-[0_18px_50px_-24px_rgba(245,230,200,0.65)]',
  ghost: 'border border-cream/25 text-cream/90 hover:border-cream/60 hover:bg-cream/[0.06]',
  dark: 'bg-ink/70 text-cream border border-white/10 hover:border-cheese/40 hover:bg-ink',
} as const;

/**
 * Tombol dengan tarikan magnetis: elemen bergeser sedikit ke arah pointer.
 * Dimatikan otomatis untuk reduced-motion dan perangkat sentuh.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  className,
  variant = 'solid',
  external,
  strength = 0.22,
  ariaLabel,
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const el = innerRef.current;
    if (!wrap || !el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);

    return () => {
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength]);

  const classes = cn(
    'group relative inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5',
    'font-body text-[13px] font-semibold tracking-[0.02em] transition-colors duration-300',
    'will-change-transform',
    VARIANTS[variant],
    className,
  );

  return (
    <span ref={wrapRef} className="inline-flex">
      {href ? (
        <a
          ref={(node) => {
            innerRef.current = node;
          }}
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          aria-label={ariaLabel}
          data-cursor="hover"
          className={classes}
        >
          {children}
        </a>
      ) : (
        <button
          ref={(node) => {
            innerRef.current = node;
          }}
          type="button"
          onClick={onClick}
          aria-label={ariaLabel}
          data-cursor="hover"
          className={classes}
        >
          {children}
        </button>
      )}
    </span>
  );
}
