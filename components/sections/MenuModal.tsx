'use client';

import { useEffect, useRef, useState } from 'react';
import { MENU, getVariant, type ToppingKind } from '@/lib/menu';
import { site } from '@/lib/site';
import { cn, formatIDR } from '@/lib/utils';
import { useUIStore } from '@/store/useUIStore';
import { lockScroll, unlockScroll } from '@/lib/lenis';
import { toastControls } from '@/lib/toast-controls';
import ToastCanvas from '@/components/three/ToastCanvas';

const TOPPING_LABEL: Record<ToppingKind, string> = {
  shreds: 'Keju parut',
  meses: 'Meses cokelat',
  slices: 'Irisan pisang',
  nuts: 'Kacang hazelnut',
  flakes: 'Remahan renyah',
  blobs: 'Krim lembut',
};

/**
 * Modal detail menu dengan model 3D miliknya sendiri (channel kamera "modal"
 * supaya tidak bentrok dengan hero).
 */
export function MenuModal() {
  const activeItem = useUIStore((state) => state.activeItem);
  const variantKey = useUIStore((state) => state.variant);
  const setVariant = useUIStore((state) => state.setVariant);
  const closeItem = useUIStore((state) => state.closeItem);

  const variant = getVariant(variantKey);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef(0);
  const [exploded, setExploded] = useState(false);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Kunci scroll halaman + kelola fokus saat modal dibuka.
  useEffect(() => {
    if (!activeItem) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    lockScroll();
    progressRef.current = 0;
    setExploded(false);

    const raf = window.requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(raf);
      unlockScroll();
      previouslyFocused.current?.focus?.();
    };
  }, [activeItem]);

  // Tutup dengan Escape.
  useEffect(() => {
    if (!activeItem) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeItem();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeItem, closeItem]);

  // Animasi masuk panel.
  useEffect(() => {
    const panel = panelRef.current;
    if (!activeItem || !panel) return;
    panel.animate(
      [
        { opacity: 0, transform: 'translateY(18px) scale(0.985)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' },
      ],
      { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' },
    );
  }, [activeItem]);

  if (!activeItem) return null;

  const toggleExplode = () => {
    const next = !exploded;
    setExploded(next);
    progressRef.current = next ? 1 : 0;
  };

  const index = MENU.findIndex((item) => item.key === variant.key) + 1;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/80 p-3 backdrop-blur-xl md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-modal-title"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) closeItem();
      }}
    >
      <div
        ref={panelRef}
        className={cn(
          'relative grid h-[92svh] max-h-[800px] w-full max-w-5xl grid-rows-[minmax(0,42%)_minmax(0,58%)] overflow-hidden',
          'rounded-[26px] border border-white/10 bg-charcoal shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]',
          'md:h-[min(88svh,720px)] md:grid-cols-[1.1fr_1fr] md:grid-rows-1',
        )}
      >
        {/* ---------------------------------------------------------- */}
        {/*  Panggung 3D                                               */}
        {/* ---------------------------------------------------------- */}
        <div className="relative min-h-0 border-b border-white/[0.06] md:border-b-0 md:border-r">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 100% at 50% 40%, ${variant.card.from} 0%, ${variant.card.to} 70%)`,
            }}
          >
            <ToastCanvas
              variant={variant}
              progressRef={progressRef}
              channel="modal"
              autoRotate
              particles={false}
              labels={false}
            />
          </div>

          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-ink/50 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-cream/60 backdrop-blur md:left-5 md:top-5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: variant.palette.glow }} />
            Varian {String(index).padStart(2, '0')}
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2 md:bottom-5 md:left-5">
            <button
              type="button"
              onClick={toggleExplode}
              aria-pressed={exploded}
              data-cursor="hover"
              className={cn(
                'flex items-center gap-2 rounded-full border px-3.5 py-2 text-[10px] font-semibold transition-colors',
                exploded
                  ? 'border-cheese/50 bg-cheese/15 text-cream'
                  : 'border-white/10 bg-ink/50 text-cream/70 backdrop-blur hover:text-cream',
              )}
            >
              <LayersIcon />
              {exploded ? 'Satukan' : 'Bongkar'}
            </button>
            <button
              type="button"
              onClick={() => toastControls.reset('modal')}
              aria-label="Reset tampilan 3D"
              data-cursor="hover"
              className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-ink/50 text-cream/60 backdrop-blur transition-colors hover:text-cream"
            >
              <ResetIcon />
            </button>
          </div>

          <p className="pointer-events-none absolute bottom-5 right-5 hidden text-[9px] uppercase tracking-[0.2em] text-cream/30 md:block">
            Drag untuk memutar
          </p>
        </div>

        {/* ---------------------------------------------------------- */}
        {/*  Detail                                                    */}
        {/* ---------------------------------------------------------- */}
        <div className="flex min-h-0 flex-col overflow-y-auto p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <p className="eyebrow">Menu signature</p>
            <button
              ref={closeRef}
              type="button"
              onClick={closeItem}
              aria-label="Tutup detail menu"
              className="-mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-cream/60 transition-colors hover:border-cream/30 hover:text-cream"
            >
              <CloseIcon />
            </button>
          </div>

          <h2
            id="menu-modal-title"
            className="mt-4 font-display text-3xl font-semibold leading-[1.02] tracking-[-0.03em] text-cream md:text-4xl"
          >
            {variant.name}
          </h2>

          <p className="mt-4 text-[14px] leading-relaxed text-cream-dim/70">
            {variant.description}
          </p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-2xl font-semibold tracking-[-0.02em] text-cream">
              {formatIDR(variant.price)}
            </span>
            <span className="text-[11px] text-cream/35">per porsi</span>
          </div>

          <div className="mt-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-cream/35">
              Isi lapisan
            </p>
            <ul className="mt-3 divide-y divide-white/[0.06] border-y border-white/[0.06]">
              <li className="flex items-center justify-between py-2.5 text-[12px]">
                <span className="text-cream/45">Roti</span>
                <span className="text-cream/85">Panggang bara, tebal 2 cm</span>
              </li>
              <li className="flex items-center justify-between py-2.5 text-[12px]">
                <span className="text-cream/45">Olesan</span>
                <span className="text-cream/85">{variant.spreadFinish === 'gloss' ? 'Lumer & mengkilap' : 'Creamy & lembut'}</span>
              </li>
              {variant.toppings.map((topping) => (
                <li
                  key={topping.kind}
                  className="flex items-center justify-between py-2.5 text-[12px]"
                >
                  <span className="text-cream/45">Topping</span>
                  <span className="flex items-center gap-2 text-cream/85">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: topping.color }}
                    />
                    {TOPPING_LABEL[topping.kind]}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cheese/10 text-cheese/80">
              <FlameIcon />
            </span>
            <p className="text-[11.5px] leading-relaxed text-cream-dim/55">
              Dipanggang setelah dipesan, bukan disimpan hangat.
              <span className="text-cream/75"> Siap sekitar 8 menit</span> — lebih cepat kalau
              langsung ambil di tempat.
            </p>
          </div>

          <div className="mt-auto pt-7">
            <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-cream/35">
              Coba varian lain
            </p>
            <div className="flex flex-wrap gap-2">
              {MENU.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setVariant(item.key)}
                  aria-pressed={item.key === variant.key}
                  aria-label={item.name}
                  data-cursor="hover"
                  className={cn(
                    'grid h-8 w-8 place-items-center rounded-full border transition-all',
                    item.key === variant.key
                      ? 'border-cream/60'
                      : 'border-white/10 hover:border-white/30',
                  )}
                >
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{
                      background: `linear-gradient(140deg, ${item.palette.crumbLight}, ${item.palette.spread})`,
                    }}
                  />
                </button>
              ))}
            </div>

            <a
              href={site.whatsapp.orderLink(variant.name)}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-cream px-6 py-3.5 text-[13px] font-semibold text-ink transition-colors hover:bg-white"
            >
              Pesan {variant.short}
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden>
      <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path
        d="M13 8a5 5 0 1 1-1.7-3.8M13 2.5V5h-2.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path d="M8 2 14 5 8 8 2 5 8 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M2 8.4 8 11.4l6-3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" opacity="0.6" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path
        d="M8.4 1.8c.4 2.1-.6 3-1.5 3.9C5.8 6.8 4.8 8 4.8 9.7a3.4 3.4 0 0 0 6.8 0c0-1.3-.5-2.4-1.2-3.4-.3.8-.8 1.3-1.4 1.5.5-2-.1-4.6-.6-6Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3" aria-hidden>
      <path
        d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
