'use client';

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';
import { experiences } from '@/content/experience';
import { useAppStore } from '@/lib/store';

interface SlabProps {
  id: string;
  role: string;
  org: string;
  idx: number;
  args: [number, number, number];
  basePos: [number, number, number];
  color: string;
  isHovered: boolean;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

const SlabMesh: React.FC<SlabProps> = ({
  args,
  basePos,
  color,
  isHovered,
  onPointerOver,
  onPointerOut,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentPos = useRef(new THREE.Vector3(...basePos));
  const targetPos = useRef(new THREE.Vector3(...basePos));

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    targetPos.current.set(
      basePos[0],
      basePos[1] + (isHovered ? 0.15 : 0),
      basePos[2] + (isHovered ? 0.9 : 0)
    );

    currentPos.current.lerp(targetPos.current, Math.min(1, delta * 12));
    meshRef.current.position.copy(currentPos.current);

    const targetScale = isHovered ? 1.04 : 1.0;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      Math.min(1, delta * 12)
    );
  });

  const { theme } = useAppStore();
  const isDark = theme === 'dark';

  return (
    <mesh
      ref={meshRef}
      position={basePos}
      castShadow
      receiveShadow
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onPointerOut();
      }}
    >
      <boxGeometry args={args} />
      <meshToonMaterial
        color={color}
        toneMapped={false}
      />
      <Edges color={isDark ? '#4E4E58' : '#000000'} threshold={15} />
    </mesh>
  );
};

export const ExperienceSlabs: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { hoveredExperience, setHoveredExperience, theme } = useAppStore();
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetRotY = pointer.x * 0.16;
    const targetRotX = -pointer.y * 0.1;
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY,
      3,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      3,
      delta
    );
  });

  // Ordered from bottom (foundation: UIU education) to top (Outlier AI)
  const slabConfigs: Array<{
    id: string;
    args: [number, number, number];
    basePos: [number, number, number];
    accentColor: string;
  }> = [
    {
      id: 'uiu-education',
      args: [8.6, 0.9, 4.8],
      basePos: [0, -1.8, 0],
      accentColor: '#0033A0', // Blue
    },
    {
      id: 'uiu-app-forum',
      args: [7.4, 0.75, 4.2],
      basePos: [0, -0.75, 0],
      accentColor: '#FFC700', // Yellow
    },
    {
      id: 'uiu-cansat',
      args: [6.4, 0.65, 3.6],
      basePos: [0, 0.15, 0],
      accentColor: '#E10600', // Red
    },
    {
      id: 'outlier',
      args: [5.2, 0.55, 3.0],
      basePos: [0, 0.95, 0],
      accentColor: '#0033A0', // Blue
    },
  ];

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {slabConfigs.map((config, idx) => {
        const exp = experiences.find((e) => e.id === config.id);
        const isHovered = hoveredExperience === config.id;
        const defaultColor =
          theme === 'dark'
            ? idx % 2 === 0
              ? '#2A2A2A'
              : '#383838'
            : idx % 2 === 0
            ? '#E8E8E2'
            : '#FFFFFF';
        const color = isHovered ? config.accentColor : defaultColor;

        return (
          <SlabMesh
            key={config.id}
            id={config.id}
            role={exp?.role || ''}
            org={exp?.organization || ''}
            idx={idx}
            args={config.args}
            basePos={config.basePos}
            color={color}
            isHovered={isHovered}
            onPointerOver={() => setHoveredExperience(config.id)}
            onPointerOut={() => setHoveredExperience(null)}
          />
        );
      })}
    </group>
  );
};

export default ExperienceSlabs;
