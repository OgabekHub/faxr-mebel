import { useEffect } from 'react';

/**
 * Freezes the page behind an open overlay on touch devices.
 *
 * Without this the page keeps scrolling under every modal and the navbar drawer.
 * `position: fixed` rather than `overflow: hidden` because iOS Safari ignores the
 * latter on <body>; the scroll offset is restored on close. Coarse pointers only,
 * so the desktop scrollbar never disappears and nothing shifts sideways.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked || !window.matchMedia('(pointer: coarse)').matches) return;

    const y = window.scrollY;
    const style = document.body.style;
    const previous = { position: style.position, top: style.top, width: style.width, overflow: style.overflow };

    Object.assign(style, { position: 'fixed', top: `-${y}px`, width: '100%', overflow: 'hidden' });

    return () => {
      Object.assign(style, previous);
      window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
    };
  }, [locked]);
}
