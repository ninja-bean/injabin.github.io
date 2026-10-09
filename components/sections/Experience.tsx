'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { experiences } from '@/content';
import { useAppStore } from '@/lib/store';
import { InView } from '@/components/ui/InView';

const ExperienceSlabsCanvas = dynamic(
  () => import('@/components/scene/ExperienceSlabsCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[260px] sm:h-[300px] lg:h-[340px] mb-10 border-2 border-ink bg-paper/40 flex items-center justify-center font-mono text-xs text-grey">
        Loading 3D Experience Slabs...
      </div>
    ),
  }
);

export const Experience: React.FC = () => {
  const { hoveredExperience, setHoveredExperience } = useAppStore();

  return (
    <section id="experience" className="py-20 border-b-4 border-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-3 h-3 bg-red border border-ink" />
              <span className="font-mono text-xs text-grey uppercase tracking-widest">
                Section 06 // Career &amp; Roles
              </span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-ink uppercase tracking-tight">
              Experience &amp; Timeline
            </h2>
          </div>
          <p className="font-mono text-xs text-grey">
            CHRONOLOGICAL INDUSTRY &amp; RESEARCH TRACK
          </p>
        </div>

        {/* 3D Isometric Duration Slabs Canvas */}
        <InView
          fallback={
            <div className="w-full h-[260px] sm:h-[300px] lg:h-[340px] mb-10 border-2 border-ink bg-paper/40 flex items-center justify-center font-mono text-xs text-grey">
              Loading 3D Experience Slabs...
            </div>
          }
        >
          <ExperienceSlabsCanvas />
        </InView>

        {/* Timeline Stack Slabs */}
        <div className="space-y-6">
          {experiences.map((exp, idx) => {
            const isHovered = hoveredExperience === exp.id;

            return (
              <div
                key={exp.id}
                tabIndex={0}
                onMouseEnter={() => setHoveredExperience(exp.id)}
                onMouseLeave={() => setHoveredExperience(null)}
                onFocus={() => setHoveredExperience(exp.id)}
                onBlur={() => setHoveredExperience(null)}
                className={`border-2 p-6 sm:p-8 bg-paper flex flex-col md:flex-row md:items-start justify-between gap-6 transition-all duration-150 ease-mechanical group outline-none ${
                  isHovered
                    ? 'border-blue ring-2 ring-blue/30 -translate-y-1 shadow-sm'
                    : 'border-ink hover:border-blue'
                }`}
              >
                {/* Left Column: Organization & Period */}
                <div className="md:w-1/3 space-y-1">
                  <span className="font-mono text-xs text-grey uppercase tracking-wider block">
                    0{idx + 1} {'//'} {exp.period}
                  </span>
                  <h3 className={`font-display font-black text-2xl uppercase tracking-tight transition-colors ${
                    isHovered ? 'text-blue' : 'text-ink group-hover:text-blue'
                  }`}>
                    {exp.role}
                  </h3>
                  <p className="font-body text-base font-bold text-ink/90">
                    {exp.organization}
                  </p>
                </div>

                {/* Right Column: Description & Tags */}
                <div className="md:w-2/3 space-y-4">
                  <p className="font-body text-base text-ink/85 leading-relaxed font-medium">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs uppercase bg-ink/5 border border-ink/20 px-2.5 py-1 text-ink"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
