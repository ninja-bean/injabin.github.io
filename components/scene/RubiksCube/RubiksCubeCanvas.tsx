'use client';

import React, { useRef, useState, useEffect, useMemo, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { useAppStore } from '@/lib/store';
import {
  Layer,
  Move,
  CubieLogical,
  bezierEase,
  generateScramble,
  invertMoves,
  verifySolvedState,
  run50CyclesVerification,
} from './cubeMath';

// Real-world accurate Rubik's cube palette (WCA standard Western color scheme)
const COLORS = {
  red: '#E10600',    // +X (Right)
  orange: '#FF5800', // -X (Left, opposite Red)
  white: '#FFFFFF',  // +Y (Top)
  yellow: '#FFD500', // -Y (Bottom, opposite White)
  blue: '#0033A0',   // +Z (Front)
  green: '#009B48',  // -Z (Back, opposite Blue)
  body: '#000000',   // Cubie black core (light)
};

interface CubieInstance {
  id: string;
  home: { x: Layer; y: Layer; z: Layer };
  logicalPos: { x: Layer; y: Layer; z: Layer };
  groupRef: THREE.Group | null;
}

interface RubiksCubeInnerProps {
  isHovered: boolean;
  onHoverChange?: (hovered: boolean) => void;
  onStateChange?: (state: 'scrambled' | 'solving' | 'solved' | 'scrambling') => void;
  prefersReducedMotion: boolean;
  isTestMode?: boolean;
}

const RubiksCubeInner: React.FC<RubiksCubeInnerProps> = ({
  isHovered,
  onHoverChange,
  onStateChange,
  prefersReducedMotion,
  isTestMode = false,
}) => {
  const theme = useAppStore((s) => s.theme);
  const isDark = theme === 'dark';

  const rootGroupRef = useRef<THREE.Group>(null);
  const pivotGroupRef = useRef<THREE.Group>(null);

  // State machine: 'scrambled' | 'solving' | 'solved' | 'scrambling'
  const [machineState, setMachineState] = useState<'scrambled' | 'solving' | 'solved' | 'scrambling'>('scrambled');
  const machineStateRef = useRef(machineState);
  machineStateRef.current = machineState;

  // Running history stack of moves applied from solved state
  const historyStack = useRef<Move[]>([]);

  // Current active move queue
  const moveQueue = useRef<Move[]>([]);

  // Active executing move
  const activeMove = useRef<Move | null>(null);
  const activeMoveProgress = useRef(0);
  const activeMoveDuration = useRef(0.25);
  const activeCubies = useRef<CubieInstance[]>([]);

  // Post-solve delay timer (1.2s before re-scrambling)
  const unhoverTimer = useRef<number | null>(null);
  const isHoveredRef = useRef(isHovered);
  isHoveredRef.current = isHovered;

  // Idle rotation accumulators
  const idleRotY = useRef(0);
  const idleRotX = useRef(0);
  const idleTime = useRef(0);

  // 26 Cubie descriptors
  const cubiesData = useMemo(() => {
    const list: CubieInstance[] = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue;
          list.push({
            id: `cubie-${x}-${y}-${z}`,
            home: { x: x as Layer, y: y as Layer, z: z as Layer },
            logicalPos: { x: x as Layer, y: y as Layer, z: z as Layer },
            groupRef: null,
          });
        }
      }
    }
    return list;
  }, []);

  const cubieRefs = useRef<Map<string, THREE.Group>>(new Map());

  // Shared geometry and materials: using subtle matte shades in dark theme
  const bodyGeometry = useMemo(() => new THREE.BoxGeometry(0.96, 0.96, 0.96), []);
  const stickerGeometry = useMemo(() => new THREE.PlaneGeometry(0.88, 0.88), []);

  const materials = useMemo(() => {
    return {
      body: new THREE.MeshBasicMaterial({ color: isDark ? '#1C1C1F' : COLORS.body }),
      red: new THREE.MeshToonMaterial({ color: COLORS.red }),
      orange: new THREE.MeshToonMaterial({ color: COLORS.orange }),
      white: new THREE.MeshToonMaterial({ color: COLORS.white }),
      yellow: new THREE.MeshToonMaterial({ color: COLORS.yellow }),
      blue: new THREE.MeshToonMaterial({ color: COLORS.blue }),
      green: new THREE.MeshToonMaterial({ color: COLORS.green }),
    };
  }, [isDark]);

  // Cleanup geometries and materials on unmount
  useEffect(() => {
    return () => {
      bodyGeometry.dispose();
      stickerGeometry.dispose();
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [bodyGeometry, stickerGeometry, materials]);

  // Initial scramble on mount (applied instantly without animation)
  useLayoutEffect(() => {
    const initialScramble = generateScramble(16);
    historyStack.current = [...initialScramble];

    for (const move of initialScramble) {
      const { axis, layer, dir } = move;
      const angle = dir * (Math.PI / 2);
      const rotAxis = new THREE.Vector3(
        axis === 'x' ? 1 : 0,
        axis === 'y' ? 1 : 0,
        axis === 'z' ? 1 : 0
      );
      const rotQuat = new THREE.Quaternion().setFromAxisAngle(rotAxis, angle);

      for (const cubie of cubiesData) {
        if (cubie.logicalPos[axis] === layer) {
          const p = new THREE.Vector3(cubie.logicalPos.x, cubie.logicalPos.y, cubie.logicalPos.z);
          p.applyQuaternion(rotQuat);
          cubie.logicalPos.x = Math.round(p.x) as Layer;
          cubie.logicalPos.y = Math.round(p.y) as Layer;
          cubie.logicalPos.z = Math.round(p.z) as Layer;

          const grp = cubieRefs.current.get(cubie.id);
          if (grp) {
            grp.position.set(cubie.logicalPos.x, cubie.logicalPos.y, cubie.logicalPos.z);
            grp.quaternion.premultiply(rotQuat);
            grp.quaternion.normalize();
          }
        }
      }
    }
  }, [cubiesData]);

  const pendingSolveAfterMove = useRef(false);

  // Dev Check Helper
  const checkDevSolved = () => {
    const logicalList: CubieLogical[] = cubiesData.map((c) => {
      const grp = cubieRefs.current.get(c.id);
      return {
        home: c.home,
        pos: c.logicalPos,
        quat: grp ? grp.quaternion.clone() : new THREE.Quaternion(),
      };
    });

    const isSolved = verifySolvedState(logicalList);
    if (!isSolved) {
      console.error('[Rubik Cube Dev Verification FAILED]: Cubies not in home solved state!');
    } else {
      console.log('✔ [Rubik Cube Dev Verification PASSED]: 26/26 cubies verified in exact home solved state.');
    }
  };

  // Automated 50-cycle test if ?cubeTest=1
  useEffect(() => {
    if (isTestMode) {
      console.log('Running 50-cycle scramble/solve verification test...');
      const res = run50CyclesVerification();
      if (res.passed) {
        console.log(`✔ [Cube Test]: 50/50 test cycles PASSED!`);
      } else {
        console.error(`✖ [Cube Test]: Only ${res.count}/${res.total} cycles passed.`);
      }
    }
  }, [isTestMode]);

  const applyMoveDirectly = (move: Move) => {
    const { axis, layer, dir } = move;
    const angle = dir * (Math.PI / 2);
    const rotAxis = new THREE.Vector3(
      axis === 'x' ? 1 : 0,
      axis === 'y' ? 1 : 0,
      axis === 'z' ? 1 : 0
    );
    const rotQuat = new THREE.Quaternion().setFromAxisAngle(rotAxis, angle);

    for (const cubie of cubiesData) {
      if (cubie.logicalPos[axis] === layer) {
        const p = new THREE.Vector3(cubie.logicalPos.x, cubie.logicalPos.y, cubie.logicalPos.z);
        p.applyQuaternion(rotQuat);
        cubie.logicalPos.x = Math.round(p.x) as Layer;
        cubie.logicalPos.y = Math.round(p.y) as Layer;
        cubie.logicalPos.z = Math.round(p.z) as Layer;

        const grp = cubieRefs.current.get(cubie.id);
        if (grp) {
          grp.position.set(cubie.logicalPos.x, cubie.logicalPos.y, cubie.logicalPos.z);
          grp.quaternion.premultiply(rotQuat);
          grp.quaternion.normalize();
        }
      }
    }
  };

  const startSolving = () => {
    setMachineState('solving');
    onStateChange?.('solving');

    // Solve = play the inverse of current history stack
    const toSolve = invertMoves(historyStack.current);
    moveQueue.current = toSolve;
  };

  const startScrambling = () => {
    setMachineState('scrambling');
    onStateChange?.('scrambling');

    const freshScramble = generateScramble(11);
    moveQueue.current = freshScramble;
  };

  const solveInstantly = () => {
    const toSolve = invertMoves(historyStack.current);
    for (const move of toSolve) {
      applyMoveDirectly(move);
    }
    historyStack.current = [];
    setMachineState('solved');
    onStateChange?.('solved');
    checkDevSolved();
  };

  const scrambleInstantly = () => {
    const fresh = generateScramble(14);
    for (const move of fresh) {
      applyMoveDirectly(move);
    }
    historyStack.current = [...fresh];
    setMachineState('scrambled');
    onStateChange?.('scrambled');
  };

  const callbacksRef = useRef({
    startSolving,
    startScrambling,
    solveInstantly,
    scrambleInstantly,
  });
  callbacksRef.current = {
    startSolving,
    startScrambling,
    solveInstantly,
    scrambleInstantly,
  };

  // Handle Hover Change Trigger
  useEffect(() => {
    if (isHovered) {
      // Clear any pending unhover scramble timer
      if (unhoverTimer.current) {
        window.clearTimeout(unhoverTimer.current);
        unhoverTimer.current = null;
      }

      if (prefersReducedMotion) {
        callbacksRef.current.solveInstantly();
        return;
      }

      if (machineStateRef.current === 'solving' || machineStateRef.current === 'solved') {
        return;
      }

      if (machineStateRef.current === 'scrambling') {
        // Hover during 'scrambling': finish current move, then switch to solving using moves so far
        moveQueue.current = [];
        if (activeMove.current) {
          pendingSolveAfterMove.current = true;
        } else {
          callbacksRef.current.startSolving();
        }
        return;
      }

      callbacksRef.current.startSolving();
    } else {
      if (prefersReducedMotion) {
        callbacksRef.current.scrambleInstantly();
        return;
      }

      pendingSolveAfterMove.current = false;

      if (machineStateRef.current === 'solved') {
        unhoverTimer.current = window.setTimeout(() => {
          callbacksRef.current.startScrambling();
        }, 1200);
      }
    }
  }, [isHovered, prefersReducedMotion]);

  // Main animation frame loop (Moves + Pivot + Idle Rotations)
  useFrame((state, delta) => {
    const root = rootGroupRef.current;
    const pivot = pivotGroupRef.current;
    if (!root || !pivot) return;

    // 1. Idle Rotation Logic:
    // While solving, ease rotation toward (0,0,0) (isometric pose facing viewer).
    // After solving, slow rotation resumes smoothly.
    if (!prefersReducedMotion) {
      if (machineStateRef.current === 'solving') {
        idleRotY.current = THREE.MathUtils.damp(idleRotY.current, 0, 3, delta);
        idleRotX.current = THREE.MathUtils.damp(idleRotX.current, 0, 3, delta);
      } else {
        idleTime.current += delta;
        idleRotY.current += delta * 0.21;
        idleRotX.current = Math.sin(idleTime.current * 0.9) * 0.052;
      }

      root.rotation.y = idleRotY.current;
      root.rotation.x = idleRotX.current;
    }

    // 2. Layer Turn Animation Logic
    if (activeMove.current) {
      // Step the active move
      activeMoveProgress.current += delta / activeMoveDuration.current;
      const t = Math.min(1, activeMoveProgress.current);
      const easedT = bezierEase(t);

      const { axis, dir } = activeMove.current;
      const targetAngle = dir * (Math.PI / 2);
      pivot.rotation[axis] = targetAngle * easedT;

      if (t >= 1) {
        // Move completed: apply to logical state & re-parent
        const completedMove = activeMove.current;
        const angle = completedMove.dir * (Math.PI / 2);
        const rotAxis = new THREE.Vector3(
          completedMove.axis === 'x' ? 1 : 0,
          completedMove.axis === 'y' ? 1 : 0,
          completedMove.axis === 'z' ? 1 : 0
        );
        const rotQuat = new THREE.Quaternion().setFromAxisAngle(rotAxis, angle);

        for (const cubie of activeCubies.current) {
          const grp = cubieRefs.current.get(cubie.id);
          if (grp) {
            root.attach(grp);

            const p = new THREE.Vector3(cubie.logicalPos.x, cubie.logicalPos.y, cubie.logicalPos.z);
            p.applyQuaternion(rotQuat);
            cubie.logicalPos.x = Math.round(p.x) as Layer;
            cubie.logicalPos.y = Math.round(p.y) as Layer;
            cubie.logicalPos.z = Math.round(p.z) as Layer;

            // Integer coordinate snapping & quaternion normalization
            grp.position.set(cubie.logicalPos.x, cubie.logicalPos.y, cubie.logicalPos.z);
            grp.quaternion.normalize();
          }
        }

        // Reset pivot rotation
        pivot.rotation.set(0, 0, 0);

        // Update history stack
        if (machineStateRef.current === 'solving') {
          historyStack.current.pop();
        } else if (machineStateRef.current === 'scrambling') {
          historyStack.current.push(completedMove);
        }

        activeMove.current = null;
        activeCubies.current = [];

        // Check if hover interrupted scrambling: switch to solving immediately using moves so far
        if (pendingSolveAfterMove.current) {
          pendingSolveAfterMove.current = false;
          startSolving();
          return;
        }

        // Check if queue has finished
        if (moveQueue.current.length === 0) {
          if (machineStateRef.current === 'solving') {
            setMachineState('solved');
            onStateChange?.('solved');
            checkDevSolved();

            // If user unhovered while solving was in progress, schedule re-scramble after 1.2s
            if (!isHoveredRef.current) {
              unhoverTimer.current = window.setTimeout(() => {
                startScrambling();
              }, 1200);
            }
          } else if (machineStateRef.current === 'scrambling') {
            setMachineState('scrambled');
            onStateChange?.('scrambled');

            // If user hovered while scrambling was in progress, immediately solve!
            if (isHoveredRef.current) {
              startSolving();
            }
          }
        }
      }
    } else if (moveQueue.current.length > 0) {
      // Pick next move from queue
      const next = moveQueue.current.shift()!;
      activeMove.current = next;
      activeMoveProgress.current = 0;

      // Adjust duration: 220-280ms when solving, ~160ms when scrambling
      if (machineStateRef.current === 'solving') {
        const remaining = moveQueue.current.length;
        activeMoveDuration.current = THREE.MathUtils.lerp(0.22, 0.28, Math.min(1, remaining / 12));
      } else {
        activeMoveDuration.current = 0.16;
      }

      // Collect cubies for this layer
      const matchingCubies: CubieInstance[] = [];
      for (const cubie of cubiesData) {
        if (cubie.logicalPos[next.axis] === next.layer) {
          matchingCubies.push(cubie);
          const grp = cubieRefs.current.get(cubie.id);
          if (grp) {
            pivot.attach(grp);
          }
        }
      }
      activeCubies.current = matchingCubies;
    }
  });

  return (
    <group ref={rootGroupRef} scale={1.2}>
      {/* Temporary pivot group for active layer rotation */}
      <group ref={pivotGroupRef} position={[0, 0, 0]} />

      {/* 26 Cubies */}
      {cubiesData.map((cubie) => {
        const { home, id } = cubie;

        return (
          <group
            key={id}
            ref={(node) => {
              if (node) {
                cubieRefs.current.set(id, node);
                node.position.set(cubie.logicalPos.x, cubie.logicalPos.y, cubie.logicalPos.z);
              } else {
                cubieRefs.current.delete(id);
              }
            }}
          >
            {/* Black / Matte core box */}
            <mesh geometry={bodyGeometry} material={materials.body} castShadow receiveShadow>
              <Edges color={isDark ? '#46464E' : '#000000'} threshold={15} lineWidth={2.5} />
            </mesh>

            {/* +X Sticker: Red */}
            {home.x === 1 && (
              <mesh
                geometry={stickerGeometry}
                material={materials.red}
                position={[0.481, 0, 0]}
                rotation={[0, Math.PI / 2, 0]}
              >
                <Edges color={isDark ? '#46464E' : '#000000'} threshold={15} lineWidth={2.5} />
              </mesh>
            )}

            {/* -X Sticker: Orange (opposite Red) */}
            {home.x === -1 && (
              <mesh
                geometry={stickerGeometry}
                material={materials.orange}
                position={[-0.481, 0, 0]}
                rotation={[0, -Math.PI / 2, 0]}
              >
                <Edges color={isDark ? '#46464E' : '#000000'} threshold={15} lineWidth={2.5} />
              </mesh>
            )}

            {/* +Y Sticker: White */}
            {home.y === 1 && (
              <mesh
                geometry={stickerGeometry}
                material={materials.white}
                position={[0, 0.481, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <Edges color={isDark ? '#46464E' : '#000000'} threshold={15} lineWidth={2.5} />
              </mesh>
            )}

            {/* -Y Sticker: Yellow (opposite White) */}
            {home.y === -1 && (
              <mesh
                geometry={stickerGeometry}
                material={materials.yellow}
                position={[0, -0.481, 0]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <Edges color={isDark ? '#46464E' : '#000000'} threshold={15} lineWidth={2.5} />
              </mesh>
            )}

            {/* +Z Sticker: Blue */}
            {home.z === 1 && (
              <mesh
                geometry={stickerGeometry}
                material={materials.blue}
                position={[0, 0, 0.481]}
                rotation={[0, 0, 0]}
              >
                <Edges color={isDark ? '#46464E' : '#000000'} threshold={15} lineWidth={2.5} />
              </mesh>
            )}

            {/* -Z Sticker: Green (opposite Blue) */}
            {home.z === -1 && (
              <mesh
                geometry={stickerGeometry}
                material={materials.green}
                position={[0, 0, -0.481]}
                rotation={[0, Math.PI, 0]}
              >
                <Edges color={isDark ? '#46464E' : '#000000'} threshold={15} lineWidth={2.5} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Invisible bounding mesh for pointerenter/pointerleave directly on the cube */}
      <mesh
        onPointerEnter={(e) => {
          e.stopPropagation();
          onHoverChange?.(true);
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          onHoverChange?.(false);
        }}
      >
        <boxGeometry args={[3.8, 3.8, 3.8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Ground Shadow (flat, no plate, no disc) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <shadowMaterial opacity={isDark ? 0.38 : 0.24} color={isDark ? '#121215' : '#000000'} />
      </mesh>
    </group>
  );
};

const CameraIsoRig: React.FC = () => {
  const { camera } = useThree();

  useLayoutEffect(() => {
    // Standard axonometric isometric angle (elevation ~35.26°, azimuth 45°)
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
};

export interface RubiksCubeCanvasProps {
  isHovered: boolean;
  onHoverChange?: (hovered: boolean) => void;
  onStateChange?: (state: 'scrambled' | 'solving' | 'solved' | 'scrambling') => void;
  prefersReducedMotion: boolean;
  isTestMode?: boolean;
}

export const RubiksCubeCanvas: React.FC<RubiksCubeCanvasProps> = ({
  isHovered,
  onHoverChange,
  onStateChange,
  prefersReducedMotion,
  isTestMode,
}) => {
  return (
    <Canvas
      shadows="basic"
      orthographic
      camera={{
        position: [10, 10, 10],
        zoom: 54,
        near: -40,
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
      <CameraIsoRig />

      {/* Ambient illumination */}
      <ambientLight intensity={0.8} />

      {/* Key directional light for crisp hard PCF shadow */}
      <directionalLight
        position={[14, 22, 12]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0005}
      />

      <RubiksCubeInner
        isHovered={isHovered}
        onHoverChange={onHoverChange}
        onStateChange={onStateChange}
        prefersReducedMotion={prefersReducedMotion}
        isTestMode={isTestMode}
      />
    </Canvas>
  );
};

export default RubiksCubeCanvas;
