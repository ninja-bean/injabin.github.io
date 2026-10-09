import * as THREE from 'three';

export type Axis = 'x' | 'y' | 'z';
export type Layer = -1 | 0 | 1;
export type Direction = 1 | -1;

export interface Move {
  axis: Axis;
  layer: Layer;
  dir: Direction;
}

export interface CubieLogical {
  home: { x: Layer; y: Layer; z: Layer };
  pos: { x: Layer; y: Layer; z: Layer };
  quat: THREE.Quaternion;
}

/**
 * Cubic-bezier easing evaluator for cubic-bezier(0.7, 0, 0.2, 1)
 */
export function bezierEase(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  // Solve x(s) = t for s with x1 = 0.7, x2 = 0.2 using Newton-Raphson
  let s = t;
  for (let i = 0; i < 8; i++) {
    const s2 = s * s;
    const s3 = s2 * s;
    const inv = 1 - s;
    const x = 3 * inv * inv * s * 0.7 + 3 * inv * s2 * 0.2 + s3;
    const dx = 3 * (1 - 4 * s + 3 * s2) * 0.7 + 3 * (2 * s - 3 * s2) * 0.2 + 3 * s2;
    if (Math.abs(x - t) < 1e-5) break;
    if (Math.abs(dx) > 1e-6) s -= (x - t) / dx;
  }
  s = Math.max(0, Math.min(1, s));
  return 3 * (1 - s) * s * s + s * s * s;
}

/**
 * Generate scramble moves with no immediate repeats or cancelling pairs on the same axis and layer
 */
export function generateScramble(count: number, lastMove?: Move): Move[] {
  const axes: Axis[] = ['x', 'y', 'z'];
  const layers: Layer[] = [-1, 0, 1];
  const dirs: Direction[] = [1, -1];
  const moves: Move[] = [];

  let prev = lastMove;

  for (let i = 0; i < count; i++) {
    let move: Move;
    do {
      move = {
        axis: axes[Math.floor(Math.random() * 3)],
        layer: layers[Math.floor(Math.random() * 3)],
        dir: dirs[Math.floor(Math.random() * 2)],
      };
    } while (prev && prev.axis === move.axis && prev.layer === move.layer);

    moves.push(move);
    prev = move;
  }

  return moves;
}

export function invertMove(move: Move): Move {
  return {
    axis: move.axis,
    layer: move.layer,
    dir: (move.dir === 1 ? -1 : 1) as Direction,
  };
}

export function invertMoves(moves: Move[]): Move[] {
  return moves.slice().reverse().map(invertMove);
}

/**
 * Apply move mathematically to cubies list
 */
export function applyMoveLogically(move: Move, cubies: CubieLogical[]): void {
  const { axis, layer, dir } = move;
  const angle = dir * (Math.PI / 2);
  const rotAxis = new THREE.Vector3(
    axis === 'x' ? 1 : 0,
    axis === 'y' ? 1 : 0,
    axis === 'z' ? 1 : 0
  );
  const rotQuat = new THREE.Quaternion().setFromAxisAngle(rotAxis, angle);

  for (const cubie of cubies) {
    if (cubie.pos[axis] === layer) {
      const p = new THREE.Vector3(cubie.pos.x, cubie.pos.y, cubie.pos.z);
      p.applyQuaternion(rotQuat);
      cubie.pos.x = Math.round(p.x) as Layer;
      cubie.pos.y = Math.round(p.y) as Layer;
      cubie.pos.z = Math.round(p.z) as Layer;

      cubie.quat.premultiply(rotQuat);
      cubie.quat.normalize();
    }
  }
}

/**
 * Verify whether cubies are in solved state:
 * - Every cubie is at its home coordinates
 * - Every cubie quaternion is identity (angle < 0.001)
 */
export function verifySolvedState(cubies: CubieLogical[]): boolean {
  for (const cubie of cubies) {
    if (
      cubie.pos.x !== cubie.home.x ||
      cubie.pos.y !== cubie.home.y ||
      cubie.pos.z !== cubie.home.z
    ) {
      return false;
    }
    const angle = 2 * Math.acos(Math.min(1, Math.abs(cubie.quat.w)));
    if (angle > 0.001) {
      return false;
    }
  }
  return true;
}

/**
 * Run 50 cycles verification test suite
 */
export function run50CyclesVerification(): { passed: boolean; count: number; total: number } {
  let passed = 0;
  const total = 50;

  for (let c = 0; c < total; c++) {
    const cubies: CubieLogical[] = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue;
          cubies.push({
            home: { x: x as Layer, y: y as Layer, z: z as Layer },
            pos: { x: x as Layer, y: y as Layer, z: z as Layer },
            quat: new THREE.Quaternion(),
          });
        }
      }
    }

    const scramble = generateScramble(14 + Math.floor(Math.random() * 5));
    for (const m of scramble) {
      applyMoveLogically(m, cubies);
    }

    const solve = invertMoves(scramble);
    for (const m of solve) {
      applyMoveLogically(m, cubies);
    }

    if (verifySolvedState(cubies)) {
      passed++;
    }
  }

  return { passed: passed === total, count: passed, total };
}
