'use client';

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';
import { skillGroups } from '@/content/skills';
import { useAppStore } from '@/lib/store';

interface SkillMeshProps {
  name: string;
  category: 'languages' | 'web' | 'ai' | 'hardware';
  color: string;
  position: [number, number, number];
  isHovered: boolean;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

const SkillBlockMesh: React.FC<SkillMeshProps> = ({
  color,
  position,
  isHovered,
  onPointerOver,
  onPointerOut,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentPos = useRef(new THREE.Vector3(...position));
  const targetPos = useRef(new THREE.Vector3(...position));

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    targetPos.current.set(
      position[0],
      position[1] + (isHovered ? 0.2 : 0),
      position[2] + (isHovered ? 0.8 : 0)
    );

    currentPos.current.lerp(targetPos.current, Math.min(1, delta * 12));
    meshRef.current.position.copy(currentPos.current);

    const targetScale = isHovered ? 1.06 : 1.0;
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
      position={position}
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
      <boxGeometry args={[2.0, 0.42, 1.4]} />
      <meshToonMaterial
        color={color}
        toneMapped={false}
      />
      <Edges color={isDark ? '#4E4E58' : '#000000'} threshold={15} />
    </mesh>
  );
};

export const SkillBlocks: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { hoveredSkill, setHoveredSkill, theme } = useAppStore();
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Gentle idle float & pointer parallax
    const targetRotY = pointer.x * 0.18;
    const targetRotX = -pointer.y * 0.12;
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

  const groupXMap: Record<string, number> = {
    languages: -4.8,
    web: -1.6,
    ai: 1.6,
    hardware: 4.8,
  };

  const colorMap: Record<string, string> = {
    ink: theme === 'dark' ? '#D6D6D0' : '#1A1A1A',
    blue: '#0033A0',
    yellow: '#FFC700',
    red: '#E10600',
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {skillGroups.map((group) => {
        const xPos = groupXMap[group.id] ?? 0;
        const color = colorMap[group.colorToken] || '#0033A0';
        const total = group.skills.length;

        return (
          <group key={group.id} position={[xPos, 0, 0]}>
            {/* Group Base Plinth */}
            <mesh position={[0, -2.6, 0]} receiveShadow>
              <boxGeometry args={[2.3, 0.25, 1.7]} />
              <meshToonMaterial
                color={theme === 'dark' ? '#222222' : '#E8E8E2'}
                toneMapped={false}
              />
              <Edges color="#000000" threshold={15} />
            </mesh>

            {/* Individual Exploded Skill Blocks */}
            {group.skills.map((skill, sIdx) => {
              const yOffset = (sIdx - (total - 1) / 2) * 0.55;
              const isHovered = hoveredSkill === skill.name;

              return (
                <SkillBlockMesh
                  key={skill.name}
                  name={skill.name}
                  category={skill.category}
                  color={color}
                  position={[0, yOffset, 0]}
                  isHovered={isHovered}
                  onPointerOver={() => setHoveredSkill(skill.name)}
                  onPointerOut={() => setHoveredSkill(null)}
                />
              );
            })}
          </group>
        );
      })}
    </group>
  );
};

export default SkillBlocks;
