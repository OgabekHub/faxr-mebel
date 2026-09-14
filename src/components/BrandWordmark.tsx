import { cn } from '../lib/utils';

interface BrandWordmarkProps {
  /** Size (text-*) and base color; the MEBEL line scales from this font size. */
  className?: string;
  /** Color classes for the FAXR line. */
  accentClassName?: string;
  align?: 'start' | 'center';
}

// Two-line "FAXR / MEBEL" wordmark. Negative right margins cancel the trailing
// letter-spacing so both lines centre on their visible glyphs.
export const BrandWordmark = ({ className, accentClassName = 'text-brand-gold', align = 'start' }: BrandWordmarkProps) => (
  <span
    className={cn(
      'inline-grid gap-[0.2em] leading-none whitespace-nowrap',
      align === 'center' ? 'justify-items-center' : 'justify-items-start',
      className,
    )}
  >
    <span className={cn('font-brand font-bold tracking-[0.14em] mr-[-0.14em]', accentClassName)}>FAXR</span>
    <span className="font-sans font-semibold text-[0.425em] tracking-[0.62em] mr-[-0.62em]">MEBEL</span>
  </span>
);
