'use client';

import { MENU, type MenuVariant } from '@/lib/menu';
import { site } from '@/lib/site';
import { formatIDR } from '@/lib/utils';
import { useUIStore } from '@/store/useUIStore';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ToastThumb } from '@/components/ui/ToastThumb';
import { Reveal } from '@/components/ui/Reveal';
import { Marquee } from '@/components/ui/Marquee';

export function MenuSection() {
  const openItem = useUIStore((state) => state.openItem);

  return (
    <section id="menu" className="relative section-pad">
      <Marquee />

      <div className="container-page mt-16 md:mt-24">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            index="02"
            eyebrow="Menu"
            title={
              <>
                Lapisan rasa,
                <span className="text-cream/40"> satu per satu.</span>
              </>
            }
            description="Setiap varian disusun dari roti yang sama: dipanggang hingga garing di luar, tetap lembut di dalam. Ketuk kartu untuk melihat lapisannya dari dekat."
          />

          <Reveal delay={0.1}>
            <div className="flex items-center gap-3 rounded-full border border-white/[0.07] bg-white/[0.02] px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-cream/40">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-cheese" />
              3D interaktif
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {MENU.map((item) => (
            <Reveal key={item.key} delay={0.04}>
              <MenuCard item={item} onOpen={() => openItem(item.key)} />
            </Reveal>
          ))}
        </div>

        {/* Ajakan membuat kombinasi sendiri */}
        <Reveal className="mt-6">
          <div className="group relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-r from-charcoal to-ink p-6 sm:flex-row sm:items-center md:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-cheese/10 blur-3xl"
            />
            <div className="relative">
              <p className="eyebrow">Racik sendiri</p>
              <p className="mt-3 max-w-md font-display text-xl font-medium leading-snug tracking-[-0.02em] text-cream/90 md:text-2xl">
                Mau kombinasi lain? Sebut saja olesan dan topping favoritmu.
              </p>
            </div>
            <a
              href={site.whatsapp.orderLink('custom')}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="relative inline-flex shrink-0 items-center gap-2 rounded-full border border-cream/20 px-5 py-3 text-[12px] font-semibold text-cream transition-colors hover:border-cheese/50 hover:bg-cream/[0.06]"
            >
              Tanya via WhatsApp
              <ArrowUpRight />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MenuCard({ item, onOpen }: { item: MenuVariant; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      data-cursor="view"
      aria-label={`Lihat ${item.name} dalam 3D`}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-charcoal/60 text-left transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:border-cheese/25 hover:bg-charcoal"
    >
      {/* Visual */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden"
        style={{
          background: `radial-gradient(120% 100% at 50% 15%, ${item.card.from} 0%, ${item.card.to} 72%)`,
        }}
      >
        <div className="absolute inset-0 opacity-70 transition-transform duration-700 ease-out-expo group-hover:scale-[1.06] group-hover:-rotate-1">
          <ToastThumb variant={item} />
        </div>

        {item.badge && (
          <span className="absolute left-4 top-4 rounded-full border border-cream/15 bg-ink/50 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-cream/80 backdrop-blur">
            {item.badge}
          </span>
        )}

        <span className="absolute right-4 top-4 rounded-full bg-cream/95 px-3 py-1 text-[11px] font-semibold tabular-nums text-ink">
          {formatIDR(item.price)}
        </span>

        {/* Overlay ajakan */}
        <span className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-between bg-gradient-to-t from-ink/85 to-transparent px-4 pb-3 pt-10 text-[10px] font-semibold uppercase tracking-[0.16em] text-cream/70 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          Putar & bongkar
          <span className="grid h-7 w-7 place-items-center rounded-full border border-cream/25">
            <ArrowUpRight />
          </span>
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold tracking-[-0.02em] text-cream">
          {item.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-cream-dim/60">
          {item.description}
        </p>
        <span className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cheese/70">
          Lihat 3D
          <ArrowUpRight />
        </span>
      </div>
    </button>
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
