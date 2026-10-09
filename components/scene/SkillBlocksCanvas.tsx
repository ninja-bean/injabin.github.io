'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useAppStore } from '@/lib/store';
import { SkillBlocks } from './SkillBlocks';
import { skillGroups } from '@/content/skills';

export const SkillBlocksCanvas: React.FC = () => {
  const { theme, hoveredSkill } = useAppStore();

  const activeSkillInfo = React.useMemo(() => {
    if (!hoveredSkill) return null;
    for (const group of skillGroups) {
      const match = group.skills.find((s) => s.name === hoveredSkill);
      if (match) {
        return {
          name: match.name,
          group: group.title,
          color: group.colorToken,
          projects: match.relatedProjects || [],
        };
      }
    }
    return null;
  }, [hoveredSkill]);

  return (
    <div className="relative w-full border-2 border-ink bg-paper/60 mb-10 overflow-hidden select-none">
      {/* Top Technical Metadata Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-ink bg-paper text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-yellow border border-ink" />
          <span className="font-bold text-ink uppercase tracking-wider">
            FIG. 04 // AXONOMETRIC SKILL EXPLOSION
          </span>
        </div>
        <span className="text-grey hidden sm:inline">
          ISOMETRIC 35.264° // 4 CATEGORY DISCIPLINE CLUSTERS
        </span>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="w-full h-[280px] sm:h-[320px] lg:h-[360px] relative">
        <Canvas
          shadows="basic"
          orthographic
          camera={{
            position: [12, 10, 12],
            zoom: 36,
            near: -40,
            far: 80,
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 1.5]}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={theme === 'dark' ? 0.45 : 0.7} />
          <directionalLight
            position={[10, 20, 10]}
            intensity={theme === 'dark' ? 1.1 : 1.35}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.5}
            shadow-camera-far={45}
            shadow-camera-left={-12}
            shadow-camera-right={12}
            shadow-camera-top={12}
            shadow-camera-bottom={-12}
            shadow-bias={-0.0005}
          />
          <directionalLight position={[-8, 6, -8]} intensity={0.25} />

          <SkillBlocks />

          {/* Hard Shadow Catcher */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -2.8, 0]}
            receiveShadow
          >
            <planeGeometry args={[40, 40]} />
            <shadowMaterial
              opacity={theme === 'dark' ? 0.45 : 0.25}
              color={theme === 'dark' ? '#000000' : '#1A1A1A'}
            />
          </mesh>
        </Canvas>

        {/* Dynamic HUD Overlay Badge */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto flex items-center justify-between pointer-events-none">
          <div className="bg-paper border-2 border-ink px-3 py-1.5 font-mono text-xs flex items-center space-x-2.5 shadow-sm">
            <span
              className={`w-2 h-2 border border-ink ${
                activeSkillInfo?.color === 'red'
                  ? 'bg-red'
                  : activeSkillInfo?.color === 'blue'
                  ? 'bg-blue'
                  : activeSkillInfo?.color === 'yellow'
                  ? 'bg-yellow'
                  : 'bg-ink'
              }`}
            />
            {activeSkillInfo ? (
              <span className="text-ink font-bold">
                {activeSkillInfo.name} {'//'} {activeSkillInfo.group}
                {activeSkillInfo.projects.length > 0 && (
                  <span className="text-grey font-normal ml-2">
                    [Used in: {activeSkillInfo.projects.join(', ')}]
                  </span>
                )}
              </span>
            ) : (
              <span className="text-grey">
                HOVER OR FOCUS A SKILL BLOCK OR CARD
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillBlocksCanvas;
