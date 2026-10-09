import * as THREE from 'three';

// Bauhaus Color Palette Constants
export const BAUHAUS_COLORS = {
  ink: '#000000',
  paper: '#F5F5F0',
  white: '#FFFFFF',
  red: '#E10600',
  blue: '#0033A0',
  yellow: '#FFC700',
  grey: '#5C5C58',
};

// Monochrome Mode Palette Constants
export const MONO_COLORS = {
  ink: '#000000',
  paper: '#F5F5F0',
  white: '#FFFFFF',
  red: '#000000',
  blue: '#5C5C58',
  yellow: '#E0E0DC',
  grey: '#5C5C58',
};

export type BauhausColorKey = keyof typeof BAUHAUS_COLORS;

/**
 * Returns the exact hex color depending on whether mono mode is active.
 */
export function getBauhausColor(key: BauhausColorKey, isMono: boolean = false): string {
  if (isMono) {
    return MONO_COLORS[key] || '#000000';
  }
  return BAUHAUS_COLORS[key] || '#000000';
}

/**
 * Factory for creating flat toon materials adhering to Bauhaus style (no gloss, no specular).
 */
export function createBauhausMaterial(
  colorKey: BauhausColorKey,
  isMono: boolean = false,
  opacity: number = 1
): THREE.MeshToonMaterial {
  const color = getBauhausColor(colorKey, isMono);
  return new THREE.MeshToonMaterial({
    color: new THREE.Color(color),
    transparent: opacity < 1,
    opacity,
    wireframe: false,
  });
}
