'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { skillGroups } from '@/content';
import { useAppStore } from '@/lib/store';
import { InView } from '@/components/ui/InView';

const SkillBlocksCanvas = dynamic(
  () => import('@/components/scene/SkillBlocksCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[280px] sm:h-[320px] lg:h-[360px] mb-10 border-2 border-ink bg-paper/40 flex items-center justify-center font-mono text-xs text-grey">
        Loading 3D Skill Explosion...
      </div>
    ),
  }
);

export const Skills: React.FC = () => {
  const { hoveredSkill, setHoveredSkill } = useAppStore();

  return (
    <section id="skills" className="py-20 border-b-4 border-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-3 h-3 bg-yellow border border-ink" />
              <span className="font-mono text-xs text-grey uppercase tracking-widest">
                Section 04 // Capabilities &amp; 3D Stacks
              </span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-ink uppercase tracking-tight">
              Skills &amp; Disciplines
            </h2>
          </div>
          <p className="font-mono text-xs text-grey">
            EVIDENCE-BACKED TECHNICAL PROFICIENCIES
          </p>
        </div>

        {/* 3D Exploded Axonometric Skill Blocks */}
        <InView
          fallback={
            <div className="w-full h-[280px] sm:h-[320px] lg:h-[360px] mb-10 border-2 border-ink bg-paper/40 flex items-center justify-center font-mono text-xs text-grey">
              Loading 3D Skill Explosion...
            </div>
          }
        >
          <SkillBlocksCanvas />
        </InView>

        {/* 12-Column Grid: 4 Disciplines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillGroups.map((group) => {
            const tokenBadge =
              group.colorToken === 'red'
                ? 'bg-red text-white'
                : group.colorToken === 'yellow'
                ? 'bg-yellow text-ink'
                : group.colorToken === 'blue'
                ? 'bg-blue text-white'
                : 'bg-ink text-paper';

            return (
              <div
                key={group.id}
                className="border-2 border-ink p-6 bg-paper flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center space-x-2.5 mb-3 border-b-2 border-ink pb-3">
                    <span className={`w-3.5 h-3.5 border border-ink ${tokenBadge}`} />
                    <h3 className="font-display font-black text-xl text-ink uppercase tracking-tight">
                      {group.title}
                    </h3>
                  </div>

                  <p className="font-body text-xs text-grey mb-6 leading-relaxed">
                    {group.description}
                  </p>

                  {/* Skills List */}
                  <ul className="space-y-2.5">
                    {group.skills.map((skill) => {
                      const isHovered = hoveredSkill === skill.name;
                      return (
                        <li
                          key={skill.name}
                          tabIndex={0}
                          onMouseEnter={() => setHoveredSkill(skill.name)}
                          onMouseLeave={() => setHoveredSkill(null)}
                          onFocus={() => setHoveredSkill(skill.name)}
                          onBlur={() => setHoveredSkill(null)}
                          className={`font-body text-sm flex items-center justify-between border-b pb-1.5 transition-colors duration-150 cursor-pointer outline-none ${
                            isHovered
                              ? 'text-blue font-bold border-blue pl-1.5 bg-blue/5'
                              : 'text-ink border-ink/10 hover:border-ink'
                          }`}
                        >
                          <span className="font-medium">{skill.name}</span>
                          {skill.relatedProjects && skill.relatedProjects.length > 0 && (
                            <span className="font-mono text-[10px] text-grey uppercase tracking-wider">
                              [{skill.relatedProjects.length} projs]
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-ink/20">
                  <span className="font-mono text-[10px] text-grey uppercase tracking-widest block">
                    TOTAL: {group.skills.length} SKILLS
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
