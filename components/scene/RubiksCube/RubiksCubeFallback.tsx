import React from 'react';

// Real-world accurate Rubik sticker colors (Red, Blue, Yellow, White, Green, Orange)
const COLORS = ['#E10600', '#0033A0', '#FFD500', '#FFFFFF', '#009B48', '#FF5800'];

/**
 * Static SVG isometric Rubik's cube shown when WebGL is unavailable.
 * Matches position, Bauhaus sticker colors, and scrambled appearance.
 */
export const RubiksCubeFallback: React.FC = () => {
  // Scrambled palette distribution across visible facets:
  // Top face (9 facets)
  const topColors = [
    COLORS[0], COLORS[2], COLORS[3],
    COLORS[1], COLORS[4], COLORS[0],
    COLORS[2], COLORS[5], COLORS[1],
  ];

  // Front-Left (+Z) face (9 facets)
  const leftColors = [
    COLORS[1], COLORS[3], COLORS[2],
    COLORS[0], COLORS[1], COLORS[5],
    COLORS[4], COLORS[2], COLORS[0],
  ];

  // Front-Right (+X) face (9 facets)
  const rightColors = [
    COLORS[2], COLORS[0], COLORS[4],
    COLORS[3], COLORS[0], COLORS[1],
    COLORS[5], COLORS[4], COLORS[3],
  ];

  // Isometric vector basis (30 degrees)
  // dx = cos(30) * s = 0.866 * s, dy = sin(30) * s = 0.5 * s
  const s = 36;
  const dx = 31.18; // s * cos(30)
  const dy = 18;    // s * sin(30)
  const originX = 180;
  const originY = 160;

  return (
    <div className="w-full h-full flex items-center justify-center select-none" aria-hidden="true">
      <svg
        viewBox="0 0 360 360"
        className="w-full max-w-[420px] max-h-[420px] drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft isometric ground shadow */}
        <ellipse
          cx="180"
          cy="310"
          rx="110"
          ry="32"
          fill="#000000"
          fillOpacity="0.22"
        />

        {/* 1. TOP FACE: 9 Rhombuses */}
        {topColors.map((color, idx) => {
          const col = idx % 3;
          const row = Math.floor(idx / 3);
          // Vertex coordinates for top face facet
          const x0 = originX + (col - row) * dx;
          const y0 = originY + (col + row) * dy - 3 * dy * 2;
          const p1 = `${x0},${y0}`;
          const p2 = `${x0 + dx},${y0 + dy}`;
          const p3 = `${x0},${y0 + 2 * dy}`;
          const p4 = `${x0 - dx},${y0 + dy}`;
          return (
            <polygon
              key={`top-${idx}`}
              points={`${p1} ${p2} ${p3} ${p4}`}
              fill={color}
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          );
        })}

        {/* 2. FRONT-LEFT FACE: 9 Rhombuses */}
        {leftColors.map((color, idx) => {
          const col = idx % 3;
          const row = Math.floor(idx / 3);
          const x0 = originX - (3 - col) * dx;
          const y0 = originY + (col) * dy + row * s;
          const p1 = `${x0},${y0}`;
          const p2 = `${x0 + dx},${y0 + dy}`;
          const p3 = `${x0 + dx},${y0 + dy + s}`;
          const p4 = `${x0},${y0 + s}`;
          return (
            <polygon
              key={`left-${idx}`}
              points={`${p1} ${p2} ${p3} ${p4}`}
              fill={color}
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          );
        })}

        {/* 3. FRONT-RIGHT FACE: 9 Rhombuses */}
        {rightColors.map((color, idx) => {
          const col = idx % 3;
          const row = Math.floor(idx / 3);
          const x0 = originX + col * dx;
          const y0 = originY + (3 - col) * dy + row * s;
          const p1 = `${x0},${y0}`;
          const p2 = `${x0 + dx},${y0 - dy}`;
          const p3 = `${x0 + dx},${y0 - dy + s}`;
          const p4 = `${x0},${y0 + s}`;
          return (
            <polygon
              key={`right-${idx}`}
              points={`${p1} ${p2} ${p3} ${p4}`}
              fill={color}
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          );
        })}
      </svg>
    </div>
  );
};
