'use client';

import React from 'react';
import { Project } from '@/content';
import { CATEGORY_COLORS } from './ProjectPlinths';

interface FallbackProps {
  projects: Project[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  onOpenProject: (slug: string) => void;
}

export const ProjectPlinthsFallback: React.FC<FallbackProps> = ({
  projects,
  activeIndex,
  onSelectIndex,
  onOpenProject,
}) => {
  const currentProject = projects[activeIndex] || projects[0];
  const catColor = CATEGORY_COLORS[currentProject.category] || '#0033A0';

  const categoryBadgeClass =
    currentProject.category === 'hardware'
      ? 'bg-red text-white'
      : currentProject.category === 'ai'
      ? 'bg-yellow text-ink'
      : 'bg-blue text-white';

  return (
    <div className="border-2 border-ink bg-paper mb-8 select-none overflow-hidden relative">
      {/* 1. Header Strip */}
      <div className="border-b-2 border-ink bg-paper px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-blue border border-ink" />
          <span className="font-mono text-[10px] sm:text-xs text-ink font-bold uppercase tracking-wider">
            STAGE // 3D METAPHOR VAULT
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-mono text-[10px] sm:text-xs text-grey uppercase tracking-wider">
            ACTIVE SPOTLIGHT:
          </span>
          <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-ink ${categoryBadgeClass}`}>
            {currentProject.title}
          </span>
          <span className="font-mono text-[10px] text-grey uppercase hidden sm:inline">
            {'//'} {currentProject.category}
          </span>
        </div>

        <div className="font-mono text-[10px] text-grey uppercase hidden md:inline">
          [STATIC SVG FALLBACK // CLICK TAB TO FOCUS]
        </div>
      </div>

      {/* 2. Main Viewport: Isometric SVG Illustration */}
      <div
        onClick={() => onOpenProject(currentProject.slug)}
        className="relative w-full h-[280px] sm:h-[320px] lg:h-[360px] bg-paper/40 flex items-center justify-center cursor-pointer p-4"
      >
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full max-w-[850px] max-h-[600px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Spotlight Beam (Flat Trapezoid) */}
          <polygon
            points="340,0 460,0 600,480 200,480"
            fill="#000000"
            opacity="0.14"
          />

          {/* Ground Pool (Isometric Ellipse in Category Color) */}
          <ellipse cx="400" cy="460" rx="190" ry="75" fill={catColor} />
          <ellipse cx="400" cy="460" rx="190" ry="75" fill="none" stroke="#000000" strokeWidth="3" />

          {/* Plinth Base Slab */}
          <polygon
            points="400,380 560,435 400,490 240,435"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="3"
          />
          <polygon
            points="240,435 400,490 400,510 240,455"
            fill="#E5E5DF"
            stroke="#000000"
            strokeWidth="3"
          />
          <polygon
            points="400,490 560,435 560,455 400,510"
            fill="#D0D0CA"
            stroke="#000000"
            strokeWidth="3"
          />

          {/* Plinth Category Trim Stripe */}
          <polygon
            points="240,442 400,497 400,503 240,448"
            fill={catColor}
          />
          <polygon
            points="400,497 560,442 560,448 400,503"
            fill={catColor}
          />

          {/* Object-Specific Isometric Illustration */}
          {currentProject.slug === 'algoarena' && (
            <g transform="translate(400, 360)">
              {/* 9x9 Maze Walls */}
              <polygon points="0,-100 120,-40 0,20 -120,-40" fill="#F0F0EA" stroke="#000000" strokeWidth="2" />
              {/* Blue Maze Pillars */}
              <polygon points="-60,-60 -20,-40 -20,-10 -60,-30" fill="#0033A0" stroke="#000000" strokeWidth="2" />
              <polygon points="20,-40 60,-60 60,-30 20,-10" fill="#002280" stroke="#000000" strokeWidth="2" />
              <polygon points="-20,-20 20,-40 20,0 -20,20" fill="#0033A0" stroke="#000000" strokeWidth="2" />
              {/* Red Start Sphere */}
              <circle cx="-60" cy="-60" r="16" fill="#E10600" stroke="#000000" strokeWidth="2" />
              {/* Yellow Goal Cones */}
              <polygon points="60,-80 50,-50 70,-50" fill="#FFC700" stroke="#000000" strokeWidth="2" />
              <polygon points="0,-30 -10,0 10,0" fill="#FFC700" stroke="#000000" strokeWidth="2" />
              <polygon points="60,-20 50,10 70,10" fill="#FFC700" stroke="#000000" strokeWidth="2" />
            </g>
          )}

          {currentProject.slug === 'nexus-stock-ai' && (
            <g transform="translate(400, 380)">
              {/* 14 Candlesticks & Polyline */}
              {[-120, -100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100, 120].map((cx, i) => {
                const isUp = i % 3 !== 1;
                const h = 25 + (i * 7);
                const cy = -h - (i * 5);
                return (
                  <g key={i}>
                    <line x1={cx} y1={cy - 15} x2={cx} y2={cy + h + 15} stroke="#000000" strokeWidth="2" />
                    <rect
                      x={cx - 7}
                      y={cy}
                      width="14"
                      height={h}
                      fill={isUp ? '#0033A0' : '#E10600'}
                      stroke="#000000"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}
              {/* Yellow Spark Node */}
              <polygon points="120,-220 108,-195 132,-195" fill="#FFC700" stroke="#000000" strokeWidth="2" />
            </g>
          )}

          {currentProject.slug === 'aquasweep' && (
            <g transform="translate(400, 360)">
              {/* Water Pool & Ripples */}
              <ellipse cx="0" cy="40" rx="140" ry="55" fill="#CBE2FE" stroke="#000000" strokeWidth="3" />
              <ellipse cx="0" cy="40" rx="90" ry="35" fill="none" stroke="#0033A0" strokeWidth="2" strokeDasharray="6,4" />
              {/* White Catamaran Hull & Side Shields */}
              <polygon points="-70,25 70,25 60,-15 -60,-15" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
              {/* Angled Forward Guide Fins */}
              <polygon points="-75,30 -55,10 -55,25" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
              <polygon points="75,30 55,10 55,25" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
              {/* Inclined Conveyor Belt with Yellow Slats */}
              <polygon points="-30,30 30,30 25,-40 -25,-40" fill="#222222" stroke="#000000" strokeWidth="2" />
              <line x1="-28" y1="20" x2="28" y2="20" stroke="#FFC700" strokeWidth="3" />
              <line x1="-27" y1="5" x2="27" y2="5" stroke="#FFC700" strokeWidth="3" />
              <line x1="-26" y1="-10" x2="26" y2="-10" stroke="#FFC700" strokeWidth="3" />
              <line x1="-25" y1="-25" x2="25" y2="-25" stroke="#FFC700" strokeWidth="3" />
              {/* Black Electronics Box with Red Gasket Trim */}
              <rect x="-32" y="-75" width="64" height="35" fill="#141414" stroke="#000000" strokeWidth="2" />
              <line x1="-32" y1="-42" x2="32" y2="-42" stroke="#E10600" strokeWidth="3" />
              {/* 4 Yellow Paddle Wheels */}
              <circle cx="-65" cy="15" r="14" fill="#FFC700" stroke="#000000" strokeWidth="2" />
              <circle cx="-65" cy="-5" r="14" fill="#FFC700" stroke="#000000" strokeWidth="2" />
              <circle cx="65" cy="15" r="14" fill="#FFC700" stroke="#000000" strokeWidth="2" />
              <circle cx="65" cy="-5" r="14" fill="#FFC700" stroke="#000000" strokeWidth="2" />
            </g>
          )}

          {currentProject.slug === 'nextnest' && (
            <g transform="translate(400, 360)">
              {/* 3 Database Cylinders Stack */}
              <ellipse cx="0" cy="40" rx="120" ry="40" fill="#0033A0" stroke="#000000" strokeWidth="3" />
              <ellipse cx="0" cy="20" rx="120" ry="40" fill="#0033A0" stroke="#000000" strokeWidth="3" />
              <ellipse cx="0" cy="0" rx="120" ry="40" fill="#0033A0" stroke="#000000" strokeWidth="3" />
              {/* House Cubes */}
              <polygon points="-70,-60 30,-110 30,-40 -70,10" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
              <polygon points="30,-110 90,-80 90,-10 30,-40" fill="#E5E5DF" stroke="#000000" strokeWidth="2" />
              {/* Door & Window */}
              <rect x="-40" y="-30" width="20" height="30" fill="#E10600" stroke="#000000" strokeWidth="2" />
              <rect x="45" y="-65" width="30" height="20" fill="#93C5FD" stroke="#000000" strokeWidth="2" />
              {/* Pitch Roof */}
              <polygon points="-20,-150 90,-80 30,-110" fill="#0033A0" stroke="#000000" strokeWidth="2" />
            </g>
          )}

          {currentProject.slug === 'govconnect' && (
            <g transform="translate(400, 360)">
              {/* City Blocks */}
              <polygon points="-90,-40 -40,-65 -40,-15 -90,10" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
              <polygon points="50,-80 95,-105 95,-45 50,-20" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
              {/* Government Headquarters with Columns & Pediment */}
              <polygon points="-30,-120 30,-150 30,-90 -30,-60" fill="#0033A0" stroke="#000000" strokeWidth="2" />
              <line x1="-20" y1="-60" x2="-20" y2="-100" stroke="#FFFFFF" strokeWidth="4" />
              <line x1="0" y1="-60" x2="0" y2="-100" stroke="#FFFFFF" strokeWidth="4" />
              <line x1="20" y1="-60" x2="20" y2="-100" stroke="#FFFFFF" strokeWidth="4" />
              <polygon points="-35,-120 0,-155 35,-120" fill="#0033A0" stroke="#000000" strokeWidth="2" />
              {/* Red Emergency Pin */}
              <circle cx="-70" cy="-70" r="14" fill="#E10600" stroke="#000000" strokeWidth="2" />
              <polygon points="-70,-40 -78,-60 -62,-60" fill="#E10600" stroke="#000000" strokeWidth="2" />
            </g>
          )}

          {currentProject.slug === 'vtol-drone' && (
            <g transform="translate(400, 330)">
              {/* High Aspect Ratio Carbon Wings */}
              <rect x="-140" y="-55" width="280" height="30" fill="#222222" stroke="#000000" strokeWidth="2" />
              {/* Yellow Flaps on Trailing Edge */}
              <rect x="-120" y="-30" width="55" height="12" fill="#FFC700" stroke="#000000" strokeWidth="1.5" />
              <rect x="65" y="-30" width="55" height="12" fill="#FFC700" stroke="#000000" strokeWidth="1.5" />
              {/* Aerodynamic Carbon Fuselage Pod */}
              <rect x="-20" y="-85" width="40" height="75" rx="14" fill="#222222" stroke="#000000" strokeWidth="2" />
              {/* SIGNATURE YELLOW DOME CANOPY HATCH with Center Seam */}
              <ellipse cx="0" cy="-55" rx="12" ry="24" fill="#FFC700" stroke="#000000" strokeWidth="2" />
              <line x1="0" y1="-79" x2="0" y2="-31" stroke="#000000" strokeWidth="1.5" />
              {/* Long Carbon Tail Boom */}
              <line x1="0" y1="-10" x2="0" y2="80" stroke="#000000" strokeWidth="4" />
              {/* Tail Assembly with Yellow Elevator */}
              <rect x="-45" y="70" width="90" height="12" fill="#222222" stroke="#000000" strokeWidth="2" />
              <rect x="-42" y="80" width="84" height="8" fill="#FFC700" stroke="#000000" strokeWidth="1.5" />
              <polygon points="0,55 8,72 -8,72" fill="#222222" stroke="#000000" strokeWidth="2" />
              {/* 4 Lift Rotors */}
              <circle cx="-75" cy="-70" r="14" fill="none" stroke="#E10600" strokeWidth="2" />
              <circle cx="75" cy="-70" r="14" fill="none" stroke="#E10600" strokeWidth="2" />
              <circle cx="-75" cy="-10" r="14" fill="none" stroke="#E10600" strokeWidth="2" />
              <circle cx="75" cy="-10" r="14" fill="none" stroke="#E10600" strokeWidth="2" />
            </g>
          )}
        </svg>
      </div>

      {/* 3. Footer Strip (6 Index Tabs) */}
      <div
        role="tablist"
        aria-label="Project stage index tabs fallback"
        className="border-t-2 border-ink bg-paper flex items-stretch divide-x-2 divide-ink overflow-x-auto select-none no-scrollbar"
      >
        {projects.map((proj, idx) => {
          const isActive = idx === activeIndex;
          const tabCatColor = CATEGORY_COLORS[proj.category] || '#0033A0';

          return (
            <button
              key={proj.slug}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              onClick={() => onSelectIndex(idx)}
              className={`flex-1 min-w-[130px] sm:min-w-[150px] px-3 py-2.5 flex flex-col justify-between text-left relative transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue ${
                isActive ? 'bg-paper font-bold' : 'bg-paper/70 hover:bg-paper/90 opacity-75 hover:opacity-100'
              }`}
            >
              {isActive && (
                <div
                  className="absolute top-0 left-0 right-0 h-[4px] z-10"
                  style={{ backgroundColor: tabCatColor }}
                />
              )}

              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-grey font-bold">
                  0{idx + 1}
                </span>
                <span
                  className="w-2 h-2 border border-ink"
                  style={{ backgroundColor: tabCatColor }}
                />
              </div>

              <div className="font-mono text-xs text-ink uppercase font-bold tracking-tight truncate">
                {proj.title}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
