'use client';

import React, { useEffect, useRef, useState } from 'react';

interface InViewProps {
  children: React.ReactNode;
  /** Fallback shown until the container approaches the viewport. */
  fallback?: React.ReactNode;
  className?: string;
  /** How far before entering the viewport to begin mounting. */
  rootMargin?: string;
}

/**
 * Defers mounting of expensive children (3D canvases) until the container
 * nears the viewport. Once mounted, children are never unmounted so
 * animations/scene state are preserved for the rest of the session.
 */
export const InView: React.FC<InViewProps> = ({
  children,
  fallback = null,
  className,
  rootMargin = '600px 0px',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return (
    <div ref={ref} className={className}>
      {visible ? children : fallback}
    </div>
  );
};

export default InView;
