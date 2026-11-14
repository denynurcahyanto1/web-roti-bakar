import type { MenuVariant } from '@/lib/menu';
import { hashString, mulberry32 } from '@/lib/utils';

/**
 * Ilustrasi roti bakar Bandung untuk kartu menu — SVG murni, ikut warna
 * variannya. Dua potong roti tebal dengan isian melimpah di tengah dan
 * bekas panggang bergaris, seperti roti bakar yang ditekan di pemanggang.
 *
 * Kalau foto asli sudah ada, ganti komponen ini dengan next/image.
 */
export function ToastThumb({ variant }: { variant: MenuVariant }) {
  const { palette, key } = variant;
  const id = key.replace(/[^a-z0-9]/gi, '');

  // Taburan digambar deterministik supaya server & client identik.
  const rand = mulberry32(hashString(key));
  const crumbs = Array.from({ length: 22 }, (_, index) => ({
    x: 66 + rand() * 188,
    y: 112 + rand() * 24,
    r: 2 + rand() * 2.8,
    tilt: -30 + rand() * 60,
    kind: index % 3,
  }));

  // Serutan isian yang menjuntai keluar dari sisi roti.
  const ooze = Array.from({ length: 10 }, (_, index) => ({
    x: index % 2 === 0 ? 50 + rand() * 12 : 258 + rand() * 12,
    y: 112 + rand() * 22,
    len: 8 + rand() * 10,
    tilt: index % 2 === 0 ? 6 + rand() * 10 : -8 - rand() * 8,
  }));

  return (
    <svg viewBox="0 0 320 250" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`crumb-${id}`} x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor={palette.crumbLight} />
          <stop offset="56%" stopColor={palette.crumb} />
          <stop offset="100%" stopColor={palette.crumbDark} />
        </linearGradient>
        <linearGradient id={`crust-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.crust} />
          <stop offset="100%" stopColor="#7d4b12" />
        </linearGradient>
        <filter id={`blur-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <clipPath id={`top-${id}`}>
          <rect x="58" y="44" width="204" height="70" rx="13" />
        </clipPath>
        <clipPath id={`base-${id}`}>
          <rect x="58" y="136" width="204" height="70" rx="13" />
        </clipPath>
      </defs>

      {/* Glow hangat tipis di belakang roti */}
      <ellipse
        cx="160"
        cy="132"
        rx="96"
        ry="62"
        fill={palette.glow}
        opacity="0.12"
        filter={`url(#blur-${id})`}
      />
      {/* Bayangan kontak */}
      <ellipse cx="160" cy="212" rx="92" ry="9" fill="#000" opacity="0.6" filter={`url(#blur-${id})`} />
      <ellipse cx="160" cy="208" rx="72" ry="4" fill="#000" opacity="0.42" />

      <g transform="rotate(-3 160 128)">
        {/* ---------------------------------------------------------- */}
        {/*  Roti bawah                                               */}
        {/* ---------------------------------------------------------- */}
        <rect
          x="58"
          y="136"
          width="204"
          height="70"
          rx="13"
          fill={`url(#crumb-${id})`}
          stroke={`url(#crust-${id})`}
          strokeWidth="5"
        />
        <g clipPath={`url(#base-${id})`} opacity="0.16">
          {Array.from({ length: 18 }).map((_, index) => (
            <rect key={index} x={62 + index * 11} y="132" width="2.4" height="78" fill={palette.crumbDark} />
          ))}
        </g>

        {/* ---------------------------------------------------------- */}
        {/*  Isian                                                   */}
        {/* ---------------------------------------------------------- */}
        <rect x="60" y="108" width="200" height="32" rx="8" fill={palette.spread} />
        <rect x="66" y="112" width="188" height="4.5" rx="2.2" fill="#fff" opacity="0.18" />

        {ooze.map((strand, index) => (
          <rect
            key={`ooze-${index}`}
            x={strand.x}
            y={strand.y}
            width={strand.len}
            height="2.6"
            rx="1.3"
            fill={variant.toppings[0].color}
            opacity="0.9"
            transform={`rotate(${strand.tilt} ${strand.x} ${strand.y})`}
          />
        ))}

        <g>
          {crumbs.map((crumb, index) => {
            if (crumb.kind === 0) {
              return (
                <rect
                  key={index}
                  x={crumb.x}
                  y={crumb.y}
                  width={crumb.r * 3}
                  height={crumb.r * 0.9}
                  rx={crumb.r * 0.45}
                  fill={variant.toppings[0].color}
                  transform={`rotate(${crumb.tilt} ${crumb.x} ${crumb.y})`}
                  opacity="0.95"
                />
              );
            }
            if (crumb.kind === 1) {
              return (
                <circle
                  key={index}
                  cx={crumb.x}
                  cy={crumb.y}
                  r={crumb.r}
                  fill={variant.toppings[1]?.color ?? variant.toppings[0].color}
                />
              );
            }
            return (
              <ellipse
                key={index}
                cx={crumb.x}
                cy={crumb.y}
                rx={crumb.r * 1.4}
                ry={crumb.r * 0.7}
                fill={variant.toppings[0].color}
                opacity="0.8"
              />
            );
          })}
        </g>

        {/* ---------------------------------------------------------- */}
        {/*  Roti atas                                                */}
        {/* ---------------------------------------------------------- */}
        <rect
          x="58"
          y="44"
          width="204"
          height="70"
          rx="13"
          fill={`url(#crumb-${id})`}
          stroke={`url(#crust-${id})`}
          strokeWidth="5"
        />
        <rect x="68" y="49" width="184" height="6" rx="3" fill="#fff" opacity="0.12" />

        {/* Bekas panggang: garis-garis vertikal tipis */}
        <g clipPath={`url(#top-${id})`} opacity="0.18">
          {Array.from({ length: 18 }).map((_, index) => (
            <rect key={index} x={62 + index * 11} y="40" width="2.4" height="78" fill={palette.crumbDark} />
          ))}
        </g>

        {/* Pori remah */}
        {Array.from({ length: 8 }).map((_, index) => (
          <ellipse
            key={index}
            cx={72 + ((index * 41) % 176)}
            cy={88 + ((index * 13) % 24)}
            rx={1.8 + (index % 3)}
            ry={1.2 + (index % 2)}
            fill={palette.crumbDark}
            opacity="0.3"
          />
        ))}
      </g>
    </svg>
  );
}
