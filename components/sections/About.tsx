'use client';

import React from 'react';
import Image from 'next/image';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 border-b-4 border-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Rotated Section Title (Poster Spine) */}
          <div className="lg:col-span-1 hidden lg:flex flex-col items-center justify-start h-full pt-4">
            <span className="font-display font-black text-4xl text-ink tracking-tight uppercase -rotate-90 origin-top-left translate-y-32 whitespace-nowrap select-none">
              ABOUT // 02
            </span>
          </div>

          {/* Main About Content */}
          <div className="lg:col-span-11 grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Mobile / Tablet Header */}
            <div className="md:col-span-12 lg:hidden mb-2">
              <span className="font-mono text-xs text-grey uppercase tracking-widest block mb-1">
                Section 02 // Profile
              </span>
              <h2 className="font-display font-black text-4xl text-ink uppercase tracking-tight">
                About Injabin Alam
              </h2>
            </div>

            {/* Left Column: Portrait Photo & Metaphor Specs */}
            <div className="md:col-span-5 space-y-6">
              <div className="relative border-4 border-ink bg-paper aspect-square overflow-hidden group">
                <Image
                  src="/avatar.webp"
                  alt="Injabin Alam"
                  fill
                  className="object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300 ease-mechanical"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                {/* Bauhaus Corner Accent */}
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue border-t-2 border-l-2 border-ink" />
              </div>

              {/* Technical Facts Card */}
              <div className="border-2 border-ink p-4 bg-paper space-y-2 font-mono text-xs">
                <div className="flex justify-between border-b border-ink/10 pb-1">
                  <span className="text-grey">SOFTWARE:</span>
                  <span className="font-bold text-ink">Full-Stack &amp; Systems</span>
                </div>
                <div className="flex justify-between border-b border-ink/10 pb-1">
                  <span className="text-grey">HARDWARE:</span>
                  <span className="font-bold text-ink">Embedded IoT &amp; CAD</span>
                </div>
                <div className="flex justify-between border-b border-ink/10 pb-1">
                  <span className="text-grey">ALGORITHMICS:</span>
                  <span className="font-bold text-ink">5★ HackerRank (Java)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-grey">DEGREE:</span>
                  <span className="font-bold text-ink">CSE @ UIU (Dhaka)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Bio Narrative */}
            <div className="md:col-span-7 space-y-6">
              <h2 className="hidden lg:block font-display font-black text-4xl xl:text-5xl text-ink uppercase tracking-tight leading-tight">
                Engineering Systems.
                <br />
                Software &amp; Hardware.
              </h2>

              <p className="font-body text-base sm:text-lg text-ink/90 leading-relaxed font-medium">
                I am a Computer Science &amp; Engineering undergraduate at United International University, Dhaka.
                I build end-to-end software: resilient backend APIs, reactive web interfaces, algorithmic visualizations,
                and relational database systems.
              </p>

              <p className="font-body text-base text-ink/80 leading-relaxed">
                Throughout my journey, I&apos;ve engineered applications across diverse interface paradigms and technical themes—from high-density fintech market dashboards and real-time algorithmic maze simulations to city management portals and IoT telemetry displays. Rather than restricting my work to a single UI style, I tailor the architecture and visual interaction to the specific domain, keeping user clarity, responsive performance, and clean maintainability at the core.
              </p>

              <p className="font-body text-base text-ink/80 leading-relaxed">
                I find genuine passion building across both digital logic and physical hardware. Whether engineering algorithmic pipelines and full-stack cloud workflows or deploying ESP32 microcontrollers for AquaSweep and drafting aerodynamic CAD airframes (Fusion 360) for the UIU CanSat team, I enjoy taking projects from conceptual equations to fully functional physical and software deployments.
              </p>

              {/* Bauhaus Quote Box */}
              <div className="border-l-4 border-red pl-4 py-2.5 bg-ink/5 border-y border-r border-ink/10">
                <p className="font-display font-bold text-sm text-ink tracking-wide">
                  &ldquo;Coding is like building with LEGOs, once you master the basics, the possibilities are infinite.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
