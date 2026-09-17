import type { TFunction } from 'i18next';
import { portfolioItems } from '../data/portfolio';
import type { PortfolioItem } from '../types/domain';

/**
 * The one place pages read portfolio content from. Today it returns the
 * hard-coded list; when the admin panel lands this becomes a Firestore
 * subscription and nothing in Portfolio / Home / Profile changes.
 */
export function usePortfolio(): { items: PortfolioItem[]; loading: boolean } {
  return { items: portfolioItems, loading: false };
}

export function findPortfolioItem(id: string): PortfolioItem | undefined {
  return portfolioItems.find((item) => item.id === id);
}

/** Titles are translated; keep every read behind this so the key scheme can change in one place. */
export function portfolioTitle(id: string, t: TFunction): string {
  return t(`portfolio.item.${id}.title`);
}
