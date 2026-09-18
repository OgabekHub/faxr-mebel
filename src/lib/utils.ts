import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Browsers ship no Uzbek month names (Intl renders "M10"), so those are spelled out here.
const UZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];

/** `2026-10-05` → "5-oktabr" / "5 октября" / "5 October", by UI language. */
export function formatDayLabel(isoDay: string, lang: string): string {
  const [year, month, day] = isoDay.split('-').map(Number);
  if (!year || !month || !day) return isoDay;
  if (lang.startsWith('ru') || lang.startsWith('en')) {
    return new Date(year, month - 1, day).toLocaleDateString(lang.startsWith('ru') ? 'ru-RU' : 'en-GB', { day: 'numeric', month: 'long' });
  }
  return `${day}-${UZ_MONTHS[month - 1]}`;
}

/** An ISO timestamp as "18-sentabr, 23:52" (local time), by UI language. */
export function formatDateTimeLabel(iso: string, lang: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${formatDayLabel(day, lang)}, ${time}`;
}

/** `REQ-YYYYMMDD-####`: readable on a phone screen and in the ops chat, and passes firestore.rules' isValidId(). */
export function generateRequestId(): string {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `REQ-${ymd}-${suffix}`;
}

/**
 * Rejects after `ms` if the promise has not settled. Firestore writes neither
 * resolve nor reject while a phone is offline, so a plain `await` can hang a
 * submit button forever.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number, label = 'timeout'): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(label)), ms);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (error: unknown) => { clearTimeout(timer); reject(error); },
    );
  });
}

/** Human-readable message from an unknown thrown value. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return '';
}

/** The `code` property of Firebase-style errors, if present (e.g. "auth/wrong-password"). */
export function getErrorCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : undefined;
  }
  return undefined;
}
