import { cn } from '@/lib/utils';

const ITEMS = [
  'Fresh setiap hari',
  'Dipanggang di atas bara',
  'Olesan buatan sendiri',
  'Tanpa pengawet',
  'Karanganyar',
  'Sejak 2012',
];

/** Pita berjalan sebagai pemisah antar section. */
export function Marquee({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative flex overflow-hidden border-y border-white/[0.06] bg-ink/60 py-4',
        className,
      )}
    >
      <div className="flex w-max animate-marquee will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {ITEMS.map((item) => (
              <span key={`${copy}-${item}`} className="flex items-center">
                <span className="px-7 text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/35">
                  {item}
                </span>
                <span className="h-1 w-1 rounded-full bg-cheese/50" />
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}
