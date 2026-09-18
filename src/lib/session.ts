import { readString, writeString, removeKey } from './storage';

const KEY = 'session';

/**
 * Remembers that this browser had a Firebase session, so AuthContext loads the
 * auth SDK on boot for returning signed-in users (and anonymous visitors who
 * sent a request). Everyone else never downloads it unless a page needs it.
 *
 * Only a hint: Firebase stays the source of truth and rewrites this on every
 * auth state change.
 */
export function hasSessionHint(): boolean {
  return readString(KEY) === '1';
}

export function markSessionHint(): void {
  writeString(KEY, '1');
}

export function clearSessionHint(): void {
  removeKey(KEY);
}
