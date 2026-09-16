import { cn } from '../lib/utils';

interface BrandLogoProps {
  /** Sets the font size the lockup scales from (mark 1.45em, wordmark 0.8em). */
  className?: string;
  /** Extra classes for the mark image, e.g. hover transforms. */
  markClassName?: string;
  /** `auto` darkens the gold in the light theme for contrast; `gold` keeps it bright on always-dark surfaces. */
  tone?: 'auto' | 'gold';
}

// Logo mark + the designer's "Faxr Mebel" wordmark, both cut from public/images/logo.png
// and flattened to the brand gold. em-based sizes keep the proportions at every placement.
export const BrandLogo = ({ className, markClassName, tone = 'auto' }: BrandLogoProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-[0.5em] leading-none whitespace-nowrap',
      tone === 'auto' && 'brightness-[.7] dark:brightness-100',
      className,
    )}
  >
    <img
      src="/images/logo-mark.png"
      alt=""
      aria-hidden="true"
      width={114}
      height={128}
      draggable={false}
      className={cn('h-[1.45em] w-auto select-none', markClassName)}
    />
    <img
      src="/images/logo-wordmark.png"
      alt="Faxr Mebel"
      width={419}
      height={72}
      draggable={false}
      className="h-[0.8em] w-auto select-none"
    />
  </span>
);
