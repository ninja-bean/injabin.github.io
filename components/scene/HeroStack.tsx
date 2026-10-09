'use client';

import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { getBauhausColor } from './materials';

export const HeroStack: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const cubeRef = useRef<THREE.Mesh>(null);
  const coneRef = useRef<THREE.Mesh>(null);
  const plinthRef = useRef<THREE.Mesh>(null);

  const [hoveredShape, setHoveredShape] = useState<string | null>(null);
  const [exploded, setExploded] = useState(false);
  const explodeProgress = useRef(0);

  const { viewport } = useThree();

  // Listen to custom event from 2D button or clicks
  useEffect(() => {
    const handleToggle = () => setExploded((prev) => !prev);
    window.addEventListener('toggle-hero-stack', handleToggle);
    return () => window.removeEventListener('toggle-hero-stack', handleToggle);
  }, []);

  // In an orthographic camera at [12, 12, 12] looking at [0,0,0]:
  // Screen Right is +X, -Z (vector [1, 0, -1])
  // Screen Up is -X + 2*Y - Z (vector [-1, 2, -1])
  const isMobile = viewport.width < 14;
  const baseScale = isMobile ? 0.75 : 1.2;

  // Base coordinates placing the stack in the top-right of the hero section
  const baseX = isMobile ? 0.0 : 6.0;
  const baseY = isMobile ? 2.5 : 2.2;
  const baseZ = isMobile ? 0.0 : -6.0;

  useFrame((state, delta) => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Pointer Parallax with dampening
    const px = state.pointer.x * 0.75;
    const py = state.pointer.y * 0.75;

    // Moving mouse right (px > 0) -> +X, -Z
    // Moving mouse up (py > 0) -> +Y
    const targetX = baseX + px * 0.8;
    const targetY = baseY + py * 0.7;
    const targetZ = baseZ - px * 0.8;

    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(
        groupRef.current.position.x,
        targetX,
        4,
        delta
      );
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        targetY,
        4,
        delta
      );
      groupRef.current.position.z = THREE.MathUtils.damp(
        groupRef.current.position.z,
        targetZ,
        4,
        delta
      );

      // Subtle responsive 3D tilt towards cursor
      if (!prefersReducedMotion) {
        groupRef.current.rotation.y = THREE.MathUtils.damp(
          groupRef.current.rotation.y,
          px * 0.25,
          3,
          delta
        );
        groupRef.current.rotation.x = THREE.MathUtils.damp(
          groupRef.current.rotation.x,
          -py * 0.15,
          3,
          delta
        );
      }
    }

    // 2. Explode / Disassemble spring transition
    const targetExplode = exploded ? 1 : 0;
    explodeProgress.current = THREE.MathUtils.damp(
      explodeProgress.current,
      targetExplode,
      5,
      delta
    );
    const exp = explodeProgress.current;

    // 3. Shapes Idle & Interactive Transformations
    if (sphereRef.current) {
      if (!prefersReducedMotion) {
        sphereRef.current.rotation.y += delta * 0.45;
        sphereRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
      }
      const isHovered = hoveredShape === 'sphere';
      const targetSphereY = 2.4 + exp * 1.3 + (isHovered ? 0.35 : 0);
      const targetSphereScale = isHovered ? 1.12 : 1.0;
      sphereRef.current.position.y = THREE.MathUtils.damp(
        sphereRef.current.position.y,
        targetSphereY,
        6,
        delta
      );
      sphereRef.current.scale.setScalar(
        THREE.MathUtils.damp(sphereRef.current.scale.x, targetSphereScale, 8, delta)
      );
    }

    if (cubeRef.current) {
      if (!prefersReducedMotion) {
        cubeRef.current.rotation.y += delta * (hoveredShape === 'cube' ? 1.5 : 0.4);
        cubeRef.current.rotation.z += delta * 0.2;
      }
      const isHovered = hoveredShape === 'cube';
      const targetCubeY = 0.0 + (isHovered ? 0.2 : 0);
      const targetCubeScale = isHovered ? 1.08 : 1.0;
      cubeRef.current.position.y = THREE.MathUtils.damp(
        cubeRef.current.position.y,
        targetCubeY,
        6,
        delta
      );
      cubeRef.current.scale.setScalar(
        THREE.MathUtils.damp(cubeRef.current.scale.x, targetCubeScale, 8, delta)
      );
    }

    if (coneRef.current) {
      if (!prefersReducedMotion) {
        coneRef.current.rotation.y += delta * (hoveredShape === 'cone' ? 1.8 : 0.55);
        coneRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.7) * 0.15;
      }
      const isHovered = hoveredShape === 'cone';
      const targetConeY = -2.1 - exp * 0.8 - (isHovered ? 0.2 : 0);
      const targetConeScale = isHovered ? 1.1 : 1.0;
      coneRef.current.position.y = THREE.MathUtils.damp(
        coneRef.current.position.y,
        targetConeY,
        6,
        delta
      );
      coneRef.current.scale.setScalar(
        THREE.MathUtils.damp(coneRef.current.scale.x, targetConeScale, 8, delta)
      );
    }
  });

  const redColor = getBauhausColor('red');
  const blueColor = getBauhausColor('blue');
  const yellowColor = getBauhausColor('yellow');
  const whiteColor = getBauhausColor('white');
  const outlineColor = '#000000';

  const handlePointerOver = (shape: string) => {
    setHoveredShape(shape);
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

  const handleToggleExplode = (e?: { stopPropagation?: () => void }) => {
    e?.stopPropagation?.();
    setExploded((prev) => !prev);
  };

  return (
    <group ref={groupRef} position={[baseX, baseY, baseZ]} scale={baseScale}>
      {/* 1. Red Sphere (top of the primary stack) */}
      <mesh
        ref={sphereRef}
        position={[0, 2.4, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => handlePointerOver('sphere')}
        onPointerOut={handlePointerOut}
        onClick={handleToggleExplode}
      >
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshToonMaterial color={redColor} />
      </mesh>

      {/* 2. Blue Cube (center anchor of the stack) */}
      <mesh
        ref={cubeRef}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => handlePointerOver('cube')}
        onPointerOut={handlePointerOut}
        onClick={handleToggleExplode}
      >
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshToonMaterial color={blueColor} />
        {/* Technical drawing black outline per Section 4.4 */}
        <Edges
          color={outlineColor}
          threshold={15}
          lineWidth={2.5}
        />
      </mesh>

      {/* 3. Yellow Cone (base primitive of the stack) */}
      <mesh
        ref={coneRef}
        position={[0, -2.1, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => handlePointerOver('cone')}
        onPointerOut={handlePointerOut}
        onClick={handleToggleExplode}
      >
        <coneGeometry args={[1.35, 2.2, 32]} />
        <meshToonMaterial color={yellowColor} />
        {/* Outline along base and apex */}
        <Edges
          color={outlineColor}
          threshold={15}
          lineWidth={2.5}
        />
      </mesh>

      {/* 4. Technical Construction Plinth */}
      <mesh
        ref={plinthRef}
        position={[0, -3.3, 0]}
        receiveShadow
        onPointerOver={() => handlePointerOver('plinth')}
        onPointerOut={handlePointerOut}
        onClick={handleToggleExplode}
      >
        <cylinderGeometry args={[2.2, 2.2, 0.15, 32]} />
        <meshToonMaterial color={whiteColor} />
        <Edges
          color={outlineColor}
          threshold={15}
          lineWidth={2.5}
        />
      </mesh>
    </group>
  );
};
