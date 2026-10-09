'use client';

import React, { useEffect } from 'react';
import { Project } from '@/content';
import { pauseSmoothScroll, resumeSmoothScroll } from '@/lib/scroll';

interface ProjectDetailProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  // Handle Escape key to close and lock background page scroll
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    pauseSmoothScroll();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      resumeSmoothScroll();
    };
  }, [project, onClose]);

  if (!project) return null;

  const categoryColor =
    project.category === 'hardware'
      ? 'bg-red text-white'
      : project.category === 'ai'
      ? 'bg-yellow text-ink'
      : 'bg-blue text-white';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex justify-start bg-ink/70 backdrop-blur-sm transition-opacity overscroll-contain"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div
        data-lenis-prevent="true"
        className="w-full max-w-2xl bg-paper h-full overflow-y-auto overscroll-contain border-r-4 border-ink p-6 sm:p-10 flex flex-col justify-between shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header Controls */}
          <div className="flex items-center justify-between border-b-2 border-ink pb-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className={`font-mono text-xs uppercase font-bold px-2 py-0.5 border border-ink ${categoryColor}`}>
                {project.category}
              </span>
              <span className="font-mono text-xs text-grey font-bold">
                {project.year} {'//'} CASE STUDY
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-ink text-paper font-mono text-xs font-bold uppercase tracking-wider hover:bg-red hover:text-white transition-colors duration-150 ease-mechanical border border-ink"
              aria-label="Close project details"
            >
              [ESC] CLOSE &times;
            </button>
          </div>

          {/* Title & Pitch */}
          <h2 id="modal-title" className="font-display font-black text-3xl sm:text-4xl text-ink uppercase tracking-tight mb-3">
            {project.title}
          </h2>

          <p className="font-body text-base sm:text-lg text-ink font-semibold mb-6 leading-snug">
            {project.pitch}
          </p>

          {/* Award Badge if present */}
          {project.award && (
            <div className="border-2 border-ink bg-yellow p-3 mb-6 flex items-center space-x-3">
              <span className="font-display font-black text-sm uppercase text-ink">
                AWARD:
              </span>
              <span className="font-body text-xs font-bold text-ink">
                {project.award}
              </span>
            </div>
          )}

          {/* Detailed Breakdown */}
          <div className="space-y-6">
            {/* Section 1: My Part */}
            <div className="border-t-2 border-ink/20 pt-4">
              <h3 className="font-mono text-xs text-grey uppercase tracking-widest mb-1">
                01. MY ROLE & CONTRIBUTION
              </h3>
              <p className="font-body text-sm sm:text-base text-ink leading-relaxed">
                {project.role}
              </p>
              {project.team && (
                <p className="font-mono text-xs text-grey mt-1">
                  COLLABORATION: {project.team}
                </p>
              )}
            </div>

            {/* Section 2: Technical Challenge */}
            <div className="border-t-2 border-ink/20 pt-4">
              <h3 className="font-mono text-xs text-grey uppercase tracking-widest mb-1">
                02. THE HARD PART (ENGINEERING HURDLE)
              </h3>
              <p className="font-body text-sm sm:text-base text-ink leading-relaxed">
                {project.challenge}
              </p>
            </div>

            {/* Section 3: Result & Outcome */}
            <div className="border-t-2 border-ink/20 pt-4">
              <h3 className="font-mono text-xs text-grey uppercase tracking-widest mb-1">
                03. OUTCOME & VALIDATION
              </h3>
              <p className="font-body text-sm sm:text-base text-ink leading-relaxed">
                {project.outcome}
              </p>
            </div>

            {/* Section 4: Technology Stack */}
            <div className="border-t-2 border-ink/20 pt-4">
              <h3 className="font-mono text-xs text-grey uppercase tracking-widest mb-2">
                04. STACK ARCHITECTURE
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs bg-paper border-2 border-ink px-2.5 py-1 text-ink font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t-2 border-ink flex flex-wrap gap-3">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-ink text-paper font-display font-bold text-xs uppercase tracking-wider border-2 border-ink hover:bg-blue hover:text-white transition-colors duration-150 ease-mechanical"
            >
              {link.label} &rarr;
            </a>
          ))}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-paper text-ink font-display font-bold text-xs uppercase tracking-wider border-2 border-ink hover:bg-ink/10 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
