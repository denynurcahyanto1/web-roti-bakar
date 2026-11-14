'use client';

import { useEffect, useRef, useState } from 'react';
import { MENU, getVariant } from '@/lib/menu';
import { site } from '@/lib/site';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { scrollToSection } from '@/lib/lenis';
import { toastControls } from '@/lib/toast-controls';
import { cn, formatIDR } from '@/lib/utils';
import { useUIStore } from '@/store/useUIStore';
import ToastCanvas from '@/components/three/ToastCanvas';
import { MagneticButton } from '@/components/ui/MagneticButton';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  /** Sumber tunggal untuk exploded view di canvas. */
  const progressRef = useRef(0);
  const [exploded, setExploded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const variantKey = useUIStore((state) => state.variant);
  const setVariant = useUIStore((state) => state.setVariant);
  const activeItem = useUIStore((state) => state.activeItem);
  const variant = getVariant(variantKey);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          // Scroll selalu mengambil alih dari tombol manual.
          progressRef.current = self.progress;
          setExploded(self.progress > 0.55);
        },
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '42% top',
          scrub: true,
        },
      });

      timeline
        .to('.hero-copy', { y: -40, opacity: 0, ease: 'none' }, 0)
        .to('.hero-chrome', { opacity: 0, ease: 'none' }, 0)
        .to('.hero-wordmark', { opacity: 0.2, scale: 1.05, ease: 'none' }, 0);

      // Intro masuk sekali saat halaman dimuat.
      gsap.from('.hero-intro', {
        y: 26,
        opacity: 0,
        duration: 1.1,
        stagger: 0.09,
        delay: 0.2,
        ease: 'power3.out',
      });
      gsap.from('.hero-wordmark-inner', {
        opacity: 0,
        scale: 1.06,
        duration: 1.8,
        delay: 0.1,
        ease: 'expo.out',
      });
    },
    { scope: sectionRef },
  );

  const toggleExplode = () => {
    const next = !exploded;
    setExploded(next);
    progressRef.current = next ? 1 : 0;
  };

  return (
    <section id="hero" ref={sectionRef} className="relative h-[190svh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden grain">
        {/* ------------------------------------------------------------ */}
        {/*  Latar: gradasi hangat + glow di belakang roti               */}
        {/* ------------------------------------------------------------ */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_62%,#2a1d13_0%,#120e0b_48%,#0a0908_100%)]" />
          <div className="absolute left-1/2 top-[58%] h-[62vmin] w-[62vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cheese/[0.11] blur-[110px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_45%,rgba(10,9,8,0.85)_80%,#0a0908_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(closest-side,transparent_55%,rgba(10,9,8,0.75)_100%)]" />
        </div>

        {/* ------------------------------------------------------------ */}
        {/*  Wordmark raksasa di belakang model                          */}
        {/* ------------------------------------------------------------ */}
        <div className="hero-wordmark pointer-events-none absolute inset-x-0 top-[38%] z-0 -translate-y-1/2 text-center md:top-[44%]">
          <div className="hero-wordmark-inner">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.62em] text-cream/55 md:text-[12px] md:tracking-[0.85em]">
              Roti Bakar
            </span>
            <h1 className="mt-1 select-none bg-gradient-to-b from-cream/[0.17] via-cream/[0.07] to-cream/[0.01] bg-clip-text font-display text-[26vw] font-extrabold leading-[0.8] tracking-[-0.05em] text-transparent md:-mt-2 md:text-[21vw]">
              <span className="sr-only">Roti Bakar Hersha</span>
              <span aria-hidden>HERSHA</span>
            </h1>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/*  Canvas 3D                                                   */}
        {/* ------------------------------------------------------------ */}
        <div
          data-cursor="drag"
          className="canvas-layer absolute inset-x-0 bottom-[38%] top-[8%] z-10 md:inset-x-[6%] md:bottom-[18%] md:top-[6%] lg:inset-x-[10%]"
        >
          <ToastCanvas
            variant={variant}
            progressRef={progressRef}
            channel="hero"
            autoRotate
            labels={isDesktop}
            particles
            paused={activeItem !== null}
          />
        </div>

        {/* ------------------------------------------------------------ */}
        {/*  Pemilih varian — kolom kanan (desktop)                      */}
        {/* ------------------------------------------------------------ */}
        <div className="absolute right-[var(--gutter)] top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-1.5 lg:flex">
          <span className="mb-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-cream/35">
            Lapisan rasa
          </span>
          {MENU.map((item) => {
            const active = item.key === variantKey;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setVariant(item.key)}
                data-cursor="hover"
                aria-pressed={active}
                className={cn(
                  'group flex items-center gap-2.5 rounded-full py-2 pl-3 pr-4 text-[11px] transition-all duration-300',
                  active
                    ? 'bg-cream/[0.08] text-cream'
                    : 'text-cream/40 hover:bg-cream/[0.04] hover:text-cream/80',
                )}
              >
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full transition-all duration-300',
                    active ? 'scale-100' : 'scale-75 opacity-50',
                  )}
                  style={{ backgroundColor: item.palette.glow }}
                />
                <span className="whitespace-nowrap">{item.short}</span>
                <span
                  className={cn(
                    'tabular-nums text-[10px] transition-opacity',
                    active ? 'text-cream/45' : 'text-transparent',
                  )}
                >
                  {formatIDR(item.price)}
                </span>
              </button>
            );
          })}
        </div>

        {/* ------------------------------------------------------------ */}
        {/*  Teks utama + CTA                                            */}
        {/* ------------------------------------------------------------ */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-[var(--gutter)] pb-8 md:pb-12">
          <div className="hero-copy pointer-events-none mx-auto flex max-w-[1440px] flex-col items-start">
            <div className="hero-intro flex items-center gap-2.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: variant.palette.glow }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cream/50">
                {variant.name}
              </span>
              <span className="text-cream/20">/</span>
              <span className="text-[11px] text-cream/65">{formatIDR(variant.price)}</span>
            </div>

            <p className="hero-intro mt-4 max-w-[19rem] font-display text-[22px] font-medium leading-[1.15] tracking-[-0.02em] text-cream sm:max-w-sm sm:text-2xl md:text-[28px]">
              Enam lapisan rasa.
              <span className="text-cream/45"> Satu roti yang bikin balik lagi.</span>
            </p>

            <div className="hero-intro pointer-events-auto mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <MagneticButton href={site.whatsapp.link} external className="px-5 py-3 sm:px-6 sm:py-3.5">
                Pesan Sekarang
                <ArrowIcon />
              </MagneticButton>
              <MagneticButton
                variant="ghost"
                onClick={() => scrollToSection('menu')}
                className="px-5 py-3 sm:px-6 sm:py-3.5"
              >
                Lihat Menu
              </MagneticButton>
            </div>

            <p className="hero-intro mt-5 hidden items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-cream/30 md:flex">
              <span className="h-px w-6 bg-cream/20" />
              Dipanggang di atas bara · {site.city} · Sejak {site.established}
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/*  Pilihan varian — bar horizontal (mobile)                    */}
        {/* ------------------------------------------------------------ */}
        <div className="absolute inset-x-0 top-[63%] z-20 lg:hidden">
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1">
            {MENU.map((item) => {
              const active = item.key === variantKey;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setVariant(item.key)}
                  aria-pressed={active}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] transition-colors',
                    active
                      ? 'border-cream/25 bg-cream/10 text-cream'
                      : 'border-white/[0.08] bg-ink/40 text-cream/50',
                  )}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: item.palette.glow }}
                  />
                  {item.short}
                </button>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/*  Kontrol kamera + tombol bongkar                             */}
        {/* ------------------------------------------------------------ */}
        <div className="absolute bottom-6 right-[var(--gutter)] z-30 hidden flex-col items-end gap-2.5 md:flex md:bottom-8">
          <p className="hero-chrome whitespace-nowrap text-[9px] uppercase tracking-[0.22em] text-cream/30">
            Drag untuk memutar <span className="text-cheese/40">·</span> Shift + scroll untuk zoom
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-full border border-white/[0.09] bg-ink/50 p-1 backdrop-blur-md">
              <button
                type="button"
                onClick={() => toastControls.zoom('hero', -1)}
                aria-label="Perkecil model"
                data-cursor="hover"
                className="grid h-8 w-8 place-items-center rounded-full text-cream/60 transition-colors hover:bg-cream/10 hover:text-cream"
              >
                <MinusIcon />
              </button>
              <span className="px-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-cream/30">
                Zoom
              </span>
              <button
                type="button"
                onClick={() => toastControls.zoom('hero', 1)}
                aria-label="Perbesar model"
                data-cursor="hover"
                className="grid h-8 w-8 place-items-center rounded-full text-cream/60 transition-colors hover:bg-cream/10 hover:text-cream"
              >
                <PlusIcon />
              </button>
            </div>

            <button
              type="button"
              onClick={toggleExplode}
              data-cursor="hover"
              aria-pressed={exploded}
              className={cn(
                'group flex items-center gap-2.5 rounded-full border py-2.5 pl-4 pr-5 text-[11px] font-semibold transition-all duration-300',
                exploded
                  ? 'border-cheese/50 bg-cheese/15 text-cream'
                  : 'border-white/[0.09] bg-ink/50 text-cream/70 backdrop-blur-md hover:border-cheese/40 hover:text-cream',
              )}
            >
              <LayersIcon />
              {exploded ? 'Satukan lapisan' : 'Bongkar lapisan'}
            </button>
          </div>
        </div>

        {/* Tombol bongkar versi mobile */}
        <div className="absolute right-[var(--gutter)] top-[55%] z-30 md:hidden">
          <button
            type="button"
            onClick={toggleExplode}
            aria-pressed={exploded}
            aria-label={exploded ? 'Satukan lapisan' : 'Bongkar lapisan'}
            className={cn(
              'grid h-10 w-10 place-items-center rounded-full border backdrop-blur',
              exploded
                ? 'border-cheese/50 bg-cheese/20 text-cream'
                : 'border-white/10 bg-ink/50 text-cream/60',
            )}
          >
            <LayersIcon />
          </button>
        </div>

        {/* ------------------------------------------------------------ */}
        {/*  Petunjuk scroll                                             */}
        {/* ------------------------------------------------------------ */}
        <div className="hero-chrome pointer-events-none absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
          <span className="text-[9px] uppercase tracking-[0.3em] text-cream/30">
            Scroll untuk membongkar
          </span>
          <span className="relative h-9 w-px overflow-hidden bg-white/10">
            <span className="absolute inset-x-0 -top-4 h-4 animate-scroll-line bg-cheese/70" />
          </span>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path d="M8 2 14 5 8 8 2 5 8 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M2 8.4 8 11.4l6-3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" opacity="0.65" />
      <path d="M2 11.4 8 14.4l6-3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" opacity="0.35" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path d="M3 8h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
