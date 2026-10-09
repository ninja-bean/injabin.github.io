'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useAppStore } from '@/lib/store';
import { ContactStack } from './ContactStack';

export const ContactStackCanvas: React.FC = () => {
  const { theme, contactSent } = useAppStore();

  return (
    <div className="relative w-full border-2 border-ink bg-paper/60 overflow-hidden select-none">
      {/* Top Technical Metadata Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-ink bg-paper text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className={`w-2.5 h-2.5 border border-ink ${contactSent ? 'bg-blue' : 'bg-red'}`} />
          <span className="font-bold text-ink uppercase tracking-wider">
            FIG. 07 // BAUHAUS PRIMARY MONOLITH
          </span>
        </div>
        <span className="text-grey hidden sm:inline">
          {contactSent ? 'STATE: ASSEMBLED & LOCKED' : 'STATE: SEPARATED // AWAITING DISPATCH'}
        </span>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="w-full h-[280px] sm:h-[320px] relative">
        <Canvas
          shadows="basic"
          orthographic
          camera={{
            position: [10, 10, 10],
            zoom: 44,
            near: -30,
            far: 60,
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
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            shadow-bias={-0.0005}
          />
          <directionalLight position={[-8, 6, -8]} intensity={0.25} />

          <ContactStack />

          {/* Hard Shadow Catcher */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -2.35, 0]}
            receiveShadow
          >
            <planeGeometry args={[30, 30]} />
            <shadowMaterial
              opacity={theme === 'dark' ? 0.45 : 0.25}
              color={theme === 'dark' ? '#000000' : '#1A1A1A'}
            />
          </mesh>
        </Canvas>

        {/* Dynamic Status Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="bg-paper border-2 border-ink px-3 py-1 font-mono text-[11px] flex items-center space-x-2 shadow-sm">
            <span className={`w-2 h-2 ${contactSent ? 'bg-blue' : 'bg-yellow'} border border-ink`} />
            <span className="text-ink font-bold uppercase">
              {contactSent
                ? 'TRANSMISSION CONFIRMED // SHAPES LOCKED'
                : 'DISPATCH MESSAGE TO SNAP SHAPES TOGETHER'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactStackCanvas;
