import { cn } from '../lib/utils';

interface BrandLogoProps {
  /** Size (text-*) and wordmark color; the gold mark scales with the font size. */
  className?: string;
  /** Extra classes for the mark image, e.g. hover transforms. */
  markClassName?: string;
}

// Gold logo mark + single-line "FAXR MEBEL" wordmark in one neutral color.
// Mark height (1.45em) and gap (0.55em) keep the lockup proportions at every size.
export const BrandLogo = ({ className, markClassName }: BrandLogoProps) => (
  <span className={cn('inline-flex items-center gap-[0.55em] leading-none whitespace-nowrap', className)}>
    <img
      src="/images/logo-mark.png"
      alt=""
      aria-hidden="true"
      width={106}
      height={128}
      draggable={false}
      className={cn('h-[1.45em] w-auto select-none', markClassName)}
    />
    <span className="font-brand font-semibold uppercase tracking-[0.01em]">Faxr Mebel</span>
  </span>
);
