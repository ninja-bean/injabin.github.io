'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { certifications } from '@/content/certifications';
import { InView } from '@/components/ui/InView';

const ResearchTetrahedronCanvas = dynamic(
  () => import('@/components/scene/ResearchTetrahedronCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full sm:w-[260px] h-[220px] sm:h-[260px] border-2 border-ink bg-paper/40 flex items-center justify-center font-mono text-xs text-grey">
        Loading 3D Tetrahedron...
      </div>
    ),
  }
);

export const Research: React.FC = () => {
  return (
    <section id="honors" className="py-20 border-b-4 border-ink relative overflow-hidden bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with 3D Tetrahedron Integration */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8 border-b-2 border-ink pb-8">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-3 h-3 bg-yellow border border-ink" />
              <span className="font-mono text-xs text-grey uppercase tracking-widest">
                Section 05 // Accreditations &amp; Honors
              </span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-ink uppercase tracking-tight mb-3">
              Certifications &amp; Honors
            </h2>
            <p className="font-body text-base text-ink/80 max-w-2xl leading-relaxed">
              Verified professional credentials, university physics olympiad recognition, and formal continuous engineering coursework.
            </p>
            <div className="mt-4 flex items-center space-x-3 font-mono text-xs text-grey">
              <span>HP LIFE E-LEARNING</span>
              <span>&bull;</span>
              <span>UIU PHYSICS OLYMPIAD</span>
              <span>&bull;</span>
              <span>APPLIED ML RESEARCH</span>
            </div>
          </div>

          <InView
            className="shrink-0"
            fallback={
              <div className="w-full sm:w-[260px] h-[220px] sm:h-[260px] border-2 border-ink bg-paper/40 flex items-center justify-center font-mono text-xs text-grey">
                Loading 3D Tetrahedron...
              </div>
            }
          >
            <ResearchTetrahedronCanvas />
          </InView>
        </div>

        {/* 6-Card Bauhaus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((item) => {
            const isRed = item.badgeColor === 'red';
            const isBlue = item.badgeColor === 'blue';
            const isYellow = item.badgeColor === 'yellow';

            return (
              <div
                key={item.id}
                className="border-2 border-ink p-6 bg-paper flex flex-col justify-between hover:-translate-y-1 transition-transform duration-150 ease-mechanical group relative"
              >
                {/* Top Corner Registration Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {isRed && <span className="w-2.5 h-2.5 bg-red border border-ink" />}
                    {isBlue && <span className="w-2.5 h-2.5 bg-blue border border-ink" />}
                    {isYellow && (
                      <span className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[9px] border-b-yellow" />
                    )}
                    <span className="font-mono text-[11px] text-grey uppercase tracking-wider">
                      {item.issuer}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-ink font-bold uppercase tracking-wider px-2 py-0.5 bg-ink/5 border border-ink/20">
                    {item.date}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-display font-black text-xl text-ink uppercase tracking-tight mb-3 group-hover:text-blue transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-ink/80 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Footer Tags & Links */}
                <div className="pt-4 border-t border-ink/20 flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] text-ink/75 bg-paper px-2 py-0.5 border border-ink/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {item.url && (
                    <div className="pt-1">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs font-bold text-ink hover:text-blue hover:underline flex items-center space-x-1"
                      >
                        <span>Verify Credential</span>
                        <span aria-hidden="true">&rarr;</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
