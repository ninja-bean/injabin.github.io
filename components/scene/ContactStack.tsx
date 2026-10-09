'use client';

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '@/lib/store';

export const ContactStack: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const cubeRef = useRef<THREE.Mesh>(null);
  const coneRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  const { contactSent, theme } = useAppStore();
  const isDark = theme === 'dark';
  const { pointer } = useThree();
  const snapTimeRef = useRef<number | null>(null);
  const elapsedTimeRef = useRef<number>(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    elapsedTimeRef.current += delta;
    const currentElapsedTime = elapsedTimeRef.current;

    // Pointer parallax + idle rotation
    const targetRotY = currentElapsedTime * 0.25 + pointer.x * 0.3;
    const targetRotX = -pointer.y * 0.15;
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

    if (contactSent) {
      if (snapTimeRef.current === null) {
        snapTimeRef.current = currentElapsedTime;
      }
      const elapsedSinceSnap = currentElapsedTime - snapTimeRef.current;

      // Locked snapped-together positions (zero gap)
      if (sphereRef.current) {
        sphereRef.current.position.y = THREE.MathUtils.lerp(
          sphereRef.current.position.y,
          1.15,
          Math.min(1, delta * 15)
        );
      }
      if (cubeRef.current) {
        cubeRef.current.position.y = THREE.MathUtils.lerp(
          cubeRef.current.position.y,
          0.0,
          Math.min(1, delta * 15)
        );
      }
      if (coneRef.current) {
        coneRef.current.position.y = THREE.MathUtils.lerp(
          coneRef.current.position.y,
          -1.05,
          Math.min(1, delta * 15)
        );
      }

      // Snap wave pulse
      if (pulseRef.current) {
        const pulseScale = 1.0 + Math.min(3.5, elapsedSinceSnap * 4.0);
        pulseRef.current.scale.set(pulseScale, pulseScale, pulseScale);
        const mat = pulseRef.current.material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = Math.max(0, 1.0 - elapsedSinceSnap * 1.5);
        }
      }
    } else {
      snapTimeRef.current = null;
      // Idle separated hovering floating state
      const t = currentElapsedTime;
      if (sphereRef.current) {
        sphereRef.current.position.y = THREE.MathUtils.lerp(
          sphereRef.current.position.y,
          1.45 + Math.sin(t * 1.5) * 0.08,
          Math.min(1, delta * 5)
        );
      }
      if (cubeRef.current) {
        cubeRef.current.position.y = THREE.MathUtils.lerp(
          cubeRef.current.position.y,
          0.0 + Math.sin(t * 1.5 + 1) * 0.04,
          Math.min(1, delta * 5)
        );
      }
      if (coneRef.current) {
        coneRef.current.position.y = THREE.MathUtils.lerp(
          coneRef.current.position.y,
          -1.35 + Math.sin(t * 1.5 + 2) * 0.06,
          Math.min(1, delta * 5)
        );
      }
      if (pulseRef.current) {
        pulseRef.current.scale.set(0.001, 0.001, 0.001);
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Base Plinth */}
      <mesh position={[0, -2.2, 0]} receiveShadow>
        <cylinderGeometry args={[2.0, 2.2, 0.3, 32]} />
        <meshToonMaterial color={isDark ? '#323237' : '#FFFFFF'} toneMapped={false} />
        <Edges color={isDark ? '#60606A' : '#000000'} threshold={20} />
      </mesh>

      {/* Top: Red Sphere */}
      <mesh ref={sphereRef} position={[0, 1.45, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshToonMaterial color="#E10600" toneMapped={false} />
        <Edges color={isDark ? '#32323A' : '#000000'} threshold={25} />
      </mesh>

      {/* Middle: Blue Cube */}
      <mesh ref={cubeRef} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshToonMaterial color="#0033A0" toneMapped={false} />
        <Edges color={isDark ? '#32323A' : '#000000'} threshold={15} />
      </mesh>

      {/* Bottom: Yellow Cone */}
      <mesh
        ref={coneRef}
        position={[0, -1.35, 0]}
        rotation={[Math.PI, 0, 0]}
        castShadow
        receiveShadow
      >
        <coneGeometry args={[0.9, 1.3, 32]} />
        <meshToonMaterial color="#FFC700" toneMapped={false} />
        <Edges color={isDark ? '#32323A' : '#000000'} threshold={25} />
      </mesh>

      {/* Snap Impact Celebration Ring */}
      <mesh ref={pulseRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.5, 32]} />
        <meshBasicMaterial
          color="#0033A0"
          side={THREE.DoubleSide}
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  );
};

export default ContactStack;
