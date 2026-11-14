'use client';

import { useEffect, useState } from 'react';
import { site } from '@/lib/site';
import { lockScroll, scrollToSection, scrollToTop, unlockScroll } from '@/lib/lenis';
import { cn } from '@/lib/utils';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { BrandWordmark } from '@/components/ui/BrandWordmark';

const LINKS = [
  { id: 'menu', label: 'Menu' },
  { id: 'cerita', label: 'Cerita' },
  { id: 'lokasi', label: 'Lokasi' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open) lockScroll();
    else unlockScroll();
    return () => unlockScroll();
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    // Tunggu overlay menutup supaya posisi scroll dihitung ulang dengan benar.
    window.setTimeout(() => scrollToSection(id), 120);
  };

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
          scrolled || open
            ? 'border-b border-white/[0.06] bg-ink/70 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="container-page flex h-[var(--nav-h)] items-center justify-between">
          <button
            type="button"
            onClick={scrollToTop}
            data-cursor="hover"
            className="group flex items-center gap-3 text-left"
            aria-label="Kembali ke atas"
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-cream/15 bg-cream/[0.04] transition-colors group-hover:border-cheese/40">
              <ToastMark className="h-5 w-5" />
            </span>
            <BrandWordmark className="text-[32px]" />
          </button>

          <nav className="hidden items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.025] p-1.5 backdrop-blur-md md:flex">
            {LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => go(link.id)}
                data-cursor="hover"
                className="rounded-full px-4 py-2 text-[12px] font-medium text-cream/65 transition-colors hover:bg-white/[0.06] hover:text-cream"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={site.whatsapp.link}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="hidden items-center gap-2 text-[12px] font-medium text-cream/70 transition-colors hover:text-cream lg:flex"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
              Buka sekarang
            </a>

            <MagneticButton
              href={site.whatsapp.link}
              external
              variant="solid"
              className="hidden px-5 py-2.5 text-[12px] sm:inline-flex"
            >
              Pesan
            </MagneticButton>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-label={open ? 'Tutup menu' : 'Buka menu'}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-cream md:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={cn(
                    'absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300',
                    open && 'translate-y-[6px] rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-[6px] h-px w-full bg-current transition-opacity duration-200',
                    open && 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-[12px] h-px w-full bg-current transition-transform duration-300',
                    open && '-translate-y-[6px] -rotate-45',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Overlay mobile */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-ink/95 backdrop-blur-2xl transition-all duration-500 ease-out-expo md:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col justify-between px-[var(--gutter)] pb-10 pt-[calc(var(--nav-h)+3rem)]">
          <nav className="flex flex-col gap-2">
            {LINKS.map((link, index) => (
              <button
                key={link.id}
                type="button"
                onClick={() => go(link.id)}
                className={cn(
                  'flex items-baseline gap-4 border-b border-white/[0.06] py-5 text-left',
                  'transition-all duration-500',
                  open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                )}
                style={{ transitionDelay: open ? `${120 + index * 70}ms` : '0ms' }}
              >
                <span className="text-[10px] tabular-nums tracking-[0.2em] text-cheese/50">
                  0{index + 1}
                </span>
                <span className="font-display text-4xl font-semibold tracking-[-0.03em] text-cream">
                  {link.label}
                </span>
              </button>
            ))}
          </nav>

          <div className="flex flex-col gap-5">
            <a
              href={site.whatsapp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-cream px-6 py-4 text-sm font-semibold text-ink"
            >
              Pesan via WhatsApp
            </a>
            <div className="flex items-center justify-between text-[11px] text-cream/45">
              <span>{site.instagram.handle}</span>
              <span>{site.address.line1}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ToastMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="9" width="18" height="12" rx="4" fill="currentColor" opacity="0.92" />
      <path d="M3 13.5c3-2 5 1.5 9 0s6 1 9-1" stroke="#0a0908" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M8 6.5c0-1.2 1-1.8 1-3M12.5 6c0-1.4 1-2 1-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}
