'use client';

import React, { useLayoutEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useAppStore } from '@/lib/store';
import { HeroStack } from './HeroStack';

const IsometricCameraRig: React.FC = () => {
  const { camera } = useThree();

  useLayoutEffect(() => {
    camera.position.set(12, 12, 12);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
};

export const Scene: React.FC = () => {
  const { theme } = useAppStore();

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Canvas
        shadows="basic"
        orthographic
        camera={{
          position: [12, 12, 12],
          zoom: 45,
          near: -50,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        className="w-full h-full pointer-events-auto"
      >
        {/* Enforce isometric axonometric camera alignment per Section 4.1 */}
        <IsometricCameraRig />

        {/* Ambient illumination */}
        <ambientLight intensity={theme === 'dark' ? 0.45 : 0.7} />

        {/* Directional Key Light with Hard Shadow per Section 4.4 */}
        <directionalLight
          position={[15, 25, 12]}
          intensity={theme === 'dark' ? 1.1 : 1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={60}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
          shadow-bias={-0.0005}
        />

        {/* Secondary fill light */}
        <directionalLight
          position={[-10, 8, -10]}
          intensity={0.25}
        />

        {/* Bauhaus Hero Stack: 3 Primitives (Phase E) */}
        <HeroStack />

        {/* Stage shadow catcher plane */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -5.5, 0]}
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <shadowMaterial
            opacity={theme === 'dark' ? 0.4 : 0.25}
            color={theme === 'dark' ? '#000000' : '#1A1A1A'}
          />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Scene;
