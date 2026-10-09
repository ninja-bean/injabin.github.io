'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { projects } from '@/content';
import { ProjectDetail } from './ProjectDetail';
import { useAppStore } from '@/lib/store';
import { InView } from '@/components/ui/InView';

// Lazy-load ProjectPlinthsCanvas with ssr: false
const ProjectPlinthsCanvas = dynamic(() => import('@/components/scene/ProjectPlinthsCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[280px] sm:h-[320px] lg:h-[360px] mb-8 border-2 border-ink bg-paper/40 flex items-center justify-center font-mono text-xs text-grey">
      Loading 3D Project Plinths...
    </div>
  ),
});

export const Projects: React.FC = () => {
  const hoveredProject = useAppStore((s) => s.hoveredProject);
  const setHoveredProject = useAppStore((s) => s.setHoveredProject);
  const selectedProjectSlug = useAppStore((s) => s.selectedProjectSlug);
  const setSelectedProjectSlug = useAppStore((s) => s.setSelectedProjectSlug);

  const selectedProject = React.useMemo(() => {
    return projects.find((p) => p.slug === selectedProjectSlug) || null;
  }, [selectedProjectSlug]);

  const handleCloseModal = React.useCallback(() => {
    setSelectedProjectSlug(null);
  }, [setSelectedProjectSlug]);

  return (
    <section id="projects" className="py-20 border-b-4 border-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-3 h-3 bg-blue border border-ink" />
              <span className="font-mono text-xs text-grey uppercase tracking-widest">
                Section 03 // Work Index &amp; 3D Plinths
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-ink uppercase tracking-tight">
              Featured Projects
            </h2>
          </div>
          <p className="font-mono text-xs text-grey">
            SHOWING 6 VERIFIED REPOSITORIES &amp; 3D METAPHORS
          </p>
        </div>

        {/* 3D Isometric Metaphor Plinths Gallery */}
        <InView
          fallback={
            <div className="w-full h-[280px] sm:h-[320px] lg:h-[360px] mb-8 border-2 border-ink bg-paper/40 flex items-center justify-center font-mono text-xs text-grey">
              Loading 3D Project Plinths...
            </div>
          }
        >
          <ProjectPlinthsCanvas />
        </InView>

        {/* 12-Column Grid of 6 Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, idx) => {
            const badgeColor =
              project.category === 'hardware'
                ? 'bg-red text-white'
                : project.category === 'ai'
                ? 'bg-yellow text-ink'
                : 'bg-blue text-white';

            const isHovered = hoveredProject === project.slug;

            return (
              <article
                key={project.slug}
                onMouseEnter={() => setHoveredProject(project.slug)}
                onMouseLeave={() => setHoveredProject(null)}
                tabIndex={0}
                onFocus={() => setHoveredProject(project.slug)}
                onBlur={() => setHoveredProject(null)}
                className={`border-2 p-6 bg-paper flex flex-col justify-between transition-all duration-150 ease-mechanical group relative outline-none ${
                  isHovered
                    ? 'border-blue ring-2 ring-blue/30 -translate-y-1 shadow-sm'
                    : 'border-ink hover:border-blue'
                }`}
              >
                <div>
                  {/* Top Bar: Index & Category */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-grey font-bold">
                      0{idx + 1} {'//'} {project.year}
                    </span>
                    <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-ink ${badgeColor}`}>
                      {project.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-ink uppercase tracking-tight mb-3 group-hover:text-blue transition-colors">
                    {project.title}
                  </h3>

                  {/* Pitch */}
                  <p className="font-body text-sm sm:text-base text-ink/90 font-medium mb-4 leading-snug">
                    {project.pitch}
                  </p>

                  {/* Contribution snippet */}
                  <div className="border-t border-ink/20 pt-3 mb-4">
                    <span className="font-mono text-[11px] text-grey uppercase block mb-1">
                      Role &amp; Contribution:
                    </span>
                    <p className="font-body text-xs text-ink/80 leading-relaxed line-clamp-3">
                      {project.role}
                    </p>
                  </div>
                </div>

                <div>
                  {/* Stack Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10px] bg-ink/5 border border-ink/20 px-2 py-0.5 text-ink"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t-2 border-ink text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setSelectedProjectSlug(project.slug)}
                      className="px-3 py-1.5 bg-ink text-paper font-bold uppercase tracking-wider hover:bg-blue hover:text-white transition-colors duration-150 ease-mechanical border border-ink cursor-pointer"
                    >
                      Case Study &rarr;
                    </button>

                    <div className="flex items-center flex-wrap gap-2.5">
                      {project.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target={link.href.startsWith('http') ? '_blank' : undefined}
                          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-ink font-bold hover:text-blue underline"
                        >
                          {link.label.includes('Live')
                            ? 'Live Demo ↗'
                            : link.label.includes('Repo')
                            ? 'Repo ↗'
                            : link.label.includes('CAD')
                            ? 'CAD Specs →'
                            : `${link.label} ↗`}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Case Study Detail Modal / Overlay */}
      <ProjectDetail
        project={selectedProject}
        onClose={handleCloseModal}
      />
    </section>
  );
};
