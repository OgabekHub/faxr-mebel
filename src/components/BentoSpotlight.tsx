import React, { useRef } from 'react';

interface BentoSpotlightProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card with a gold glow that follows the cursor (`.bento-spotlight` in index.css).
 * The card itself stays still: a mouse-driven 3D tilt used to rock every icon and
 * line of text inside it as the cursor moved.
 */
export const BentoSpotlight: React.FC<BentoSpotlightProps> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Written straight to the element: a state update per mousemove re-rendered the whole card.
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className={`bento-spotlight ${className}`}>
      <div className="relative z-[15] h-full w-full flex flex-col">
        {children}
      </div>
    </div>
  );
};
