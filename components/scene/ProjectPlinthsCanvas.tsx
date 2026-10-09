'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { projects } from '@/content';
import { PlinthItem, SpotlightSystem, CATEGORY_COLORS } from './ProjectPlinths';
import { useAppStore } from '@/lib/store';
import { ProjectPlinthsFallback } from './ProjectPlinthsFallback';

// Check WebGL availability
function isWebGLAvailable() {
  if (typeof window === 'undefined') return true;
  if (window.location.search.includes('noWebgl=1')) return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

// Isometric Camera Rig anchored on the active project with subtle parallax
interface CameraRigProps {
  isMobile: boolean;
  prefersReduced: boolean;
}

const CameraRig: React.FC<CameraRigProps> = ({ isMobile, prefersReduced }) => {
  useFrame(({ camera, pointer }) => {
    // Stage center-right offset: looking at (0.35, 0.45, 0)
    // Centers the active project at ~70% stage height in center-right
    const lookTargetX = isMobile ? 0 : 0.35;
    const lookTargetY = 0.36;

    if (prefersReduced) {
      camera.position.set(12, 10, 12);
      camera.lookAt(lookTargetX, lookTargetY, 0);
      return;
    }

    const targetCamX = 12 + pointer.x * 0.4;
    const targetCamY = 10 + pointer.y * 0.22;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 4, 0.016);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 4, 0.016);
    camera.lookAt(lookTargetX, lookTargetY, 0);
  });

  return null;
};

export const ProjectPlinthsCanvas: React.FC = () => {
  const theme = useAppStore((s) => s.theme);
  const setSelectedProjectSlug = useAppStore((s) => s.setSelectedProjectSlug);

  // Autoplay State Machine: 5.5s dwell, 1.4s transition
  const [activeIndex, setActiveIndex] = useState(0);
  const [dwellProgress, setDwellProgress] = useState(0); // 0 to 1
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0); // 0 to 1
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(true);
  const [webglSupported, setWebglSupported] = useState(true);
  const [prefersReduced, setPrefersReduced] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const currentProject = projects[activeIndex] || projects[0];
  const categoryColor = CATEGORY_COLORS[currentProject.category] || '#0033A0';

  // Responsive & Motion Checks
  useEffect(() => {
    setWebglSupported(isWebGLAvailable());

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);
    const handleMotion = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handleMotion);

    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', handleMotion);
    };
  }, []);

  // IntersectionObserver: Only autoplay if >= 50% in view
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting && entry.intersectionRatio >= 0.45);
      },
      { threshold: [0, 0.45, 0.5, 1.0] }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Page visibility listener
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Smooth switch to project
  const focusProject = useCallback(
    (targetIdx: number) => {
      if (targetIdx === activeIndex && !isTransitioning) return;

      if (prefersReduced) {
        setActiveIndex((targetIdx + projects.length) % projects.length);
        setDwellProgress(0);
        setIsTransitioning(false);
        return;
      }

      setIsTransitioning(true);
      setTransitionProgress(0);

      const startTime = performance.now();
      const transitionDuration = 1400; // 1.4s

      const animateTransition = (now: number) => {
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / transitionDuration);
        // Cubic bezier ease (0.7, 0, 0.2, 1) approximation
        const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        setTransitionProgress(ease);

        if (p < 1) {
          requestAnimationFrame(animateTransition);
        } else {
          setActiveIndex((targetIdx + projects.length) % projects.length);
          setIsTransitioning(false);
          setTransitionProgress(0);
          setDwellProgress(0);
        }
      };

      requestAnimationFrame(animateTransition);
    },
    [activeIndex, isTransitioning, prefersReduced]
  );

  // Main Autoplay Timer (5.5s dwell)
  useEffect(() => {
    if (prefersReduced || isPaused || isTransitioning || !isSectionVisible) {
      return;
    }

    const dwellDuration = 10000; // 10s dwell for auto-changing
    const startTime = performance.now() - dwellProgress * dwellDuration;
    let animFrame: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / dwellDuration);
      setDwellProgress(progress);

      if (progress >= 1) {
        // Dwell finished, transition to next project
        const nextIdx = (activeIndex + 1) % projects.length;
        focusProject(nextIdx);
      } else {
        animFrame = requestAnimationFrame(tick);
      }
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [activeIndex, isPaused, isTransitioning, isSectionVisible, prefersReduced, focusProject, dwellProgress]);

  // Pause / Resume on interaction
  const handleMouseEnter = () => {
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 1000); // Resume 1s after leaving
  };

  // Keyboard navigation: Left/Right arrows, Enter to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInside = containerRef.current?.contains(activeEl);
      if (!isInside) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        focusProject((activeIndex + 1) % projects.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusProject((activeIndex - 1 + projects.length) % projects.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        setSelectedProjectSlug(currentProject.slug);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, currentProject.slug, focusProject, setSelectedProjectSlug]);

  // Touch Swipe on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    handleMouseEnter();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null) {
      const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
      if (diffX > 45) {
        // Swipe Right -> previous project
        focusProject((activeIndex - 1 + projects.length) % projects.length);
      } else if (diffX < -45) {
        // Swipe Left -> next project
        focusProject((activeIndex + 1) % projects.length);
      }
    }
    touchStartXRef.current = null;
    handleMouseLeave();
  };

  // Header category badge color
  const categoryBadgeClass = useMemo(() => {
    if (currentProject.category === 'hardware') return 'bg-red text-white';
    if (currentProject.category === 'ai') return 'bg-yellow text-ink';
    return 'bg-blue text-white';
  }, [currentProject.category]);

  if (!webglSupported) {
    return (
      <ProjectPlinthsFallback
        projects={projects}
        activeIndex={activeIndex}
        onSelectIndex={(idx) => focusProject(idx)}
        onOpenProject={(slug) => setSelectedProjectSlug(slug)}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="border-2 border-ink bg-paper mb-8 select-none overflow-hidden relative group"
    >
      {/* 1. TOP HEADER STRIP (Preserved Approved Frame) */}
      <div className="border-b-2 border-ink bg-paper px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 z-10">
        {/* Left: Section Registration */}
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-blue border border-ink" />
          <span className="font-mono text-[10px] sm:text-xs text-ink font-bold uppercase tracking-wider">
            STAGE // 3D METAPHOR VAULT
          </span>
        </div>

        {/* Center: Live Project in Spotlight Badge (Synchronous Cross-fade) */}
        <div className="flex items-center space-x-2">
          <span className="font-mono text-[10px] sm:text-xs text-grey uppercase tracking-wider">
            ACTIVE SPOTLIGHT:
          </span>
          <span
            className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-ink transition-colors duration-200 ${categoryBadgeClass}`}
          >
            {currentProject.title}
          </span>
          <span className="font-mono text-[10px] text-grey uppercase hidden sm:inline">
            {'//'} {currentProject.category}
          </span>
        </div>

        {/* Right: Updated Interaction Hint Text */}
        <div className="font-mono text-[10px] text-grey uppercase hidden md:inline">
          AUTOPLAY // HOVER TO PAUSE // CLICK TO OPEN
        </div>
      </div>

      {/* 2. 3D CANVAS VIEWPORT (Exact same height as Skills section: 280px / 320px / 360px) */}
      <div className="relative w-full h-[280px] sm:h-[320px] lg:h-[360px] bg-paper/40 dark:bg-ink/40">
        <Canvas
          aria-hidden="true"
          shadows="basic"
          orthographic
          camera={{
            position: [12, 10, 12],
            zoom: isMobile ? 54 : 70,
            near: -40,
            far: 100,
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          className="w-full h-full cursor-pointer"
        >
          <CameraRig isMobile={isMobile} prefersReduced={prefersReduced} />

          {/* Clean Flat Lighting */}
          <ambientLight intensity={0.85} />
          <directionalLight
            position={[14, 22, 12]}
            intensity={1.1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0005}
          />

          {/* Hard-Edged Flat Spotlight System (Ground Pool + Trapezoid Beam) */}
          <SpotlightSystem
            categoryColor={categoryColor}
            theme={theme}
            isTransitioning={isTransitioning}
            transitionProgress={transitionProgress}
          />

          {/* All 6 Plinths in Row */}
          {projects.map((proj, idx) => (
            <PlinthItem
              key={proj.slug}
              project={proj}
              index={idx}
              activeIndex={activeIndex}
              _transitionProgress={transitionProgress}
              dwellProgress={dwellProgress}
              theme={theme}
              onSelect={(slug) => setSelectedProjectSlug(slug)}
              isMobile={isMobile}
            />
          ))}

          {/* Ground Floor Shadow Plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.17, 0]} receiveShadow>
            <planeGeometry args={[80, 40]} />
            <shadowMaterial opacity={theme === 'dark' ? 0.38 : 0.22} color={theme === 'dark' ? '#141416' : '#000000'} />
          </mesh>
        </Canvas>
      </div>

      {/* 3. FOOTER STRIP (6 Index Tabs with 4px Top Rule & Dwell Progress Bar) */}
      <div
        role="tablist"
        aria-label="Project stage index tabs"
        className="border-t-2 border-ink bg-paper flex items-stretch divide-x-2 divide-ink overflow-x-auto select-none no-scrollbar"
      >
        {projects.map((proj, idx) => {
          const isActive = idx === activeIndex;
          const tabCatColor = CATEGORY_COLORS[proj.category] || '#0033A0';

          return (
            <button
              key={proj.slug}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              onClick={() => focusProject(idx)}
              onFocus={() => {
                handleMouseEnter();
                focusProject(idx);
              }}
              onBlur={handleMouseLeave}
              className={`flex-1 min-w-[130px] sm:min-w-[150px] px-3 py-2.5 flex flex-col justify-between text-left relative transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue ${
                isActive ? 'bg-paper font-bold' : 'bg-paper/70 hover:bg-paper/90 opacity-75 hover:opacity-100'
              }`}
            >
              {/* Active Tab 4px Top Rule in its Category Color */}
              {isActive && (
                <div
                  className="absolute top-0 left-0 right-0 h-[4px] z-10 transition-colors"
                  style={{ backgroundColor: tabCatColor }}
                />
              )}

              {/* Thin Dwell Progress Bar (Fills during 5.5s dwell) */}
              {isActive && !isTransitioning && !prefersReduced && (
                <div
                  className="absolute top-[4px] left-0 h-[2px] z-10 transition-[width] duration-75 ease-linear"
                  style={{
                    backgroundColor: tabCatColor,
                    width: `${Math.min(100, Math.max(0, dwellProgress * 100))}%`,
                  }}
                />
              )}

              {/* Tab Header: 01 to 06 and Category Color Bullet */}
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-grey font-bold">
                  0{idx + 1}
                </span>
                <span
                  className="w-2 h-2 border border-ink"
                  style={{ backgroundColor: tabCatColor }}
                />
              </div>

              {/* Tab Short Title */}
              <div className="font-mono text-xs text-ink uppercase font-bold tracking-tight truncate">
                {proj.title}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectPlinthsCanvas;
