'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { RubiksCubeFallback } from './RubiksCubeFallback';

// Lazy-load Canvas with ssr: false
const RubiksCubeCanvas = dynamic(() => import('./RubiksCubeCanvas'), {
  ssr: false,
  loading: () => <RubiksCubeFallback />,
});

export const RubiksCube: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [cubeState, setCubeState] = useState<'scrambled' | 'solving' | 'solved' | 'scrambling'>('scrambled');

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Detect WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }

    // 2. Detect touch capability
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);

    // 3. Detect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);

    // 4. Check for ?cubeTest=1 in URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('cubeTest') === '1') {
        setIsTestMode(true);
      }
    }

    return () => {
      motionQuery.removeEventListener('change', motionHandler);
    };
  }, []);

  // Keyboard navigation: Enter or Space triggers solve / scramble toggle
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsHovered((prev) => !prev);
    }
  };

  // Touch tap toggle
  const handleTouchTap = () => {
    if (isTouchDevice) {
      setIsHovered((prev) => !prev);
    }
  };

  // If WebGL is confirmed disabled, return SVG fallback
  if (hasWebGL === false) {
    return (
      <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[480px] flex flex-col items-center justify-center select-none">
        <RubiksCubeFallback />
        <p className="mt-2 text-xs font-mono text-grey">
          {isTouchDevice ? 'Tap to solve' : 'Hover to solve'}
        </p>
      </div>
    );
  }

  const hintText = isTouchDevice
    ? cubeState === 'solved'
      ? 'Tap to scramble'
      : 'Tap to solve'
    : cubeState === 'solved'
    ? 'Solved'
    : cubeState === 'solving'
    ? 'Solving...'
    : 'Hover to solve';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Interactive Frameless 3D Cube Wrapper */}
      <div
        ref={wrapperRef}
        role="button"
        tabIndex={0}
        aria-label="Solve the Rubik's cube"
        onClick={handleTouchTap}
        onKeyDown={handleKeyDown}
        className="relative w-full h-[340px] sm:h-[420px] lg:h-[460px] xl:h-[500px] cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-blue transition-shadow select-none"
      >
        <RubiksCubeCanvas
          isHovered={isHovered}
          onHoverChange={(hovered) => !isTouchDevice && setIsHovered(hovered)}
          onStateChange={setCubeState}
          prefersReducedMotion={prefersReducedMotion}
          isTestMode={isTestMode}
        />
      </div>

      {/* Sentence-case subtle grey hint */}
      <p className="mt-1 text-xs text-grey font-body select-none transition-opacity">
        {hintText}
      </p>

      {/* Dev Mode Verification Badge & Trigger (?cubeTest=1) */}
      {isTestMode && (
        <div className="mt-2 flex items-center gap-2">
          <div className="px-3 py-1 bg-ink text-paper font-mono text-[11px] border border-ink">
            DEV TEST: 50 cycles verification active (?cubeTest=1)
          </div>
        </div>
      )}
    </div>
  );
};

export default RubiksCube;
