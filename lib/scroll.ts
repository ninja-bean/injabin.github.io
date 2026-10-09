import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore, SectionId } from './store';

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

let lockedScrollY = 0;
let isScrollPaused = false;

export function pauseSmoothScroll(): void {
  if (typeof window === 'undefined') return;
  if (isScrollPaused) return;
  isScrollPaused = true;
  lockedScrollY = window.scrollY || window.pageYOffset || 0;
  if (lenisInstance) {
    lenisInstance.stop();
  }
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
}

export function resumeSmoothScroll(): void {
  if (typeof window === 'undefined') return;
  if (!isScrollPaused) return;
  isScrollPaused = false;
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  window.scrollTo(0, lockedScrollY);
  if (lenisInstance) {
    lenisInstance.start();
    lenisInstance.resize();
  }
}

export function initSmoothScroll(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Check prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    console.log('[Scroll]: prefers-reduced-motion detected. Using native instant scroll.');
    return () => {};
  }

  gsap.registerPlugin(ScrollTrigger);

  // Initialize Lenis
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease-out
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
  });

  lenisInstance = lenis;

  // Sync Lenis scroll with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  // Setup ScrollTrigger for overall page progress
  const doc = document.documentElement;
  const updateProgress = () => {
    const maxScroll = doc.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    useAppStore.getState().setScrollProgress(progress);
  };

  window.addEventListener('scroll', updateProgress, { passive: true });

  // Setup Section Observer to update activeSection in Zustand
  const sectionIds: SectionId[] = ['hero', 'about', 'projects', 'skills', 'honors', 'experience', 'contact'];
  const triggers: ScrollTrigger[] = [];

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 45%',
      end: 'bottom 45%',
      onEnter: () => useAppStore.getState().setActiveSection(id),
      onEnterBack: () => useAppStore.getState().setActiveSection(id),
    });
    triggers.push(st);
  });

  return () => {
    window.removeEventListener('scroll', updateProgress);
    triggers.forEach((st) => st.kill());
    gsap.ticker.remove(tickerCallback);
    lenis.destroy();
    lenisInstance = null;
  };
}

export function scrollToSection(sectionId: string): void {
  const target = document.getElementById(sectionId);
  if (!target) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: -20, duration: 1.2 });
  } else {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}
