import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div className={cn('relative', centered && 'text-center', className)}>
      <Reveal>
        <div className={cn('flex items-center gap-4', centered && 'justify-center')}>
          <span className="font-body text-[11px] tabular-nums tracking-[0.28em] text-cheese/45">
            {index}
          </span>
          <span className="h-px w-10 bg-cheese/30" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <h2 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-cream sm:text-5xl lg:text-6xl">
          {title}
        </h2>
      </Reveal>

      {description && (
        <Reveal delay={0.16}>
          <p
            className={cn(
              'mt-6 max-w-xl text-[15px] leading-relaxed text-cream-dim/80',
              centered && 'mx-auto',
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
