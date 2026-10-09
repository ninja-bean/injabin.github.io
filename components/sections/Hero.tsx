'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { siteConfig } from '@/content';

// Lazy-load Rubik's cube so server render is instant and LCP unaffected
const RubiksCube = dynamic(() => import('@/components/scene/RubiksCube'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[340px] flex items-center justify-center font-body text-xs text-grey" />
  ),
});

export const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex flex-col justify-between pt-10 pb-16 overflow-hidden border-b-4 border-ink"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Hero Composition: Name on Left (~55%), Frameless Rubik's Cube on Right (~45%) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12 mb-10">
          {/* Left: Giant Name (Real HTML text) */}
          <div className="w-full lg:w-[55%] relative overflow-visible select-none">
            <h1 className="font-display font-black text-6xl sm:text-8xl md:text-9xl lg:text-[8.5rem] xl:text-[10.5rem] tracking-tighter leading-[0.82] text-ink uppercase -ml-1 sm:-ml-2">
              INJABIN
              <br />
              ALAM
            </h1>
          </div>

          {/* Right: Frameless 3D Rubik's Cube sitting directly on the page background */}
          <div className="w-full lg:w-[45%] flex items-center justify-center">
            <div className="w-[80vw] max-w-[360px] lg:max-w-none lg:w-full h-[360px] sm:h-[420px] lg:h-[480px] xl:h-[520px]">
              <RubiksCube />
            </div>
          </div>
        </div>

        {/* Heavy 8px Rule */}
        <div className="w-full h-2 bg-ink mb-8" />

        {/* 12-Column Grid Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <p className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-ink leading-snug tracking-tight mb-4">
              {siteConfig.headline}
            </p>
            <p className="font-body text-base sm:text-lg text-ink/85 max-w-2xl leading-relaxed">
              {siteConfig.subline}
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between h-full border-t-2 lg:border-t-0 lg:border-l-2 border-ink pt-6 lg:pt-0 lg:pl-8 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs text-grey uppercase tracking-widest block">
                Primary Coordinates
              </span>
              <p className="font-mono text-sm text-ink">
                LOCATION: Dhaka, Bangladesh
              </p>
              <p className="font-mono text-sm text-ink">
                AFFILIATION: United International University
              </p>
              <p className="font-mono text-sm text-ink">
                AVAILABILITY: Internships &amp; Junior Roles
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <a
                href="#projects"
                className="px-5 py-3 bg-ink text-paper font-display font-bold text-sm uppercase tracking-wider border-2 border-ink hover:bg-blue hover:text-white transition-colors duration-150 ease-mechanical"
              >
                View Projects &darr;
              </a>
              <a
                href="#contact"
                className="px-5 py-3 bg-paper text-ink font-display font-bold text-sm uppercase tracking-wider border-2 border-ink hover:bg-red hover:text-white transition-colors duration-150 ease-mechanical"
              >
                Contact &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Status Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12 pt-4 border-t border-ink/20 flex flex-wrap items-center justify-between text-xs font-mono text-grey gap-2">
        <span>01 / 07 // HERO SECTION</span>
        <span>BAUHAUS PRINCIPLE: FORM FOLLOWS FUNCTION</span>
      </div>
    </section>
  );
};
