import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readJson, writeJson } from '../lib/storage';
import { LEGACY_SHOP_IDS } from '../data/portfolio';

/**
 * A saved favourite is just a reference. Everything shown for it (cover, title,
 * category) is looked up from the portfolio at render time, so a saved entry is
 * never stale and never frozen in whichever language was active when it was
 * tapped — which is what happened when the old shop stored translated strings.
 */
export interface WishlistItem {
  id: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  totalWishlistItems: number;
}

const STORAGE_KEY = 'wishlist';

/**
 * Accepts the current `{id}` shape, bare id strings, and the old shop's
 * `{id,name,price,image,category}` entries (mapping their numeric ids onto
 * portfolio slugs). Dropping a shape here would silently empty a visitor's
 * saved list on their next visit.
 */
function parseWishlist(raw: unknown): WishlistItem[] | null {
  if (!Array.isArray(raw)) return null;
  const seen = new Set<string>();
  const items: WishlistItem[] = [];
  for (const entry of raw) {
    const rawId =
      typeof entry === 'string'
        ? entry
        : typeof entry === 'object' && entry !== null
          ? (entry as Record<string, unknown>).id
          : undefined;
    if (typeof rawId !== 'string' || rawId === '') continue;
    const id = LEGACY_SHOP_IDS[rawId] ?? rawId;
    if (seen.has(id)) continue;
    seen.add(id);
    items.push({ id });
  }
  return items;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => readJson(STORAGE_KEY, parseWishlist, []));

  useEffect(() => {
    writeJson(STORAGE_KEY, wishlist);
  }, [wishlist]);

  const addToWishlist = useCallback((item: WishlistItem) => {
    setWishlist(prev => (prev.some(i => i.id === item.id) ? prev : [...prev, { id: item.id }]));
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  }, []);

  // Functional updater: safe even when toggled twice before a re-render.
  const toggleWishlist = useCallback((item: WishlistItem) => {
    setWishlist(prev => (prev.some(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, { id: item.id }]));
  }, []);

  const isInWishlist = useCallback((id: string) => wishlist.some(item => item.id === id), [wishlist]);

  const clearWishlist = useCallback(() => setWishlist([]), []);

  const value = useMemo<WishlistContextType>(
    () => ({
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
      totalWishlistItems: wishlist.length,
    }),
    [wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
