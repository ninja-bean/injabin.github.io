'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useAppStore, SectionId } from '@/lib/store';

// Waypoints mapping per section
interface Waypoint {
  cameraPos: [number, number, number];
  targetLookAt: [number, number, number];
  zoom: number;
}

const SECTION_WAYPOINTS: Record<SectionId, Waypoint> = {
  hero: {
    cameraPos: [10, 10, 10],
    targetLookAt: [0, 0, 0],
    zoom: 54,
  },
  about: {
    cameraPos: [12, 10, 12],
    targetLookAt: [0, -1.5, 0],
    zoom: 50,
  },
  projects: {
    cameraPos: [14, 11, 10],
    targetLookAt: [1, -3.0, 0],
    zoom: 48,
  },
  skills: {
    cameraPos: [10, 13, 14],
    targetLookAt: [-1, -4.5, 0],
    zoom: 46,
  },
  honors: {
    cameraPos: [13, 10, 11],
    targetLookAt: [0, -6.0, 0],
    zoom: 48,
  },
  experience: {
    cameraPos: [11, 12, 13],
    targetLookAt: [1, -7.5, 0],
    zoom: 46,
  },
  contact: {
    cameraPos: [10, 10, 10],
    targetLookAt: [0, -9.0, 0],
    zoom: 52,
  },
};

export const ScrollRig: React.FC = () => {
  const { camera } = useThree();
  const activeSection = useAppStore((state) => state.activeSection);
  const scrollProgress = useAppStore((state) => state.scrollProgress);

  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const targetWaypoint = SECTION_WAYPOINTS[activeSection] || SECTION_WAYPOINTS.hero;

    if (prefersReducedMotion) {
      // Instant snap when reduced motion is preferred
      camera.position.set(...targetWaypoint.cameraPos);
      currentLookAt.current.set(...targetWaypoint.targetLookAt);
      camera.lookAt(currentLookAt.current);
      if ('zoom' in camera) {
        camera.zoom = targetWaypoint.zoom;
        camera.updateProjectionMatrix();
      }
      return;
    }

    // Smooth scrubbed camera position damping with subtle continuous scroll parallax
    const progressOffset = (scrollProgress - 0.5) * 1.2;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetWaypoint.cameraPos[0] + progressOffset, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetWaypoint.cameraPos[1], 4, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetWaypoint.cameraPos[2] - progressOffset, 4, delta);

    // Smooth scrubbed lookAt target damping
    currentLookAt.current.x = THREE.MathUtils.damp(
      currentLookAt.current.x,
      targetWaypoint.targetLookAt[0],
      4,
      delta
    );
    currentLookAt.current.y = THREE.MathUtils.damp(
      currentLookAt.current.y,
      targetWaypoint.targetLookAt[1],
      4,
      delta
    );
    currentLookAt.current.z = THREE.MathUtils.damp(
      currentLookAt.current.z,
      targetWaypoint.targetLookAt[2],
      4,
      delta
    );

    camera.lookAt(currentLookAt.current);

    // Smooth zoom adjustment
    if ('zoom' in camera) {
      camera.zoom = THREE.MathUtils.damp(camera.zoom, targetWaypoint.zoom, 4, delta);
      camera.updateProjectionMatrix();
    }
  });

  return null;
};

export default ScrollRig;
