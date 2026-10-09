'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useAppStore } from '@/lib/store';
import { ResearchTetrahedron } from './ResearchTetrahedron';

export const ResearchTetrahedronCanvas: React.FC = () => {
  const { theme } = useAppStore();

  return (
    <div className="w-full sm:w-[260px] h-[220px] sm:h-[260px] border-2 border-ink bg-paper/60 relative overflow-hidden select-none shrink-0">
      <div className="absolute top-2 left-2 z-10 font-mono text-[10px] text-grey uppercase tracking-wider bg-paper border border-ink/30 px-1.5 py-0.5">
        FIG. 05 // TETRAHEDRON
      </div>

      <Canvas
        shadows="basic"
        orthographic
        camera={{
          position: [8, 8, 8],
          zoom: 46,
          near: -20,
          far: 50,
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
          position={[10, 16, 8]}
          intensity={theme === 'dark' ? 1.1 : 1.35}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
          shadow-camera-near={0.5}
          shadow-camera-far={35}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
          shadow-bias={-0.0005}
        />
        <directionalLight position={[-6, 5, -6]} intensity={0.25} />

        <ResearchTetrahedron />

        {/* Hard Shadow Catcher */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.8, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <shadowMaterial
            opacity={theme === 'dark' ? 0.4 : 0.25}
            color={theme === 'dark' ? '#000000' : '#1A1A1A'}
          />
        </mesh>
      </Canvas>
    </div>
  );
};

export default ResearchTetrahedronCanvas;
