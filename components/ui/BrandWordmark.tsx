import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * Lockup teks brand, mengikuti logo asli: "Hersha" (script), "Roti Bakar",
 * "Empuk Ginuk Ginuk", dan "Since 2012".
 *
 * Ukuran diatur lewat font-size wrapper (mis. className="text-[30px]"),
 * sementara baris di bawahnya memakai satuan em supaya ikut mengecil.
 * Kalau file logo PNG/SVG asli sudah tersedia, taruh di public/ dan ganti
 * komponen ini dengan <Image src="/logo.png" />.
 */
export function BrandWordmark({
  className,
  since = false,
  tagline = true,
}: {
  className?: string;
  since?: boolean;
  tagline?: boolean;
}) {
  return (
    <span className={cn('inline-flex flex-col items-start leading-none', className)}>
      <span className="pr-[0.08em] font-logo text-[1em] leading-[0.7] text-cream">
        Hersha
      </span>

      {tagline && (
        <span className="mt-[0.55em] whitespace-nowrap text-[0.23em] font-semibold uppercase leading-none tracking-[0.26em] text-cream/45">
          Roti Bakar <span className="text-cheese/60">·</span> Empuk Ginuk Ginuk
        </span>
      )}

      {since && (
        <span className="mt-[0.75em] flex items-center gap-[0.7em] whitespace-nowrap text-[0.18em] font-semibold uppercase leading-none tracking-[0.34em] text-cream/30">
          <span aria-hidden className="h-px w-[1.8em] bg-cream/20" />
          Since {site.established}
          <span aria-hidden className="h-px w-[1.8em] bg-cream/20" />
        </span>
      )}
    </span>
  );
}

/** Uap panas di atas wordmark — ciri khas logo asli. */
export function SteamCurls({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 40" fill="none" className={className} aria-hidden>
      <path
        d="M21 37c-6.6-4.2-7.5-9-2.2-12.4 4.1-2.7 4-6.3 0-8.7-3.1-2-3-5-.2-7.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M29.5 35.5c-4-3.7-4-7.5.9-10.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.62"
      />
      <path
        d="M14 33c-3-3-1.7-6 1.5-8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.38"
      />
    </svg>
  );
}
