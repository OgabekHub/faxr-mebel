import type { Timestamp } from 'firebase/firestore';

/* ------------------------------------------------------------------ */
/* Portfolio — completed work shown as inspiration, never sold          */
/* ------------------------------------------------------------------ */

export const PORTFOLIO_CATEGORY_IDS = ['soft', 'kitchen', 'bedroom', 'living'] as const;
export type PortfolioCategoryId = (typeof PORTFOLIO_CATEGORY_IDS)[number];

export interface PortfolioImage {
  src: string;
  width: number;
  height: number;
}

export interface PortfolioItem {
  /** Stable slug: the i18n key segment, the AR route param and the future Firestore doc id. */
  id: string;
  category: PortfolioCategoryId;
  /** `[0]` is the cover. Always an array, even when a piece has one photo today. */
  images: PortfolioImage[];
  /** Only set where a real .glb exists; absent means no AR button. */
  model?: string;
  /** Lower first. Firestore docs will carry the same field so ordering survives the move. */
  order?: number;
}

/* ------------------------------------------------------------------ */
/* Requests — a visitor asks for a home-measurement visit               */
/* ------------------------------------------------------------------ */

/** One-way build pipeline; Profile renders it as a timeline, Admin advances it. */
export const REQUEST_STATUS_FLOW = ['new', 'measured', 'production', 'quality', 'installed'] as const;
export type RequestStatus = (typeof REQUEST_STATUS_FLOW)[number];

export const REQUEST_TIME_WINDOWS = ['morning', 'afternoon', 'evening'] as const;
export type RequestTimeWindow = (typeof REQUEST_TIME_WINDOWS)[number];

/** Shape of a `requests/{id}` document; mirrored by `requestOk()` in firestore.rules. */
export interface FurnitureRequest {
  id: string;
  /** Firebase uid — anonymous accounts included, so a lead never needs a login. */
  userId: string;
  client: string;
  /** Canonical `+998XXXXXXXXX` from normalizeUzPhone(). */
  phone: string;
  category: PortfolioCategoryId;
  /** The portfolio piece the visitor was looking at, if any. */
  sourceItemId: string | null;
  /** `YYYY-MM-DD`, or '' when the visitor left it to the manager. */
  preferredDate: string;
  preferredTime: RequestTimeWindow;
  area: string;
  note: string;
  status: RequestStatus;
  /** UI language at submit time, so staff call back in the right one. */
  lang: string;
  /** ISO string written by the client; kept for the same client-side sort Profile uses today. */
  date: string;
  createdAt?: Timestamp | null;
}
