'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { Project } from '@/content';

// Category Bauhaus Colors
export const CATEGORY_COLORS: Record<string, string> = {
  software: '#0033A0', // Bauhaus Blue
  hardware: '#E10600', // Bauhaus Red
  ai: '#FFC700',       // Bauhaus Yellow
};

// Sizing & Spacing Constants
export const PLINTH_SPACING = 6.0;

interface ObjectThemeProps {
  theme: 'light' | 'dark';
  isActive: boolean;
  dwellProgress: number; // 0 to 1 during dwell
  categoryColor: string;
}

// -------------------------------------------------------------
// 1. AlgoArena (software, blue)
// 9x9 maze with extruded walls, sphere start marker, 3 cone goal markers.
// Idle animation: two search fronts flood outward from start & goal, meet in middle, reset.
// -------------------------------------------------------------
const AlgoArenaObject: React.FC<ObjectThemeProps> = ({ isActive, categoryColor }) => {
  // Models in project remain pristine white with black outlines in both dark and light modes
  const bodyColor = isActive ? '#FFFFFF' : '#8A8A85';
  const outlineColor = '#000000';
  const accentBlue = isActive ? '#0033A0' : '#9E9E9E';
  const accentYellow = isActive ? '#FFC700' : '#BDBDBD';
  const accentRed = isActive ? '#E10600' : '#9E9E9E';

  // Wave search cubes refs
  const waveGroupRef = useRef<THREE.Group>(null);
  const startSphereRef = useRef<THREE.Mesh>(null);
  const goalGroupRef = useRef<THREE.Group>(null);

  // 9x9 maze layout (1 = wall, 0 = path)
  const maze = useMemo(() => [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ], []);

  // Search wave node coordinates
  const searchNodes = useMemo(() => {
    const nodes: { x: number; z: number; distStart: number; distGoal: number }[] = [];
    const cellSize = 0.24;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (maze[r][c] === 0) {
          const x = (c - 4) * cellSize;
          const z = (r - 4) * cellSize;
          const distStart = Math.abs(c - 1) + Math.abs(r - 1);
          const distGoal = Math.abs(c - 7) + Math.abs(r - 7);
          nodes.push({ x, z, distStart, distGoal });
        }
      }
    }
    return nodes;
  }, [maze]);

  useFrame((state) => {
    if (!isActive) return;
    const t = (state.clock.elapsedTime * 1.5) % 4.0; // 4s animation loop

    // Wave search front animation
    if (waveGroupRef.current) {
      const children = waveGroupRef.current.children;
      searchNodes.forEach((node, idx) => {
        const mesh = children[idx] as THREE.Mesh;
        if (!mesh) return;

        const maxDist = 12;
        const frontStart = (t / 3.0) * maxDist;
        const frontGoal = (t / 3.0) * maxDist;

        const inFrontA = Math.abs(node.distStart - frontStart) < 1.4;
        const inFrontB = Math.abs(node.distGoal - frontGoal) < 1.4;

        if (t < 3.2 && (inFrontA || inFrontB)) {
          const lift = inFrontA ? Math.sin((frontStart - node.distStart) * Math.PI) * 0.12 : Math.sin((frontGoal - node.distGoal) * Math.PI) * 0.12;
          mesh.position.y = Math.max(0.04, lift);
          (mesh.material as THREE.MeshToonMaterial).color.set(inFrontA ? accentBlue : accentYellow);
        } else if (t >= 3.2 && t < 3.8 && (node.distStart <= 7 && node.distGoal <= 7)) {
          // Meeting path solved in red
          mesh.position.y = 0.08;
          (mesh.material as THREE.MeshToonMaterial).color.set(accentRed);
        } else {
          mesh.position.y = 0.02;
          (mesh.material as THREE.MeshToonMaterial).color.set('#E8E8E3');
        }
      });
    }

    if (startSphereRef.current) {
      startSphereRef.current.position.y = 0.35 + Math.sin(state.clock.elapsedTime * 3) * 0.04;
    }
    if (goalGroupRef.current) {
      goalGroupRef.current.rotation.y = state.clock.elapsedTime * 0.8;
    }
  });

  const cellSize = 0.24;

  return (
    <group position={[0, 0.2, 0]}>
      {/* Maze Floor Plate */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <boxGeometry args={[2.3, 0.06, 2.3]} />
        <meshToonMaterial color={bodyColor} />
        <Edges color={outlineColor} threshold={15} lineWidth={2} />
      </mesh>

      {/* Extruded Maze Walls (9x9) */}
      {maze.map((row, r) =>
        row.map((cell, c) => {
          if (cell !== 1) return null;
          const x = (c - 4) * cellSize;
          const z = (r - 4) * cellSize;
          return (
            <mesh key={`wall-${r}-${c}`} position={[x, 0.14, z]} castShadow receiveShadow>
              <boxGeometry args={[cellSize * 0.94, 0.28, cellSize * 0.94]} />
              <meshToonMaterial color={isActive ? categoryColor : bodyColor} />
              <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
            </mesh>
          );
        })
      )}

      {/* Interactive Pathfinding Search Waves */}
      <group ref={waveGroupRef}>
        {searchNodes.map((node, idx) => (
          <mesh key={`node-${idx}`} position={[node.x, 0.02, node.z]}>
            <boxGeometry args={[cellSize * 0.7, 0.06, cellSize * 0.7]} />
            <meshToonMaterial color="#E8E8E3" />
            <Edges color={outlineColor} threshold={15} lineWidth={1} />
          </mesh>
        ))}
      </group>

      {/* Start Marker: Sphere at cell (1, 1) */}
      <mesh
        ref={startSphereRef}
        position={[(1 - 4) * cellSize, 0.35, (1 - 4) * cellSize]}
        castShadow
      >
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshToonMaterial color={accentRed} />
        <Edges color={outlineColor} threshold={15} lineWidth={2} />
      </mesh>

      {/* 3 Cone Goal Markers (Multiple Goal States) */}
      <group ref={goalGroupRef}>
        {[
          { c: 7, r: 7 }, // Goal 1: bottom-right
          { c: 7, r: 1 }, // Goal 2: top-right
          { c: 1, r: 7 }, // Goal 3: bottom-left
        ].map((g, idx) => {
          const gx = (g.c - 4) * cellSize;
          const gz = (g.r - 4) * cellSize;
          return (
            <mesh key={`goal-${idx}`} position={[gx, 0.22, gz]} castShadow>
              <coneGeometry args={[0.09, 0.24, 8]} />
              <meshToonMaterial color={accentYellow} />
              <Edges color={outlineColor} threshold={15} lineWidth={2} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

// -------------------------------------------------------------
// 2. Nexus Stock AI (AI, yellow)
// 14 candles (box body + wick; up = blue, down = red), polyline trend line,
// floating yellow triangular "spark" node above the last candle.
// Animation: candles rise in sequence, last candle pulses, spark bobs.
// -------------------------------------------------------------
const NexusStockObject: React.FC<ObjectThemeProps> = ({ isActive }) => {
  const bodyColor = isActive ? '#FFFFFF' : '#8A8A85';
  const outlineColor = '#000000';
  const blueColor = isActive ? '#0033A0' : '#9E9E9E';
  const redColor = isActive ? '#E10600' : '#8A8A85';
  const sparkColor = isActive ? '#FFC700' : '#BDBDBD';

  const candlesRef = useRef<THREE.Group>(null);
  const sparkRef = useRef<THREE.Group>(null);

  // 14 market candlestick definitions (x, height, y-center, isUp)
  const candleData = useMemo(() => [
    { h: 0.35, y: 0.25, isUp: true },
    { h: 0.25, y: 0.38, isUp: false },
    { h: 0.40, y: 0.42, isUp: true },
    { h: 0.30, y: 0.52, isUp: true },
    { h: 0.45, y: 0.60, isUp: false },
    { h: 0.35, y: 0.55, isUp: false },
    { h: 0.50, y: 0.68, isUp: true },
    { h: 0.40, y: 0.78, isUp: true },
    { h: 0.30, y: 0.85, isUp: false },
    { h: 0.55, y: 0.95, isUp: true },
    { h: 0.45, y: 1.05, isUp: false },
    { h: 0.60, y: 1.20, isUp: true },
    { h: 0.50, y: 1.35, isUp: true },
    { h: 0.75, y: 1.55, isUp: true }, // 14th candle (breakout)
  ], []);

  // Trendline points across top of candles
  const trendPoints = useMemo(() => {
    const count = candleData.length;
    const pts: [number, number, number][] = [];
    candleData.forEach((c, idx) => {
      const x = -1.15 + (idx / (count - 1)) * 2.3;
      const y = c.y + c.h * 0.5 + 0.08;
      pts.push([x, y, 0.12]);
    });
    return pts;
  }, [candleData]);

  useFrame((state) => {
    if (!isActive) return;
    const time = state.clock.elapsedTime;

    // Candles sequential wave & last candle pulse
    if (candlesRef.current) {
      candlesRef.current.children.forEach((group, idx) => {
        const isLast = idx === 13;
        const wave = Math.sin(time * 3 - idx * 0.3);
        if (isLast) {
          // Last candle pulses with market conviction
          const pulse = 1.0 + Math.sin(time * 6) * 0.12;
          group.scale.set(pulse, pulse, pulse);
        } else {
          group.position.y = wave * 0.03;
        }
      });
    }

    // Spark node bobbing and spinning
    if (sparkRef.current) {
      sparkRef.current.position.y = 2.15 + Math.sin(time * 4) * 0.12;
      sparkRef.current.rotation.y = time * 2.5;
      sparkRef.current.rotation.z = Math.sin(time * 2) * 0.2;
    }
  });

  return (
    <group position={[0, 0.15, 0]}>
      {/* Plinth Trading Chart Floor */}
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[2.5, 0.08, 1.4]} />
        <meshToonMaterial color={bodyColor} />
        <Edges color={outlineColor} threshold={15} lineWidth={2} />
      </mesh>

      {/* Grid Lines along floor */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((lx, idx) => (
        <mesh key={`grid-${idx}`} position={[lx, 0.01, 0]}>
          <boxGeometry args={[0.02, 0.01, 1.3]} />
          <meshBasicMaterial color="#D0D0C8" />
        </mesh>
      ))}

      {/* 14 Candlesticks (Box Body + Thin Wick) */}
      <group ref={candlesRef}>
        {candleData.map((c, idx) => {
          const x = -1.15 + (idx / 13) * 2.3;
          const candleColor = c.isUp ? blueColor : redColor;
          return (
            <group key={`candle-${idx}`} position={[x, 0, 0]}>
              {/* Thin Wick (Cylinder) */}
              <mesh position={[0, c.y, 0]}>
                <cylinderGeometry args={[0.018, 0.018, c.h + 0.3, 8]} />
                <meshToonMaterial color={outlineColor} />
              </mesh>

              {/* Box Body */}
              <mesh position={[0, c.y, 0]} castShadow>
                <boxGeometry args={[0.13, c.h, 0.18]} />
                <meshToonMaterial color={candleColor} />
                <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Polyline Trendline connecting candlestick closes */}
      {trendPoints.slice(0, -1).map((pt, idx) => {
        const next = trendPoints[idx + 1];
        const midX = (pt[0] + next[0]) / 2;
        const midY = (pt[1] + next[1]) / 2;
        const midZ = (pt[2] + next[2]) / 2;
        const dx = next[0] - pt[0];
        const dy = next[1] - pt[1];
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        return (
          <mesh key={`trend-${idx}`} position={[midX, midY, midZ]} rotation={[0, 0, angle]}>
            <boxGeometry args={[len, 0.045, 0.045]} />
            <meshToonMaterial color={sparkColor} />
            <Edges color={outlineColor} threshold={15} lineWidth={1} />
          </mesh>
        );
      })}

      {/* Floating Yellow Triangular Spark Node above 14th candle */}
      <group ref={sparkRef} position={[1.15, 2.15, 0.12]}>
        <mesh castShadow>
          <tetrahedronGeometry args={[0.16, 0]} />
          <meshToonMaterial color={sparkColor} />
          <Edges color={outlineColor} threshold={15} lineWidth={2} />
        </mesh>
      </group>
    </group>
  );
};

// -------------------------------------------------------------
// 3. AquaSweep (hardware, red)
// RC Water Cleaning Catamaran Boat with Inclined Conveyor Belt & 4 Paddle Wheels.
// Modeled directly after the real autonomous river cleaning vessel:
// - Twin white sponsons / pontoon hulls with angled side shields & forward guide wings
// - Inclined conveyor belt ramp with moving collection slats / tread
// - Black top electronics / battery compartment with red accent line & wiring harness
// - 4 rotating yellow paddle wheels churning water (2 on port, 2 on starboard)
// - Water pool with expanding ripple rings and gentle hydrodynamic bobbing
// -------------------------------------------------------------
const AquaSweepObject: React.FC<ObjectThemeProps> = ({ isActive, categoryColor }) => {
  const bodyColor = isActive ? '#FFFFFF' : '#8A8A85';
  const outlineColor = '#000000';
  const redColor = isActive ? categoryColor : '#8A8A85';
  const blueColor = isActive ? '#0033A0' : '#9E9E9E';
  const yellowColor = isActive ? '#FFC700' : '#BDBDBD';
  const darkTread = '#333333';

  const boatGroupRef = useRef<THREE.Group>(null);
  const paddlesRef = useRef<THREE.Group>(null);
  const conveyorSlatsRef = useRef<THREE.Group>(null);
  const ripplesRef = useRef<THREE.Group>(null);

  // 10 conveyor slats climbing the ramp
  const slatCount = 10;
  const rampAngle = Math.PI / 5.5; // ~33 degrees upward
  const rampLength = 1.35;

  useFrame((state) => {
    if (!isActive) return;
    const time = state.clock.elapsedTime;

    // Hydrodynamic gentle boat bobbing & rocking on water
    if (boatGroupRef.current) {
      boatGroupRef.current.position.y = 0.28 + Math.sin(time * 3.0) * 0.02;
      boatGroupRef.current.rotation.z = Math.sin(time * 2.2) * 0.025; // roll
      boatGroupRef.current.rotation.x = Math.sin(time * 1.8) * 0.02;  // pitch
    }

    // 4 yellow paddle wheels rotating rapidly forward
    if (paddlesRef.current) {
      paddlesRef.current.children.forEach((wheel) => {
        wheel.rotation.x -= 0.12; // continuous forward paddle rotation
      });
    }

    // Conveyor belt slats translating upwards along the incline into hopper
    if (conveyorSlatsRef.current) {
      conveyorSlatsRef.current.children.forEach((slat, idx) => {
        const offset = ((time * 0.45 + (idx / slatCount)) % 1.0);
        // Ramp starts at front-low (z = 0.62, y = -0.04) to rear-high (z = -0.48, y = 0.52)
        const sz = 0.62 - offset * 1.1;
        const sy = -0.04 + offset * 0.56;
        slat.position.set(0, sy, sz);
      });
    }

    // Expanding water ripples from paddle churn and bow wake
    if (ripplesRef.current) {
      ripplesRef.current.children.forEach((ring, idx) => {
        const phase = (time * 0.85 + idx * 0.33) % 1.0;
        const scale = 0.25 + phase * 1.0;
        ring.scale.set(scale, scale, 1);
        const mat = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 1 - phase * 1.1) * 0.5;
      });
    }
  });

  return (
    <group position={[0, 0.15, 0]}>
      {/* Water Basin / Pool Plinth Floor */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <cylinderGeometry args={[1.35, 1.4, 0.22, 32]} />
        <meshToonMaterial color={bodyColor} />
        <Edges color={outlineColor} threshold={15} lineWidth={2} />
      </mesh>

      {/* Blue Water Surface Disk */}
      <mesh position={[0, 0.235, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.32, 32]} />
        <meshToonMaterial color={isActive ? '#CBE2FE' : '#F0F0F0'} />
      </mesh>

      {/* Water Ripples Around Boat Hull */}
      <group ref={ripplesRef} position={[0, 0.245, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {[0, 1, 2].map((idx) => (
          <mesh key={`rip-${idx}`}>
            <ringGeometry args={[0.9, 0.98, 32]} />
            <meshBasicMaterial
              color={blueColor}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Floating RC Cleaner Boat Assembly */}
      <group ref={boatGroupRef} position={[0, 0.28, 0]}>
        {/* Main Central Hull Bed */}
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.76, 0.14, 1.35]} />
          <meshToonMaterial color={bodyColor} />
          <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
        </mesh>

        {/* Slanted Side Shields (Left & Right Walls of the ramp chute) */}
        {[-0.39, 0.39].map((wx, idx) => (
          <group key={`shield-${idx}`} position={[wx, 0.22, 0]}>
            {/* Trapezoidal Chute Wall */}
            <mesh castShadow>
              <boxGeometry args={[0.04, 0.36, 1.35]} />
              <meshToonMaterial color={bodyColor} />
              <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
            </mesh>
            {/* Top Red Safety Trim Stripe */}
            <mesh position={[0, 0.185, 0]}>
              <boxGeometry args={[0.045, 0.03, 1.35]} />
              <meshBasicMaterial color={redColor} />
            </mesh>
          </group>
        ))}

        {/* Forward Funneling Collection Guide Wings (angled out to catch floating waste) */}
        <group position={[-0.45, 0.06, 0.82]} rotation={[0, -Math.PI / 7, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.035, 0.22, 0.42]} />
            <meshToonMaterial color={bodyColor} />
            <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
          </mesh>
        </group>
        <group position={[0.45, 0.06, 0.82]} rotation={[0, Math.PI / 7, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.035, 0.22, 0.42]} />
            <meshToonMaterial color={bodyColor} />
            <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
          </mesh>
        </group>

        {/* Inclined Conveyor Belt Bed */}
        <mesh position={[0, 0.22, 0.05]} rotation={[-rampAngle, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.66, 0.03, rampLength]} />
          <meshToonMaterial color={darkTread} />
          <Edges color={outlineColor} threshold={15} lineWidth={1} />
        </mesh>

        {/* Front & Rear Conveyor Rollers */}
        <mesh position={[0, -0.07, 0.64]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 0.68, 12]} />
          <meshToonMaterial color={outlineColor} />
        </mesh>
        <mesh position={[0, 0.52, -0.52]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 0.68, 12]} />
          <meshToonMaterial color={outlineColor} />
        </mesh>

        {/* Moving Tread Slats on Conveyor Belt */}
        <group ref={conveyorSlatsRef}>
          {Array.from({ length: slatCount }).map((_, idx) => (
            <mesh key={`slat-${idx}`} rotation={[-rampAngle, 0, 0]}>
              <boxGeometry args={[0.62, 0.02, 0.04]} />
              <meshBasicMaterial color={yellowColor} />
            </mesh>
          ))}
        </group>

        {/* Rear Top Black Electronics / Battery Enclosure with Red Trim */}
        <group position={[0, 0.54, -0.44]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.68, 0.38, 0.48]} />
            <meshToonMaterial color="#222222" />
            <Edges color={outlineColor} threshold={15} lineWidth={2} />
          </mesh>
          {/* Red Gasket Line */}
          <mesh position={[0, -0.16, 0]}>
            <boxGeometry args={[0.7, 0.04, 0.5]} />
            <meshBasicMaterial color={redColor} />
          </mesh>
          {/* Telemetry Antenna Mast on Battery Box */}
          <mesh position={[0.22, 0.28, -0.12]}>
            <cylinderGeometry args={[0.008, 0.008, 0.24, 6]} />
            <meshBasicMaterial color={outlineColor} />
          </mesh>
          <mesh position={[0.22, 0.41, -0.12]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color={redColor} />
          </mesh>
        </group>

        {/* White Pontoon Outriggers on Port & Starboard */}
        {[-0.56, 0.56].map((px, idx) => (
          <group key={`pontoon-${idx}`} position={[px, 0.0, 0]}>
            {/* Pontoon Hull Cylinder/Box */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.18, 0.12, 1.25]} />
              <meshToonMaterial color={bodyColor} />
              <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
            </mesh>
            {/* Front Pontoon Taper */}
            <mesh position={[0, 0.02, 0.68]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
              <boxGeometry args={[0.18, 0.1, 0.2]} />
              <meshToonMaterial color={bodyColor} />
              <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
            </mesh>
          </group>
        ))}

        {/* 4 Rotating Yellow Paddle Wheels (2 Port, 2 Starboard) */}
        <group ref={paddlesRef}>
          {[
            [-0.68, -0.01, 0.32],  // Port Front
            [-0.68, -0.01, -0.32], // Port Rear
            [0.68, -0.01, 0.32],   // Starboard Front
            [0.68, -0.01, -0.32],  // Starboard Rear
          ].map(([wx, wy, wz], pIdx) => (
            <group key={`paddle-${pIdx}`} position={[wx, wy, wz]}>
              {/* Central Yellow Hub */}
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.08, 0.08, 0.09, 12]} />
                <meshToonMaterial color={yellowColor} />
                <Edges color={outlineColor} threshold={15} lineWidth={1} />
              </mesh>
              {/* 6 Paddle Blades protruding around wheel */}
              {[0, 1, 2, 3, 4, 5].map((bIdx) => {
                const bAngle = (bIdx * Math.PI) / 3;
                return (
                  <mesh
                    key={`blade-${bIdx}`}
                    position={[0, Math.cos(bAngle) * 0.11, Math.sin(bAngle) * 0.11]}
                    rotation={[bAngle, 0, 0]}
                  >
                    <boxGeometry args={[0.085, 0.07, 0.014]} />
                    <meshToonMaterial color="#FFFFFF" />
                    <Edges color={outlineColor} threshold={15} lineWidth={1} />
                  </mesh>
                );
              })}
            </group>
          ))}
        </group>

        {/* Black & Red Wire Harness connecting battery box to paddle motors */}
        <mesh position={[0.36, 0.34, -0.1]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.5, 6]} />
          <meshBasicMaterial color={outlineColor} />
        </mesh>
        <mesh position={[-0.36, 0.34, -0.1]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.5, 6]} />
          <meshBasicMaterial color={redColor} />
        </mesh>
      </group>
    </group>
  );
};


// -------------------------------------------------------------
// 4. NextNest (software, blue)
// Modern house of stacked cubes with triangular-prism roof, recessed window
// squares and door, small tree, standing on stack of 3 flat cylinders (MySQL database).
// Animation: roof and floors assemble from slightly offset positions, then settle.
// -------------------------------------------------------------
const NextNestObject: React.FC<ObjectThemeProps> = ({ isActive, categoryColor }) => {
  const bodyColor = isActive ? '#FFFFFF' : '#8A8A85';
  const outlineColor = '#000000';
  const blueColor = isActive ? categoryColor : '#9E9E9E';
  const accentRed = isActive ? '#E10600' : '#8A8A85';
  const glassColor = isActive ? '#93C5FD' : '#D0D0D0';

  const lowerFloorRef = useRef<THREE.Group>(null);
  const upperFloorRef = useRef<THREE.Group>(null);
  const roofRef = useRef<THREE.Group>(null);
  const treeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!isActive) return;
    const time = state.clock.elapsedTime;
    const assembleCycle = (time * 0.6) % 4.0; // 4s settle loop

    // Floors & roof assembly animation
    if (assembleCycle < 1.2) {
      const p = assembleCycle / 1.2;
      const ease = 1 - Math.pow(1 - p, 3);
      if (lowerFloorRef.current) lowerFloorRef.current.position.y = 0.5 + (1 - ease) * 0.2;
      if (upperFloorRef.current) upperFloorRef.current.position.y = 1.1 + (1 - ease) * 0.35;
      if (roofRef.current) roofRef.current.position.y = 1.65 + (1 - ease) * 0.55;
    } else {
      // Settled with subtle architectural breathing
      const breath = Math.sin(time * 2) * 0.01;
      if (lowerFloorRef.current) lowerFloorRef.current.position.y = 0.5;
      if (upperFloorRef.current) upperFloorRef.current.position.y = 1.1 + breath * 0.5;
      if (roofRef.current) roofRef.current.position.y = 1.65 + breath;
    }

    if (treeRef.current) {
      treeRef.current.rotation.z = Math.sin(time * 2) * 0.04;
    }
  });

  return (
    <group position={[0, 0.1, 0]}>
      {/* Stack of 3 Flat Cylinders (MySQL Database Foundation) */}
      <group position={[0, 0.1, 0]}>
        {[0, 0.14, 0.28].map((cy, idx) => (
          <group key={`db-${idx}`} position={[0, cy, 0]}>
            <mesh receiveShadow>
              <cylinderGeometry args={[1.35, 1.35, 0.11, 32]} />
              <meshToonMaterial color={blueColor} />
              <Edges color={outlineColor} threshold={15} lineWidth={2} />
            </mesh>
            {/* Database cylinder rim groove */}
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[1.38, 1.38, 0.015, 32]} />
              <meshToonMaterial color={outlineColor} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Lower Living Floor Cube */}
      <group ref={lowerFloorRef} position={[0, 0.5, 0]}>
        <mesh position={[-0.1, 0.18, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.45, 1.1]} />
          <meshToonMaterial color={bodyColor} />
          <Edges color={outlineColor} threshold={15} lineWidth={2} />
        </mesh>

        {/* Recessed Entrance Door (Red) */}
        <mesh position={[-0.1, 0.14, 0.56]}>
          <boxGeometry args={[0.22, 0.32, 0.02]} />
          <meshToonMaterial color={accentRed} />
          <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
        </mesh>

        {/* Recessed Windows Lower Floor */}
        <mesh position={[0.3, 0.22, 0.56]}>
          <boxGeometry args={[0.3, 0.2, 0.02]} />
          <meshToonMaterial color={glassColor} />
          <Edges color={outlineColor} threshold={15} lineWidth={1} />
        </mesh>
      </group>

      {/* Cantilevered Upper Floor Cube */}
      <group ref={upperFloorRef} position={[0, 1.1, 0]}>
        <mesh position={[0.1, 0.16, -0.05]} castShadow receiveShadow>
          <boxGeometry args={[1.25, 0.42, 1.2]} />
          <meshToonMaterial color={bodyColor} />
          <Edges color={outlineColor} threshold={15} lineWidth={2} />
        </mesh>

        {/* Panoramic Ribbon Windows */}
        <mesh position={[0.1, 0.18, 0.56]}>
          <boxGeometry args={[0.9, 0.18, 0.02]} />
          <meshToonMaterial color={glassColor} />
          <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
        </mesh>
        <mesh position={[0.73, 0.18, -0.05]}>
          <boxGeometry args={[0.02, 0.18, 0.8]} />
          <meshToonMaterial color={glassColor} />
          <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
        </mesh>
      </group>

      {/* Triangular-Prism Roof */}
      <group ref={roofRef} position={[0, 1.65, 0]}>
        <mesh position={[0.1, 0.14, -0.05]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.48, 0.48, 1.25, 3]} />
          <meshToonMaterial color={blueColor} />
          <Edges color={outlineColor} threshold={15} lineWidth={2} />
        </mesh>
      </group>

      {/* Small Architectural Tree (Sphere on Cylinder) */}
      <group ref={treeRef} position={[0.92, 0.45, 0.75]}>
        {/* Trunk Cylinder */}
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.035, 0.045, 0.32, 8]} />
          <meshToonMaterial color={outlineColor} />
        </mesh>
        {/* Sphere Crown */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshToonMaterial color={isActive ? '#10B981' : '#A0A0A0'} />
          <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
        </mesh>
      </group>
    </group>
  );
};

// -------------------------------------------------------------
// 5. GovConnect (software, blue + red accent)
// City block grid with roads and buildings of varying height,
// government building with columns and triangular pediment, red emergency pin.
// Animation: box "vehicle" travels along road from pin to building, pin pulses.
// -------------------------------------------------------------
const GovConnectObject: React.FC<ObjectThemeProps> = ({ isActive, categoryColor }) => {
  const bodyColor = isActive ? '#FFFFFF' : '#8A8A85';
  const outlineColor = '#000000';
  const blueColor = isActive ? categoryColor : '#9E9E9E';
  const redColor = isActive ? '#E10600' : '#8A8A85';

  const vehicleRef = useRef<THREE.Group>(null);
  const pinRef = useRef<THREE.Group>(null);

  // City buildings layout: varying heights around grid
  const buildings = useMemo(() => [
    { x: -0.65, z: -0.65, w: 0.45, d: 0.45, h: 0.75 },
    { x: -0.65, z: -0.15, w: 0.45, d: 0.35, h: 0.55 },
    { x: 0.65, z: 0.65, w: 0.45, d: 0.45, h: 0.85 },
    { x: 0.65, z: 0.15, w: 0.45, d: 0.35, h: 0.65 },
    { x: -0.65, z: 0.65, w: 0.45, d: 0.45, h: 0.45 },
  ], []);

  useFrame((state) => {
    if (!isActive) return;
    const time = state.clock.elapsedTime;

    // Emergency vehicle travels from pin (-0.65, 0.65) to Gov Building (0.1, -0.55)
    if (vehicleRef.current) {
      const cycle = (time * 0.8) % 4.0;
      let vx = 0;
      let vz = 0;
      let angle = 0;
      if (cycle < 1.5) {
        // Leg 1: along street X from -0.65 to 0.1
        const p = cycle / 1.5;
        vx = -0.65 + p * 0.75;
        vz = 0.25;
        angle = 0;
      } else if (cycle < 3.0) {
        // Leg 2: turn north into government plaza
        const p = (cycle - 1.5) / 1.5;
        vx = 0.1;
        vz = 0.25 - p * 0.65;
        angle = -Math.PI / 2;
      } else {
        // Arrived at government building
        vx = 0.1;
        vz = -0.4;
        angle = -Math.PI / 2;
      }
      vehicleRef.current.position.set(vx, 0.08, vz);
      vehicleRef.current.rotation.y = angle;
    }

    // Emergency pin pulse
    if (pinRef.current) {
      const pulse = 1.0 + Math.sin(time * 6) * 0.15;
      pinRef.current.scale.set(pulse, pulse, pulse);
      pinRef.current.position.y = 0.65 + Math.sin(time * 3) * 0.04;
    }
  });

  return (
    <group position={[0, 0.15, 0]}>
      {/* City Grid Ground Base */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <boxGeometry args={[2.5, 0.06, 2.5]} />
        <meshToonMaterial color={bodyColor} />
        <Edges color={outlineColor} threshold={15} lineWidth={2} />
      </mesh>

      {/* Road Grid Channels (Darker Asphalt Lines) */}
      <mesh position={[0, 0.015, 0.25]}>
        <boxGeometry args={[2.4, 0.01, 0.28]} />
        <meshBasicMaterial color="#E0E0DB" />
      </mesh>
      <mesh position={[0.1, 0.015, 0]}>
        <boxGeometry args={[0.28, 0.01, 2.4]} />
        <meshBasicMaterial color="#E0E0DB" />
      </mesh>

      {/* City Commercial/Residential Blocks */}
      {buildings.map((b, idx) => (
        <mesh key={`bldg-${idx}`} position={[b.x, b.h / 2 + 0.01, b.z]} castShadow receiveShadow>
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshToonMaterial color={bodyColor} />
          <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
        </mesh>
      ))}

      {/* Classical Government Headquarters Building */}
      <group position={[0.1, 0, -0.65]}>
        {/* Base Steps */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.95, 0.1, 0.6]} />
          <meshToonMaterial color={blueColor} />
          <Edges color={outlineColor} threshold={15} lineWidth={2} />
        </mesh>

        {/* 4 Classical Cylindrical Columns */}
        {[-0.32, -0.11, 0.11, 0.32].map((cx, idx) => (
          <mesh key={`col-${idx}`} position={[cx, 0.3, 0.22]}>
            <cylinderGeometry args={[0.035, 0.035, 0.4, 12]} />
            <meshToonMaterial color={bodyColor} />
            <Edges color={outlineColor} threshold={15} lineWidth={1} />
          </mesh>
        ))}

        {/* Main Building Body Behind Columns */}
        <mesh position={[0, 0.32, -0.05]} castShadow>
          <boxGeometry args={[0.85, 0.45, 0.4]} />
          <meshToonMaterial color={blueColor} />
          <Edges color={outlineColor} threshold={15} lineWidth={2} />
        </mesh>

        {/* Architrave Beam above columns */}
        <mesh position={[0, 0.52, 0.05]}>
          <boxGeometry args={[0.9, 0.06, 0.45]} />
          <meshToonMaterial color={bodyColor} />
          <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
        </mesh>

        {/* Triangular Pediment (Temple Roof) */}
        <mesh position={[0, 0.65, 0.05]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.45, 3]} />
          <meshToonMaterial color={blueColor} />
          <Edges color={outlineColor} threshold={15} lineWidth={2} />
        </mesh>
      </group>

      {/* Emergency Pin Marker (Inverted Cone + Sphere in Red) */}
      <group ref={pinRef} position={[-0.65, 0.65, 0.65]}>
        {/* Sphere Top */}
        <mesh position={[0, 0.14, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshToonMaterial color={redColor} />
          <Edges color={outlineColor} threshold={15} lineWidth={2} />
        </mesh>
        {/* Inverted Cone pointing down */}
        <mesh position={[0, -0.06, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.11, 0.26, 12]} />
          <meshToonMaterial color={redColor} />
          <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
        </mesh>
      </group>

      {/* Traveling Emergency Response Vehicle */}
      <group ref={vehicleRef} position={[-0.65, 0.08, 0.25]}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.08, 0.09]} />
          <meshToonMaterial color={redColor} />
          <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
        </mesh>
        {/* Siren beacon on vehicle */}
        <mesh position={[0, 0.06, 0]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#FFC700" />
        </mesh>
      </group>
    </group>
  );
};

// -------------------------------------------------------------
// 6. VTOL Drone (hardware, red)
// Modeled directly after the user's CAD design:
// - Aerodynamic dark carbon composite fuselage pod with rounded nose
// - Large distinctive yellow/amber canopy hatch with centerline seam
// - High aspect ratio straight carbon wing with bright yellow trailing-edge flap cutouts & linkages
// - Long slender carbon tail boom rod
// - Tail with dark carbon fin & horizontal stabilizer featuring yellow elevator trailing edge
// - Carbon VTOL motor booms with 4 vertical lift motors/rotors & rear pusher prop
// - Beside it: CAD coordinate grid & floating NACA 4412 airfoil schematic
// -------------------------------------------------------------
const VTOLDroneObject: React.FC<ObjectThemeProps> = ({ isActive, categoryColor }) => {
  const bodyColor = isActive ? '#2A2A2A' : '#707070';
  const outlineColor = '#000000';
  const redColor = isActive ? categoryColor : '#8A8A85';
  const yellowAccent = isActive ? '#FFC700' : '#A0A0A0';
  const carbonDark = '#262626';

  const droneGroupRef = useRef<THREE.Group>(null);
  const liftRotorsRef = useRef<THREE.Group>(null);
  const pusherPropRef = useRef<THREE.Group>(null);
  const aileronsRef = useRef<THREE.Group>(null);
  const elevatorRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!isActive) return;
    const time = state.clock.elapsedTime;

    // Gentle aerodynamic flight motion (trim bank and pitch)
    if (droneGroupRef.current) {
      droneGroupRef.current.position.y = 0.82 + Math.sin(time * 2.4) * 0.04;
      droneGroupRef.current.rotation.z = Math.sin(time * 1.6) * 0.035; // gentle bank
      droneGroupRef.current.rotation.x = Math.sin(time * 1.2) * 0.02;  // subtle pitch
    }

    // 4 Lift rotor discs spinning
    if (liftRotorsRef.current) {
      liftRotorsRef.current.children.forEach((rotor, idx) => {
        rotor.rotation.y += (idx % 2 === 0 ? 32 : -32) * 0.016;
      });
    }

    // Pusher propeller spinning
    if (pusherPropRef.current) {
      pusherPropRef.current.rotation.z += 36 * 0.016;
    }

    // Control surface subtle deflection (trimming)
    if (aileronsRef.current) {
      aileronsRef.current.children.forEach((aileron, idx) => {
        aileron.rotation.x = Math.sin(time * 2.5 + idx * Math.PI) * 0.08;
      });
    }
    if (elevatorRef.current) {
      elevatorRef.current.rotation.x = Math.sin(time * 2.0) * 0.06;
    }
  });

  return (
    <group position={[0, 0.18, 0]}>
      {/* Plinth Base with CAD-Style Grid Lines */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <boxGeometry args={[2.5, 0.08, 2.3]} />
        <meshToonMaterial color={isActive ? '#FFFFFF' : '#E8E8E2'} />
        <Edges color={outlineColor} threshold={15} lineWidth={2} />
      </mesh>

      {/* CAD Grid Lines on Plinth Floor */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((gx, idx) => (
        <mesh key={`grid-x-${idx}`} position={[gx, -0.015, 0]}>
          <boxGeometry args={[0.015, 0.005, 2.1]} />
          <meshBasicMaterial color="#D5D5CF" />
        </mesh>
      ))}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((gz, idx) => (
        <mesh key={`grid-z-${idx}`} position={[0, -0.015, gz]}>
          <boxGeometry args={[2.3, 0.005, 0.015]} />
          <meshBasicMaterial color="#D5D5CF" />
        </mesh>
      ))}

      {/* Floating CAD-Accurate VTOL Aircraft */}
      <group ref={droneGroupRef} position={[0, 0.82, 0]}>
        {/* 1. AERODYNAMIC FUSELAGE POD */}
        <group position={[0, 0, 0.28]}>
          {/* Main Pod Body (Elongated capsule/cylinder) */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.11, 0.76, 20]} />
            <meshToonMaterial color={carbonDark} />
            <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
          </mesh>

          {/* Aerodynamic Nose Cone */}
          <mesh position={[0, 0, 0.44]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <coneGeometry args={[0.13, 0.22, 20]} />
            <meshToonMaterial color={carbonDark} />
            <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
          </mesh>
          <mesh position={[0, 0, 0.56]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color={outlineColor} />
          </mesh>

          {/* Tapered Tail Fairing connecting into Boom */}
          <mesh position={[0, 0, -0.44]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
            <coneGeometry args={[0.11, 0.22, 20]} />
            <meshToonMaterial color={carbonDark} />
            <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
          </mesh>

          {/* DISTINCTIVE YELLOW / AMBER CANOPY HATCH (CAD signature feature) */}
          <group position={[0, 0.11, 0.06]}>
            {/* Curved Elongated Dome Canopy */}
            <mesh scale={[1, 0.58, 2.2]} castShadow>
              <sphereGeometry args={[0.11, 24, 16]} />
              <meshToonMaterial color={yellowAccent} />
              <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
            </mesh>
            {/* Centerline Seam on Canopy */}
            <mesh position={[0, 0.065, 0]}>
              <boxGeometry args={[0.012, 0.01, 0.46]} />
              <meshBasicMaterial color={outlineColor} />
            </mesh>
          </group>
        </group>

        {/* 2. HIGH ASPECT RATIO MAIN WING */}
        <group position={[0, 0.11, 0.28]}>
          {/* Left Wing Carbon Panel */}
          <mesh position={[-0.92, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.035, 0.44]} />
            <meshToonMaterial color={carbonDark} />
            <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
          </mesh>
          {/* Right Wing Carbon Panel */}
          <mesh position={[0.92, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.035, 0.44]} />
            <meshToonMaterial color={carbonDark} />
            <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
          </mesh>

          {/* Center Wing Fairing / Joint */}
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.34, 0.045, 0.46]} />
            <meshToonMaterial color={carbonDark} />
            <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
          </mesh>

          {/* YELLOW CONTROL SURFACES (Flaps / Ailerons on Trailing Edge) */}
          <group ref={aileronsRef}>
            {/* Left Yellow Aileron */}
            <group position={[-1.0, 0, -0.22]}>
              <mesh castShadow>
                <boxGeometry args={[0.62, 0.025, 0.12]} />
                <meshToonMaterial color={yellowAccent} />
                <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
              </mesh>
              {/* Black Actuator Linkage Rod & Horn */}
              <mesh position={[0, 0.02, 0.04]}>
                <boxGeometry args={[0.035, 0.03, 0.08]} />
                <meshBasicMaterial color={outlineColor} />
              </mesh>
            </group>

            {/* Right Yellow Aileron */}
            <group position={[1.0, 0, -0.22]}>
              <mesh castShadow>
                <boxGeometry args={[0.62, 0.025, 0.12]} />
                <meshToonMaterial color={yellowAccent} />
                <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
              </mesh>
              {/* Black Actuator Linkage Rod & Horn */}
              <mesh position={[0, 0.02, 0.04]}>
                <boxGeometry args={[0.035, 0.03, 0.08]} />
                <meshBasicMaterial color={outlineColor} />
              </mesh>
            </group>
          </group>
        </group>

        {/* 3. LONG SLENDER CARBON TAIL BOOM */}
        <mesh position={[0, 0.02, -0.52]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.032, 0.025, 1.15, 12]} />
          <meshToonMaterial color={carbonDark} />
          <Edges color={outlineColor} threshold={15} lineWidth={1} />
        </mesh>

        {/* 4. TAIL ASSEMBLY (Vertical Fin & Horizontal Stabilizer with Yellow Elevator) */}
        <group position={[0, 0.02, -1.1]}>
          {/* Vertical Stabilizer / Rudder */}
          <mesh position={[0, 0.16, -0.06]} rotation={[0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.025, 0.32, 0.24]} />
            <meshToonMaterial color={carbonDark} />
            <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
          </mesh>

          {/* Horizontal Stabilizer Main Spar */}
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.78, 0.025, 0.18]} />
            <meshToonMaterial color={carbonDark} />
            <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
          </mesh>

          {/* YELLOW ELEVATOR CONTROL SURFACE along Trailing Edge */}
          <group ref={elevatorRef} position={[0, 0.02, -0.12]}>
            <mesh castShadow>
              <boxGeometry args={[0.76, 0.02, 0.09]} />
              <meshToonMaterial color={yellowAccent} />
              <Edges color={outlineColor} threshold={15} lineWidth={1.5} />
            </mesh>
            {/* Tail Trim Horn */}
            <mesh position={[0, 0.02, 0.02]}>
              <boxGeometry args={[0.025, 0.025, 0.06]} />
              <meshBasicMaterial color={outlineColor} />
            </mesh>
          </group>
        </group>

        {/* 5. VTOL MOTOR BOOMS & 4 VERTICAL LIFT ROTORS */}
        <group position={[0, 0.06, 0.28]}>
          {[-0.68, 0.68].map((bx, bIdx) => (
            <group key={`vtol-boom-${bIdx}`} position={[bx, 0, 0]}>
              {/* Carbon Spar Tube under wing */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.026, 0.026, 0.72, 10]} />
                <meshToonMaterial color={outlineColor} />
              </mesh>
            </group>
          ))}

          {/* 4 Vertical Lift Brushless Motors & Spinning Rotors */}
          <group ref={liftRotorsRef}>
            {[
              [-0.68, 0.05, 0.36],
              [0.68, 0.05, 0.36],
              [-0.68, 0.05, -0.36],
              [0.68, 0.05, -0.36],
            ].map(([mx, my, mz], idx) => (
              <group key={`motor-${idx}`} position={[mx, my, mz]}>
                {/* Motor Bell (Red) */}
                <mesh position={[0, -0.03, 0]}>
                  <cylinderGeometry args={[0.045, 0.045, 0.08, 10]} />
                  <meshToonMaterial color={redColor} />
                  <Edges color={outlineColor} threshold={15} lineWidth={1} />
                </mesh>
                {/* 2-Blade Spinning Propeller */}
                <mesh position={[0, 0.02, 0]}>
                  <boxGeometry args={[0.34, 0.012, 0.035]} />
                  <meshToonMaterial color={bodyColor} />
                  <Edges color={outlineColor} threshold={15} lineWidth={1} />
                </mesh>
              </group>
            ))}
          </group>
        </group>

        {/* 6. AFT PUSHER PROPELLER (at rear of pod) */}
        <group ref={pusherPropRef} position={[0, 0.02, -0.14]}>
          <mesh>
            <boxGeometry args={[0.26, 0.028, 0.012]} />
            <meshToonMaterial color={redColor} />
            <Edges color={outlineColor} threshold={15} lineWidth={1} />
          </mesh>
        </group>
      </group>

      {/* Floating CAD HUD Reference / NACA 4412 Schematic */}
      <group position={[0.72, 0.28, 0.65]} rotation={[-Math.PI / 6, Math.PI / 5, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 0.005, 0.5]} />
          <meshBasicMaterial color="#ECECE6" wireframe />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.42, 0.008, 0.008]} />
          <meshBasicMaterial color={redColor} />
        </mesh>
      </group>
    </group>
  );
};

// -------------------------------------------------------------
// Plinth Item Wrapper
// -------------------------------------------------------------
interface PlinthItemProps {
  project: Project;
  index: number;
  activeIndex: number;
  _transitionProgress?: number;
  dwellProgress: number;      // 0 to 1 during dwell
  theme: 'light' | 'dark';
  onSelect: (slug: string) => void;
  isMobile: boolean;
}

export const PlinthItem: React.FC<PlinthItemProps> = ({
  project,
  index,
  activeIndex,
  _transitionProgress,
  dwellProgress,
  theme,
  onSelect,
  isMobile,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const turntableRef = useRef<THREE.Group>(null);

  const categoryColor = CATEGORY_COLORS[project.category] || '#0033A0';
  const isActive = index === activeIndex;

  // Neighbors calculation
  const total = 6;
  let distFromActive = (index - activeIndex) % total;
  if (distFromActive > total / 2) distFromActive -= total;
  if (distFromActive < -total / 2) distFromActive += total;

  // On mobile: hide non-active neighbours
  const isVisibleOnMobile = isMobile ? isActive : true;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Positioning along X row
    const targetX = distFromActive * PLINTH_SPACING;
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 5, delta);

    // Target vertical lift: active lifts +0.25 units, inactive rests at 0.0
    const liftScale = _transitionProgress !== undefined ? 0.85 + 0.15 * _transitionProgress : 1.0;
    const targetY = isActive ? 0.25 * liftScale : 0.0;
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 6, delta);

    // Target scale: active is 1.0 (boldly filling ~75% stage height), inactive neighbours are 0.62 (or 0 if mobile)
    const targetScale = isMobile ? (isActive ? 1.0 : 0.0) : (isActive ? 1.0 : 0.62);
    const currScale = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 6, delta);
    groupRef.current.scale.set(currScale, currScale, currScale);

    // Turntable slow rotation (~10 deg/s) during dwell
    if (turntableRef.current) {
      if (isActive) {
        turntableRef.current.rotation.y += delta * 0.175; // ~10 deg/sec
      } else {
        turntableRef.current.rotation.y = THREE.MathUtils.damp(turntableRef.current.rotation.y, 0, 4, delta);
      }
    }
  });

  if (!isVisibleOnMobile && isMobile) return null;

  return (
    <group
      ref={groupRef}
      position={[distFromActive * PLINTH_SPACING, isActive ? 0.25 : 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(project.slug);
      }}
    >
      {/* Flat Square Plinth Slab */}
      <mesh position={[0, -0.075, 0]} receiveShadow>
        <boxGeometry args={[2.7, 0.15, 2.7]} />
        <meshToonMaterial color={isActive ? '#FFFFFF' : '#ECECE6'} />
        <Edges color="#000000" threshold={15} lineWidth={2} />
      </mesh>

      {/* Category Plinth Trim Stripe */}
      <mesh position={[0, -0.005, 0]}>
        <boxGeometry args={[2.72, 0.03, 2.72]} />
        <meshBasicMaterial color={isActive ? categoryColor : '#CCCCCC'} />
      </mesh>

      {/* Turntable Model Container */}
      <group ref={turntableRef}>
        {project.slug === 'algoarena' && (
          <AlgoArenaObject
            theme={theme}
            isActive={isActive}
            dwellProgress={dwellProgress}
            categoryColor={categoryColor}
          />
        )}
        {project.slug === 'nexus-stock-ai' && (
          <NexusStockObject
            theme={theme}
            isActive={isActive}
            dwellProgress={dwellProgress}
            categoryColor={categoryColor}
          />
        )}
        {project.slug === 'aquasweep' && (
          <AquaSweepObject
            theme={theme}
            isActive={isActive}
            dwellProgress={dwellProgress}
            categoryColor={categoryColor}
          />
        )}
        {project.slug === 'nextnest' && (
          <NextNestObject
            theme={theme}
            isActive={isActive}
            dwellProgress={dwellProgress}
            categoryColor={categoryColor}
          />
        )}
        {project.slug === 'govconnect' && (
          <GovConnectObject
            theme={theme}
            isActive={isActive}
            dwellProgress={dwellProgress}
            categoryColor={categoryColor}
          />
        )}
        {project.slug === 'vtol-drone' && (
          <VTOLDroneObject
            theme={theme}
            isActive={isActive}
            dwellProgress={dwellProgress}
            categoryColor={categoryColor}
          />
        )}

        {/* Raycast Interaction Hit Box */}
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[2.9, 2.2, 2.9]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
};

// -------------------------------------------------------------
// Hard-Edged Flat Spotlight System (Ground Pool + Trapezoid Beam)
// -------------------------------------------------------------
interface SpotlightSystemProps {
  categoryColor: string;
  theme: 'light' | 'dark';
  isTransitioning: boolean;
  transitionProgress: number; // 0 to 1
}

export const SpotlightSystem: React.FC<SpotlightSystemProps> = ({
  categoryColor,
  theme,
  isTransitioning,
  transitionProgress,
}) => {
  const poolRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const isDark = theme === 'dark';

  useFrame((_, delta) => {
    // a) Ground pool: scaling from 0 to full in 400ms when transitioning
    if (poolRef.current) {
      let targetPoolScale = 1.0;
      if (isTransitioning) {
        // Pool grows in last 400ms of transition (progress > 0.65)
        targetPoolScale = transitionProgress < 0.65 ? 0.0 : (transitionProgress - 0.65) / 0.35;
      }
      poolRef.current.scale.x = THREE.MathUtils.damp(poolRef.current.scale.x, targetPoolScale, 8, delta);
      poolRef.current.scale.y = THREE.MathUtils.damp(poolRef.current.scale.y, targetPoolScale, 8, delta);
      poolRef.current.scale.z = THREE.MathUtils.damp(poolRef.current.scale.z, targetPoolScale, 8, delta);
    }

    // b) Beam: narrows and fades in 250ms, then widens back
    if (beamRef.current) {
      let targetBeamScale = 1.0;
      let targetBeamOpacity = isDark ? 0.16 : 0.14;
      if (isTransitioning) {
        if (transitionProgress < 0.25) {
          // Narrows and fades in 250ms
          const p = transitionProgress / 0.25;
          targetBeamScale = 1 - p;
          targetBeamOpacity = (isDark ? 0.16 : 0.14) * (1 - p);
        } else if (transitionProgress > 0.7) {
          // Widens back
          const p = (transitionProgress - 0.7) / 0.3;
          targetBeamScale = p;
          targetBeamOpacity = (isDark ? 0.16 : 0.14) * p;
        } else {
          targetBeamScale = 0.0;
          targetBeamOpacity = 0.0;
        }
      }
      beamRef.current.scale.x = THREE.MathUtils.damp(beamRef.current.scale.x, targetBeamScale, 8, delta);
      (beamRef.current.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.damp(
        (beamRef.current.material as THREE.MeshBasicMaterial).opacity,
        targetBeamOpacity,
        8,
        delta
      );
    }
  });

  // Flat Trapezoid Beam Geometry: top width 0.8 at Y=6.2, bottom width 4.4 at Y=0.0
  const beamGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const topW = 0.45;
    const botW = 2.2;
    const topY = 6.2;
    const botY = -0.05;

    shape.moveTo(-topW, topY);
    shape.lineTo(topW, topY);
    shape.lineTo(botW, botY);
    shape.lineTo(-botW, botY);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* a) Ground "Pool": Flat circle with hard edge in category color at 100% opacity */}
      <group ref={poolRef} position={[0, -0.165, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh receiveShadow>
          <circleGeometry args={[2.2, 48]} />
          <meshBasicMaterial color={categoryColor} />
        </mesh>
        {/* Crisp Outermost Ink Contrast Ring */}
        <mesh position={[0, 0, 0.002]}>
          <ringGeometry args={[2.16, 2.2, 48]} />
          <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* b) Beam: Flat trapezoid from top of stage down to the pool */}
      <mesh
        ref={beamRef}
        geometry={beamGeometry}
        position={[0, 0, 0]}
        rotation={[0, Math.PI / 4, 0]} // Faces isometric camera directly
      >
        <meshBasicMaterial
          color={isDark ? '#EAEAE4' : '#000000'}
          transparent
          opacity={isDark ? 0.11 : 0.14}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
