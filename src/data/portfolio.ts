import type { PortfolioItem } from '../types/domain';

/**
 * Completed work shown on /portfolio. Hard-coded for now; the admin panel that
 * manages it comes in a later phase, and `usePortfolio()` is the one seam the
 * pages read through so that move does not touch them.
 *
 * Titles live in the locale files as `portfolio.item.<id>.title`. Every photo in
 * public/images is 1024x1024 today; `images[0]` is the cover.
 */
const photo = (src: string) => ({ src, width: 1024, height: 1024 });

export const portfolioItems: PortfolioItem[] = [
  { id: 'sofa-chesterfield-blue', category: 'soft', images: [photo('/images/sofa_blue.webp')], order: 1 },
  { id: 'sofa-chesterfield-beige', category: 'soft', images: [photo('/images/sofa_beige.webp')], order: 2 },
  { id: 'sofa-classic-brown', category: 'soft', images: [photo('/images/sofa_brown.webp')], order: 3 },
  { id: 'sofa-emerald-velvet', category: 'soft', images: [photo('/images/sofa.webp')], order: 4 },
  { id: 'kitchen-olive-gloss', category: 'kitchen', images: [photo('/images/kitchen_green.webp')], order: 5 },
  { id: 'kitchen-white-oak', category: 'kitchen', images: [photo('/images/kitchen_white_oak.webp')], order: 6 },
  { id: 'kitchen-neoclassic-gold', category: 'kitchen', images: [photo('/images/kitchen_neoclassic.webp')], order: 7 },
  { id: 'kitchen-gloss-black-white', category: 'kitchen', images: [photo('/images/kitchen_glossy_white_black.webp')], order: 8 },
  { id: 'dining-set-marble', category: 'kitchen', images: [photo('/images/dining_table.webp')], order: 9 },
  { id: 'bedroom-gold-black', category: 'bedroom', images: [photo('/images/bedroom_gold_black.webp')], order: 10 },
  { id: 'bedroom-walnut', category: 'bedroom', images: [photo('/images/bed.webp')], order: 11 },
  { id: 'tv-unit-modern-led', category: 'living', images: [photo('/images/tv_gorka_modern.webp')], order: 12 },
  { id: 'tv-unit-royal-classic', category: 'living', images: [photo('/images/tv_gorka_classic.webp')], order: 13 },
];

/**
 * Old Shop product ids → portfolio slugs, matched by photo. Lets wishlist entries
 * saved before the portfolio existed keep pointing at the same piece. Goes away
 * with Shop.tsx.
 */
export const LEGACY_SHOP_IDS: Record<string, string> = {
  '1': 'sofa-chesterfield-blue',
  '2': 'sofa-classic-brown',
  '3': 'bedroom-gold-black',
  '4': 'sofa-chesterfield-beige',
  '5': 'tv-unit-modern-led',
  '6': 'tv-unit-royal-classic',
  '7': 'kitchen-olive-gloss',
  '8': 'kitchen-white-oak',
  '9': 'kitchen-neoclassic-gold',
  '10': 'kitchen-gloss-black-white',
};
