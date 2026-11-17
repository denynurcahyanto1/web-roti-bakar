'use client';

import { site } from '@/lib/site';
import { getServiceWindow } from '@/lib/hours';
import { scrollToSection, scrollToTop } from '@/lib/lenis';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Reveal } from '@/components/ui/Reveal';
import { BrandWordmark } from '@/components/ui/BrandWordmark';

const NAV = [
  { id: 'menu', label: 'Menu' },
  { id: 'cerita', label: 'Cerita' },
  { id: 'lokasi', label: 'Lokasi' },
];

export function Footer() {
  const year = new Date().getFullYear();
  const serviceWindow = getServiceWindow(site.hours);

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(70%_100%_at_50%_0%,rgba(232,168,124,0.09),transparent_70%)]"
      />

      <div className="container-page relative">
        {/* Ajakan pesan */}
        <div className="flex flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between md:py-20">
          <Reveal>
            <p className="eyebrow">Pesan sekarang</p>
            <p className="mt-5 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-cream sm:text-5xl md:text-6xl">
              Roti hangat,
              <br />
              <span className="text-cream/30">siap diantar.</span>
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <MagneticButton href={site.whatsapp.link} external>
                WhatsApp
                <ArrowUpRight />
              </MagneticButton>
              <MagneticButton href={site.gofood.link} external variant="ghost">
                GoFood
                <ArrowUpRight />
              </MagneticButton>
            </div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-cream/30 sm:text-right">
              {serviceWindow
                ? `Dikirim ${serviceWindow.open} — ${serviceWindow.close} · ${site.city}`
                : `Dikirim di ${site.city}`}
            </p>
          </Reveal>
        </div>

        <div className="hairline" />

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.15fr]">
          <div>
            <BrandWordmark className="text-[42px]" since />
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-cream-dim/50">
              {site.tagline} Dibuat per porsi, sejak {site.established}.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <SocialLink href={site.instagram.link} label="Instagram">
                <InstagramIcon />
              </SocialLink>
              <SocialLink href={site.whatsapp.link} label="WhatsApp">
                <WhatsAppIcon />
              </SocialLink>
              <SocialLink href={site.gofood.link} label="GoFood">
                <GoFoodIcon />
              </SocialLink>
            </div>
          </div>

          <FooterColumn title="Jelajahi">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="inline-flex min-h-11 items-center text-left text-[13px] text-cream-dim/60 transition-colors hover:text-cream sm:min-h-0"
              >
                {item.label}
              </button>
            ))}
          </FooterColumn>

          <FooterColumn title="Kontak">
            <a
              href={site.whatsapp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-[13px] text-cream-dim/60 transition-colors hover:text-cream sm:min-h-0"
            >
              {site.whatsapp.display}
            </a>
            <a
              href={site.instagram.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-[13px] text-cream-dim/60 transition-colors hover:text-cream sm:min-h-0"
            >
              {site.instagram.handle}
            </a>
            <a
              href={site.gofood.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-[13px] text-cream-dim/60 transition-colors hover:text-cream sm:min-h-0"
            >
              GoFood
            </a>
          </FooterColumn>

          <FooterColumn title="Kunjungi">
            <p className="text-[13px] leading-relaxed text-cream-dim/60">
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.region} {site.address.postalCode}
            </p>
            <a
              href={site.maps.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 text-[12px] text-cheese/70 transition-colors hover:text-cheese sm:min-h-0"
            >
              Lihat rute
              <ArrowUpRight />
            </a>
          </FooterColumn>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/[0.06] py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-cream/25">
            © {year} {site.name}. Semua hak dilindungi.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            data-cursor="hover"
            className="group inline-flex min-h-11 items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-cream/35 transition-colors hover:text-cream"
          >
            Kembali ke atas
            <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
              <ArrowUpIcon />
            </span>
          </button>
        </div>
      </div>

      {/* Wordmark penutup */}
      <div aria-hidden className="pointer-events-none relative select-none overflow-hidden">
        <p className="translate-y-[12%] whitespace-nowrap text-center font-logo text-[34vw] leading-[0.62] text-cream/[0.05] md:text-[27vw]">
          Hersha
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-cream/30">{title}</p>
      {children}
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-cursor="hover"
      className="grid h-11 w-11 place-items-center rounded-full border border-white/[0.08] text-cream/50 transition-colors hover:border-cheese/35 hover:text-cream md:h-9 md:w-9"
    >
      {children}
    </a>
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

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path
        d="M8 12.5v-9M4 7.5 8 3.5l4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden>
      <rect x="2.4" y="2.4" width="11.2" height="11.2" rx="3.4" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="11.4" cy="4.6" r="0.85" fill="currentColor" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M2.6 13.4 3.4 11a5.4 5.4 0 1 1 2.1 1.9l-2.9.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M6.2 5.7c.2-.4.5-.4.7-.1l.6.9c.1.2 0 .4-.1.6l-.3.3c-.2.2-.2.4 0 .7.4.6.9 1.1 1.5 1.4.3.2.5.1.7-.1l.3-.4c.2-.2.4-.2.6-.1l.9.5c.3.2.3.5 0 .7-.4.4-.9.7-1.5.6-1.6-.2-3.1-1.7-3.5-3.3-.1-.6.1-1.1.5-1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GoFoodIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M2.6 6.2c2.2-2 4-2.6 5.4-2.6s3.2.6 5.4 2.6c-1 4.2-2.6 6.4-5.4 6.4S3.6 10.4 2.6 6.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="6.3" cy="7.6" r="0.8" fill="currentColor" />
      <circle cx="9.7" cy="7.6" r="0.8" fill="currentColor" />
    </svg>
  );
}
