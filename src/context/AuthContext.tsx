import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import { hasSessionHint, markSessionHint, clearSessionHint } from '../lib/session';

interface AuthContextType {
  /** Signed-in Firebase user, or null. */
  user: User | null;
  /** True until Firebase has reported the auth state. Only meaningful once `ensureAuth()` has run. */
  loading: boolean;
  /** True for the invisible account a visitor gets when they send a request without signing in. */
  isAnonymous: boolean;
  /** True when `admins/{uid}` exists for the signed-in user (see firestore.rules). */
  isAdmin: boolean;
  /** True while the admin flag for the *current* user is still unknown. */
  adminLoading: boolean;
  /**
   * Loads the Firebase auth SDK and starts the session listener; resolves after the
   * first auth state report. Idempotent. Pages and actions that need an identity call
   * it, so a visitor who only browses never downloads the SDK.
   */
  ensureAuth: () => Promise<void>;
}

/** The admin lookup result, tagged with the uid it belongs to. */
interface AdminCheck {
  uid: string;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Single auth subscription for the whole app, started lazily.
 *
 * Starting it on mount cost every visitor ~160 KB of gzipped Firebase on the first
 * page view, to learn that almost nobody browsing a portfolio is signed in.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminCheck, setAdminCheck] = useState<AdminCheck | null>(null);

  const startRef = useRef<Promise<void> | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  // Bumped on unmount so a load that finishes afterwards (StrictMode's double mount) attaches nothing.
  const generationRef = useRef(0);

  const ensureAuth = useCallback((): Promise<void> => {
    if (startRef.current) return startRef.current;
    const generation = generationRef.current;

    startRef.current = new Promise<void>((resolve) => {
      Promise.all([import('../lib/firebaseAuth'), import('firebase/auth')])
        .then(([{ auth }, { onAuthStateChanged }]) => {
          if (generation !== generationRef.current) return resolve();
          unsubscribeRef.current = onAuthStateChanged(auth, (nextUser) => {
            setUser(nextUser);
            setLoading(false);
            if (nextUser) markSessionHint();
            else clearSessionHint();
            resolve();
          });
        })
        .catch((error: unknown) => {
          // A flaky network must not leave ProtectedRoute spinning forever; allow a retry later.
          console.warn('Could not load Firebase auth:', error);
          startRef.current = null;
          setLoading(false);
          resolve();
        });
    });
    return startRef.current;
  }, []);

  useEffect(() => {
    // Returning signed-in users (or visitors who sent a request) get their session straight away.
    if (hasSessionHint()) void ensureAuth();
    return () => {
      generationRef.current += 1;
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
      startRef.current = null;
    };
  }, [ensureAuth]);

  const uid = user?.uid ?? null;

  useEffect(() => {
    if (!uid) return;

    let cancelled = false; // ignore a stale response after the user changed
    void Promise.all([import('../lib/firebaseDb'), import('firebase/firestore')])
      .then(([{ db }, { doc, getDoc }]) => getDoc(doc(db, 'admins', uid)))
      .then((snapshot) => {
        if (!cancelled) setAdminCheck({ uid, isAdmin: snapshot.exists() });
      })
      .catch((error: unknown) => {
        // Missing rule / offline: treat as non-admin rather than crashing.
        console.warn('Could not read admin flag:', error);
        if (!cancelled) setAdminCheck({ uid, isAdmin: false });
      });

    return () => {
      cancelled = true;
    };
  }, [uid]);

  // Derived from the tagged result, so the very first authenticated render (before the
  // lookup effect has run) and a user switch both report "still loading" instead of a
  // false "not admin" that would bounce a real admin off /admin.
  const adminKnown = uid !== null && adminCheck?.uid === uid;
  const isAdmin = adminKnown && adminCheck!.isAdmin;
  const adminLoading = uid !== null && !adminKnown;
  const isAnonymous = user?.isAnonymous ?? false;

  const value = useMemo<AuthContextType>(
    () => ({ user, loading, isAnonymous, isAdmin, adminLoading, ensureAuth }),
    [user, loading, isAnonymous, isAdmin, adminLoading, ensureAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
