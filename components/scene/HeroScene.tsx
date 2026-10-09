'use client';

import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { useAppStore } from '@/lib/store';
import { getBauhausColor } from './materials';

const CameraRig: React.FC = () => {
  const { camera } = useThree();

  useLayoutEffect(() => {
    camera.position.set(12, 12, 12);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
};

interface StackProps {
  exploded: boolean;
  onToggleExplode: () => void;
}

const StackObjects: React.FC<StackProps> = ({ exploded, onToggleExplode }) => {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const cubeRef = useRef<THREE.Mesh>(null);
  const coneRef = useRef<THREE.Mesh>(null);
  const plinthRef = useRef<THREE.Mesh>(null);

  const [hoveredShape, setHoveredShape] = useState<string | null>(null);
  const explodeProgress = useRef(0);

  useFrame((state, delta) => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Smooth Pointer Parallax / Tilt
    if (groupRef.current && !prefersReducedMotion) {
      const px = state.pointer.x * 0.45;
      const py = state.pointer.y * 0.35;
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        px,
        4,
        delta
      );
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        -py,
        4,
        delta
      );
    }

    // 2. Explode / Reassemble spring transition
    const targetExp = exploded ? 1 : 0;
    explodeProgress.current = THREE.MathUtils.damp(
      explodeProgress.current,
      targetExp,
      5,
      delta
    );
    const exp = explodeProgress.current;

    // 3. Shape transformations: Idle rotation + Hover lifts
    if (sphereRef.current) {
      if (!prefersReducedMotion) {
        sphereRef.current.rotation.y += delta * 0.4;
        sphereRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.12;
      }
      const isHov = hoveredShape === 'sphere';
      const targetY = 2.2 + exp * 1.4 + (isHov ? 0.35 : 0);
      const targetScale = isHov ? 1.12 : 1.0;
      sphereRef.current.position.y = THREE.MathUtils.damp(
        sphereRef.current.position.y,
        targetY,
        6,
        delta
      );
      sphereRef.current.scale.setScalar(
        THREE.MathUtils.damp(sphereRef.current.scale.x, targetScale, 8, delta)
      );
    }

    if (cubeRef.current) {
      if (!prefersReducedMotion) {
        cubeRef.current.rotation.y += delta * (hoveredShape === 'cube' ? 1.6 : 0.45);
        cubeRef.current.rotation.z += delta * 0.2;
      }
      const isHov = hoveredShape === 'cube';
      const targetY = 0.0 + (isHov ? 0.2 : 0);
      const targetScale = isHov ? 1.08 : 1.0;
      cubeRef.current.position.y = THREE.MathUtils.damp(
        cubeRef.current.position.y,
        targetY,
        6,
        delta
      );
      cubeRef.current.scale.setScalar(
        THREE.MathUtils.damp(cubeRef.current.scale.x, targetScale, 8, delta)
      );
    }

    if (coneRef.current) {
      if (!prefersReducedMotion) {
        coneRef.current.rotation.y += delta * (hoveredShape === 'cone' ? 1.8 : 0.5);
        coneRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.7) * 0.12;
      }
      const isHov = hoveredShape === 'cone';
      const targetY = -2.0 - exp * 0.8 - (isHov ? 0.2 : 0);
      const targetScale = isHov ? 1.1 : 1.0;
      coneRef.current.position.y = THREE.MathUtils.damp(
        coneRef.current.position.y,
        targetY,
        6,
        delta
      );
      coneRef.current.scale.setScalar(
        THREE.MathUtils.damp(coneRef.current.scale.x, targetScale, 8, delta)
      );
    }
  });

  const redColor = getBauhausColor('red');
  const blueColor = getBauhausColor('blue');
  const yellowColor = getBauhausColor('yellow');
  const whiteColor = getBauhausColor('white');
  const outlineColor = '#000000';

  const handlePointerOver = (name: string) => {
    setHoveredShape(name);
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHoveredShape(null);
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'default';
    }
  };

  const handleClick = (e?: { stopPropagation?: () => void }) => {
    e?.stopPropagation?.();
    onToggleExplode();
  };

  return (
    <group ref={groupRef} position={[0, 0.2, 0]} scale={1.05}>
      {/* 1. Red Sphere (Top Primitive) */}
      <mesh
        ref={sphereRef}
        position={[0, 2.2, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => handlePointerOver('sphere')}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshToonMaterial color={redColor} />
      </mesh>

      {/* 2. Blue Cube (Center Primitive) */}
      <mesh
        ref={cubeRef}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => handlePointerOver('cube')}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <boxGeometry args={[1.75, 1.75, 1.75]} />
        <meshToonMaterial color={blueColor} />
        <Edges color={outlineColor} threshold={15} lineWidth={2.5} />
      </mesh>

      {/* 3. Yellow Cone (Base Primitive) */}
      <mesh
        ref={coneRef}
        position={[0, -2.0, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => handlePointerOver('cone')}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <coneGeometry args={[1.3, 2.1, 32]} />
        <meshToonMaterial color={yellowColor} />
        <Edges color={outlineColor} threshold={15} lineWidth={2.5} />
      </mesh>

      {/* 4. Architectural Bauhaus Circular Plinth */}
      <mesh
        ref={plinthRef}
        position={[0, -3.15, 0]}
        receiveShadow
        onPointerOver={() => handlePointerOver('plinth')}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <cylinderGeometry args={[2.3, 2.3, 0.15, 32]} />
        <meshToonMaterial color={whiteColor} />
        <Edges color={outlineColor} threshold={15} lineWidth={2.5} />
      </mesh>

      {/* Shadow Catcher Plane under Plinth */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -3.25, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.35} color="#000000" />
      </mesh>
    </group>
  );
};

export const HeroScene: React.FC = () => {
  const { theme } = useAppStore();
  const [exploded, setExploded] = useState(false);

  useEffect(() => {
    const handleToggle = () => setExploded((prev) => !prev);
    window.addEventListener('toggle-hero-stack', handleToggle);
    return () => window.removeEventListener('toggle-hero-stack', handleToggle);
  }, []);

  return (
    <div className="relative w-full h-full select-none cursor-pointer">
      <Canvas
        shadows="basic"
        orthographic
        camera={{
          position: [12, 12, 12],
          zoom: 46,
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
        <CameraRig />

        <ambientLight intensity={theme === 'dark' ? 0.5 : 0.75} />

        <directionalLight
          position={[14, 24, 12]}
          intensity={theme === 'dark' ? 1.2 : 1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={60}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-bias={-0.0005}
        />

        <directionalLight position={[-10, 8, -10]} intensity={0.3} />

        <StackObjects
          exploded={exploded}
          onToggleExplode={() => setExploded((prev) => !prev)}
        />
      </Canvas>
    </div>
  );
};

export default HeroScene;
