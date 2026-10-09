# Injabin Alam — Software Engineering Portfolio

> **High-performance full-stack systems and interactive 3D engineering portfolio built on authentic Bauhaus principles.**
> 
> 🌐 **Live Website**: [https://injabin.github.io](https://injabin.github.io) &nbsp;|&nbsp; 📄 **CV / Resume**: [Download PDF](https://injabin.github.io/resume.pdf) &bull; [Raw YAML](https://injabin.github.io/cv.yaml)

---

## 🏛️ Design Philosophy & Architectural System

This portfolio is built on the intersection of **rigorous computer systems engineering** and the **Dessau Bauhaus school (1919–1928)**:
- **Form Follows Function**: Every element serves an operational purpose. Pure primary color accents (Bauhaus Blue `#0033A0`, Bauhaus Red `#E10600`, Bauhaus Yellow `#FFC700`), strict 2px borders, zero arbitrary border-radius, and geometric sans-serif typography (Jost &amp; IBM Plex Mono).
- **Dual Visual Modes**:
  - **Light Theme**: Off-white exhibition paper (`#FAF8F5`) with crisp deep ink contours (`#0A0A0A`).
  - **Matte Dark Theme**: Relaxed matte charcoal (`#28282B`) canvas with graphite outlines, preserving optical legibility and contrast.
- **Physics & Motion**: Mechanical cubic-bezier easing (`cubic-bezier(0.7, 0, 0.2, 1)`) with zero-latency snap interactions and comprehensive `prefers-reduced-motion` compliance.

---

## ✨ Key Features & Technical Highlights

### 1. Interactive 3D Rubik's Cube (Hero Section)
- **Mathematical Solver Engine**: Full 26-cubie state machine tracking exact quaternion orientations and coordinate transformations across 3D rotation axes.
- **Authentic WCA Color Scheme**: Real-world color-accurate Rubik's cube sticker layout (White opposite Yellow, Blue opposite Green, Red opposite Orange).
- **Interactive Solvability**: Hovering triggers an autonomous reverse-scramble solver that animates the cube back to its home state with mathematical proof validation.

### 2. 3D Metaphor Vault (Featured Projects Stage)
- **Procedural 3D Exhibition Models**: Each featured project is represented by an intricate, hand-crafted procedural 3D model standing on an architectural plinth:
  - **AlgoArena**: 9x9 pathfinding maze with animated bidirectional wave fronts and search beacons.
  - **Nexus Stock AI**: 3D financial candlestick chart with animated trendlines and glowing momentum sparks.
  - **AquaSweep**: Autonomous aquaculture catamaran with rotating paddle wheels and hydrodynamic ripples.
  - **NextNest**: Multi-tier architectural villa with parametric lawn and database foundation.
  - **GovConnect**: Municipal civic grid with central headquarters, emergency beacon, and dispatch routes.
  - **VTOL Drone (CanSat)**: Fixed-wing aircraft airframe with parametric wings, NACA 4412 aerodynamic profile, and spinning motors.
- **Synchronized Spotlight**: Real-time overhead spotlight cone and ground pool that dynamically illuminates the active project while dimming neighboring plinths.

### 3. Case Study Deep-Dives
- **Drawer Modals**: Detailed architectural breakdowns for each project covering role, system architecture, engineering challenges, and quantitative outcomes.
- **Scroll Isolation**: Background scroll locking with buttery Lenis smooth scroll resumption on close.

### 4. Automated ATS-Compliant CV Pipeline
- **Canonical YAML Source**: Single source of truth at [`content/cv.yaml`](content/cv.yaml) tailored for the enterprise software and IT sector.
- **Playwright PDF Compiler**: Automated headless Chromium script (`scripts/generate-resume-pdf.mjs`) compiling an executive ATS-friendly vector PDF directly to [`public/resume.pdf`](public/resume.pdf).

---

## 🛠️ Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Framework & Runtime** | [Next.js 15 (App Router)](https://nextjs.org), [React 19](https://react.dev), [Node.js](https://nodejs.org) |
| **Language & Typing** | [TypeScript](https://www.typescriptlang.org) (Strict Mode, 100% typed) |
| **3D & Graphics** | [Three.js](https://threejs.org), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei) |
| **Styling & Design System** | [Tailwind CSS](https://tailwindcss.com), Custom Bauhaus design tokens |
| **State & Smooth Scroll** | [Zustand](https://github.com/pmndrs/zustand), [Lenis](https://github.com/darkroomengineering/lenis) |
| **Testing & Automation** | [Playwright](https://playwright.dev), ESLint, Next.js Compiler |

---

## 📁 Repository Directory Structure

```text
injabin.github.io/
├── app/                        # Next.js App Router root layout and pages
│   ├── globals.css             # Bauhaus design tokens, CSS variables, theme classes
│   ├── layout.tsx              # Root HTML layout, metadata, SEO configurations
│   └── page.tsx                # Single-page portfolio composite with all sections
├── components/                 # Modular component architecture
│   ├── layout/                 # Navigation bar, mobile menu drawer, footer
│   ├── scene/                  # Three.js 3D WebGL canvases & procedural objects
│   │   ├── RubiksCube/         # Real-world color-accurate Rubik's cube & math solver
│   │   ├── ProjectPlinths.tsx  # Featured 3D plinth models & spotlight system
│   │   ├── SkillBlocks.tsx     # Exploded isometric skill matrices
│   │   └── ExperienceSlabs.tsx # Interactive career timeline slabs
│   └── sections/               # Hero, About, Projects, Skills, Honors, Experience, Contact
├── content/                    # Structured content data & configuration
│   ├── cv.yaml                 # Canonical source-of-truth CV for IT & Software sector
│   ├── projects.ts             # Project specifications, repositories, and live links
│   ├── experience.ts           # Career roles and academic affiliations
│   └── skills.ts               # Core competencies, frameworks, and tools
├── public/                     # Static production assets
│   ├── resume.pdf              # Generated executive ATS-compliant resume PDF
│   ├── cv.yaml                 # Publicly downloadable structured YAML resume
│   ├── robots.txt              # Production search engine crawl directives
│   └── sitemap.xml             # Production XML sitemap
└── scripts/                    # Automation, PDF compilation, and visual proof suites
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `18.x` or higher
- npm `9.x` or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/ninja-bean/injabin.github.io.git
cd injabin.github.io

# Install dependencies
npm install
```

### Development
```bash
# Start the Next.js local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Linting
```bash
# Run code linting & static analysis
npm run lint

# Generate optimized static production bundle
npm run build

# Serve production build locally
npm run start
```

### Compiling the Resume PDF
```bash
# Rebuild resume.pdf directly from structured data using Playwright
node scripts/generate-resume-pdf.mjs
```

---

## 📬 Contact & Coordinates

- **Engineer**: Injabin Alam
- **Email**: [injabin29@gmail.com](mailto:injabin29@gmail.com)
- **LinkedIn**: [linkedin.com/in/injabin](https://linkedin.com/in/injabin)
- **GitHub**: [github.com/ninja-bean](https://github.com/ninja-bean)
- **HackerRank**: [hackerrank.com/profile/malam2330344](https://www.hackerrank.com/profile/malam2330344)

---

&copy; 2026 Injabin Alam &bull; All Rights Reserved. Built with precision and Bauhaus discipline.
