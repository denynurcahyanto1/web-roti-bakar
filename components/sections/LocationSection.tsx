'use client';

import { useEffect, useRef, useState } from 'react';
import { site, type Outlet } from '@/lib/site';
import { getOpeningState, getTodayIndex, type OpeningState } from '@/lib/hours';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { MagneticButton } from '@/components/ui/MagneticButton';

type StatusKey = OpeningState | 'soon';

const STATUS: Record<
  StatusKey,
  { label: string; pill: string; dot: string }
> = {
  open: {
    label: 'Sedang buka',
    pill: 'border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300/90',
    dot: 'animate-pulse-soft bg-emerald-400',
  },
  closed: {
    label: 'Sedang tutup',
    pill: 'border-cheese/25 bg-cheese/[0.08] text-cheese/80',
    dot: 'bg-cheese/70',
  },
  soon: {
    label: 'Segera hadir',
    pill: 'border-white/10 bg-white/[0.03] text-cream/50',
    dot: 'bg-cream/35',
  },
  unknown: {
    label: 'Cek jam buka',
    pill: 'border-white/10 text-cream/40',
    dot: 'bg-cream/25',
  },
};

export function LocationSection() {
  const [activeId, setActiveId] = useState<string>(site.outlets[0].id);
  // Dihitung di client agar tidak ada hydration mismatch akibat zona waktu.
  const [todayIndex, setTodayIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<StatusKey>('unknown');

  const activeOutlet =
    site.outlets.find((outlet) => outlet.id === activeId) ?? site.outlets[0];

  useEffect(() => {
    setTodayIndex(getTodayIndex());
    setStatus(
      activeOutlet.status === 'coming-soon'
        ? 'soon'
        : getOpeningState(activeOutlet.hours),
    );
  }, [activeOutlet]);

  const statusMeta = STATUS[status];

  return (
    <section id="lokasi" className="relative section-pad">
      <div className="container-page">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            index="04"
            eyebrow="Lokasi"
            title={
              <>
                Mampir,
                <span className="text-cream/40"> atau pesan dari rumah.</span>
              </>
            }
            description="Outlet utama ada di Bonoroto, Karanganyar — buka sore sampai malam. Outlet berikutnya segera menyusul."
          />

          <Reveal delay={0.1}>
            <div
              className={cn(
                'flex items-center gap-2.5 rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em]',
                statusMeta.pill,
              )}
            >
              <span className={cn('h-1.5 w-1.5 rounded-full', statusMeta.dot)} />
              {statusMeta.label}
            </div>
          </Reveal>
        </div>

        {/* Pemilih outlet */}
        <Reveal delay={0.06}>
          <div className="no-scrollbar -mx-[var(--gutter)] mt-10 flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1 md:mx-0 md:flex-wrap md:px-0">
            {site.outlets.map((outlet) => {
              const isActive = outlet.id === activeOutlet.id;
              return (
                <button
                  key={outlet.id}
                  type="button"
                  onClick={() => setActiveId(outlet.id)}
                  aria-pressed={isActive}
                  data-cursor="hover"
                  className={cn(
                    'flex shrink-0 items-center gap-2.5 rounded-full border px-4 py-2.5 transition-colors duration-300',
                    isActive
                      ? 'border-cheese/40 bg-cheese/[0.1] text-cream'
                      : 'border-white/10 bg-white/[0.02] text-cream-dim/60 hover:border-white/20 hover:text-cream',
                  )}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      outlet.status === 'open' ? 'bg-emerald-400' : 'bg-cheese/45',
                    )}
                  />
                  <span className="text-[12px] font-medium">{outlet.name}</span>
                  <span
                    className={cn(
                      'text-[9px] uppercase tracking-[0.16em]',
                      isActive ? 'text-cream/40' : 'text-cream/25',
                    )}
                  >
                    {outlet.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.15fr]">
          {/* Info */}
          <div className="flex flex-col gap-5">
            <Reveal>
              <div className="rounded-3xl border border-white/[0.07] bg-charcoal/50 p-6 md:p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="eyebrow">Alamat</p>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-cream/30">
                    {activeOutlet.name}
                  </span>
                </div>
                <p className="mt-4 font-display text-xl font-medium leading-snug tracking-[-0.02em] text-cream">
                  {activeOutlet.address.line1}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-cream-dim/55">
                  {activeOutlet.address.line2}
                  <br />
                  {activeOutlet.address.region}
                  {activeOutlet.address.postalCode
                    ? ` ${activeOutlet.address.postalCode}`
                    : ''}
                </p>

                {activeOutlet.note && (
                  <p className="mt-4 border-l border-cheese/25 pl-3 text-[11px] leading-relaxed text-cream/35">
                    {activeOutlet.note}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-2.5">
                  <MagneticButton
                    href={activeOutlet.maps.directions}
                    external
                    variant="ghost"
                    className="px-4 py-2.5 text-[11px]"
                  >
                    Buka di Maps
                    <ArrowUpRight />
                  </MagneticButton>
                  <MagneticButton
                    href={site.whatsapp.link}
                    external
                    variant="dark"
                    className="px-4 py-2.5 text-[11px]"
                  >
                    Chat dulu
                  </MagneticButton>
                </div>

                {activeOutlet.status === 'open' && (
                  <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/[0.06] pt-5">
                    {site.amenities.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-[11px] text-cream-dim/55"
                      >
                        <span className="h-1 w-1 rounded-full bg-cheese/60" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-3xl border border-white/[0.07] bg-charcoal/50 p-6 md:p-7">
                <div className="flex items-baseline justify-between">
                  <p className="eyebrow">Jam buka</p>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-cream/30">
                    WIB
                  </span>
                </div>

                {activeOutlet.hours.length > 0 ? (
                  <ul className="mt-4 divide-y divide-white/[0.05]">
                    {activeOutlet.hours.map((row, index) => {
                      const isToday = todayIndex === index;
                      return (
                        <li
                          key={row.day}
                          className={cn(
                            'flex items-center justify-between py-2 text-[12.5px] transition-colors',
                            isToday ? 'text-cream' : 'text-cream-dim/45',
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            {isToday && <span className="h-1 w-1 rounded-full bg-cheese" />}
                            <span className={cn(isToday && 'font-medium')}>{row.day}</span>
                          </span>
                          <span className="tabular-nums">
                            {row.open} — {row.close}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-4 text-[13px] leading-relaxed text-cream-dim/55">
                    Jam buka outlet ini belum ditetapkan. Ikuti Instagram atau tanya
                    lewat WhatsApp untuk jadwal terbaru.
                  </p>
                )}
              </div>
            </Reveal>
          </div>

          {/* Peta */}
          <Reveal delay={0.12} className="min-h-[380px]">
            <div className="relative h-full min-h-[380px] overflow-hidden rounded-3xl border border-white/[0.08] bg-charcoal">
              <MapEmbed key={activeOutlet.id} outlet={activeOutlet} />

              {/* Bingkai & label di atas peta */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/70 to-transparent" />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-ink/70 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-cream/70 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-cheese" />
                {activeOutlet.name}
              </div>

              <a
                href={activeOutlet.maps.directions}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-cream px-4 py-2.5 text-[11px] font-semibold text-ink shadow-lg transition-colors hover:bg-white"
              >
                Rute perjalanan
                <ArrowUpRight />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
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

/**
 * Embed Google Maps baru dimuat ketika panel mendekati viewport, dan iframe
 * disembunyikan sampai tile pertama selesai dimuat. Tanpa ini, kotak putih
 * bawaan iframe sempat berkedip di tengah halaman yang serba gelap.
 *
 * Komponen ini di-key per outlet, jadi memilih outlet lain akan me-remount
 * iframe dan memuat peta baru dari awal.
 */
function MapEmbed({ outlet }: { outlet: Outlet }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {/* Placeholder gelap: grid tipis + label, tidak pernah putih */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_38%,#1e1712_0%,#0f0c09_100%)]"
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(rgba(245,230,200,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,230,200,0.05) 1px, transparent 1px)',
            backgroundSize: '46px 46px',
          }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-cream/25">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-cheese/60" />
            {loaded ? 'Peta lokasi' : 'Memuat peta'}
          </span>
        </div>
      </div>

      {inView && (
        <iframe
          title={`Peta lokasi ${site.name} — ${outlet.name}`}
          src={outlet.maps.embed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          className={cn(
            'absolute inset-0 h-full w-full transition-opacity duration-700',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
          style={{
            border: 0,
            filter: 'grayscale(0.35) sepia(0.18) saturate(0.75) brightness(0.82) contrast(1.05)',
          }}
        />
      )}
    </div>
  );
}
