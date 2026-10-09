'use client';

import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';

import { useAppStore } from '@/lib/store';

export const ResearchTetrahedron: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { pointer } = useThree();
  const { theme } = useAppStore();
  const isDark = theme === 'dark';

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const speedMultiplier = hovered ? 2.5 : 1.0;
    meshRef.current.rotation.y += delta * 0.45 * speedMultiplier;
    meshRef.current.rotation.x = Math.sin(Date.now() * 0.0015) * 0.2 + (-pointer.y * 0.15);
    meshRef.current.rotation.z = Math.cos(Date.now() * 0.001) * 0.1 + (pointer.x * 0.15);
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Base Octagonal Plinth */}
      <mesh position={[0, -1.6, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.4, 0.35, 8]} />
        <meshToonMaterial color={isDark ? '#323237' : '#FFFFFF'} toneMapped={false} />
        <Edges color={isDark ? '#60606A' : '#000000'} threshold={20} />
      </mesh>

      {/* Main Bauhaus Yellow Rotating Tetrahedron */}
      <mesh
        ref={meshRef}
        position={[0, 0.4, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <tetrahedronGeometry args={[1.9, 0]} />
        <meshToonMaterial
          color="#FFC700"
          toneMapped={false}
        />
        <Edges color={isDark ? '#4A4008' : '#000000'} threshold={15} />
      </mesh>
    </group>
  );
};

export default ResearchTetrahedron;
