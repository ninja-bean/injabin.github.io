export interface ProjectLink {
  label: string;
  href: string;
}

export type ProjectCategory = 'software' | 'hardware' | 'ai';
export type ProjectObject = 'grid' | 'bars' | 'ripple' | 'house' | 'pin' | 'cross' | 'benchmark';

export interface Project {
  slug: string;
  title: string;
  year: number;
  status: 'shipped' | 'in-progress' | 'research';
  category: ProjectCategory;
  pitch: string;
  role: string;
  team?: string;
  award?: string;
  stack: string[];
  challenge: string;
  outcome: string;
  links: ProjectLink[];
  object: ProjectObject;
}

export const projects: Project[] = [
  {
    slug: 'algoarena',
    title: 'AlgoArena',
    year: 2025,
    status: 'shipped',
    category: 'software',
    pitch: '3D pathfinding visualizer where search algorithms race on the same maze.',
    role: 'Implemented bidirectional A*, bidirectional BFS, simulated annealing and hill climbing. Added multiple goal states with animation. Planned the UI with teammates.',
    team: 'Frontend & algorithmic engineering in a 3-person team',
    stack: ['React', 'TypeScript', 'Three.js', 'Zustand', 'Tailwind CSS'],
    challenge:
      'The first version supported a single goal, and every algorithm assumed it. Extending to multiple goals meant reworking how each algorithm decides when it is finished and how it scores progress. The hardest pieces were simulated annealing (choosing and cooling the temperature so it escapes local optima but still converges) and hill climbing (handling local maxima and plateaus), both adapted to multiple goal states.',
    outcome:
      'Engineered an interactive 3D web application providing deterministic real-time comparison across classical and heuristic pathfinding algorithms.',
    links: [
      { label: 'Live Application', href: 'https://algo-arena-sim.vercel.app/' },
      { label: 'GitHub Repository', href: 'https://github.com/xrayian/AlgoArena' },
    ],
    object: 'grid',
  },
  {
    slug: 'nexus-stock-ai',
    title: 'Nexus Stock AI',
    year: 2025,
    status: 'shipped',
    category: 'ai',
    pitch: 'Real-time market data with AI-assisted stock analysis.',
    role: "Full UI and planning. Scrum master: managed the team, reviewed members' PRs, assigned tasks.",
    team: 'Scrum Master & Lead Frontend, 4-person team',
    stack: ['Next.js', 'React', 'TypeScript', 'Gemini API', 'Tailwind CSS'],
    challenge:
      'Coordinating a multi-engineer team under tight delivery sprints: decomposing complex market data pipelines into structured tasks, reviewing PRs for API consistency and state integrity, and keeping everyone unblocked during financial API rate-limit debugging.',
    outcome:
      'Delivered a modular Next.js application that combines streaming market quotes with contextual generative insights via Google Gemini.',
    links: [
      { label: 'Live Dashboard', href: 'https://nexus-stock-ai.vercel.app/dashboard' },
      { label: 'GitHub Repository', href: 'https://github.com/ninja-bean/fintech-ai-swe-proj-next-js' },
    ],
    object: 'bars',
  },
  {
    slug: 'aquasweep',
    title: 'AquaSweep',
    year: 2024,
    status: 'shipped',
    category: 'hardware',
    pitch: 'Aquaculture monitoring: live telemetry, drone control, AI assistant, ESP32.',
    role: 'Full UI and planning. Partial backend (MQTT live data, with a teammate). Hardware: sensor setups and tuning.',
    team: 'Full-stack & Embedded Co-developer',
    award: '3rd runner-up, UIU CSE Project Show (microprocessor course)',
    stack: ['ESP32', 'MQTT', 'Web Dashboard', 'AI', 'C++', 'Node.js'],
    challenge:
      'Making hardware, telemetry data, and UI agree: sensor calibration and analog noise mitigation on the ESP32 under fluctuating water levels, real-time telemetry publication over MQTT, and building an operator dashboard that stays accurate without stale state.',
    outcome:
      'Won 3rd runner-up at the UIU CSE Project Show, demonstrating reliable end-to-end telemetry from physical sensors to web interface.',
    links: [
      { label: 'GitHub Repository', href: 'https://github.com/ninja-bean/AquaSweep' },
    ],
    object: 'ripple',
  },
  {
    slug: 'nextnest',
    title: 'NextNest',
    year: 2024,
    status: 'shipped',
    category: 'software',
    pitch: 'Real estate management and property listing platform with relational database engine.',
    role: 'Engineered relational database schema, SQL query optimization, and desktop architectural interface.',
    team: 'Full-stack Engineering Project',
    stack: ['Java', 'MySQL', 'Swing', 'JDBC', 'OOP Architecture'],
    challenge:
      'Structuring relational schemas for complex property-tenant mappings, optimizing transactional queries under concurrent updates, and engineering a responsive graphical workstation interface.',
    outcome:
      'Delivered an operational desktop property management system with persistent relational database transactions and multi-tier record management.',
    links: [
      { label: 'System Overview', href: '#experience' },
      { label: 'GitHub Profile', href: 'https://github.com/ninja-bean' },
    ],
    object: 'house',
  },
  {
    slug: 'govconnect',
    title: 'GovConnect',
    year: 2024,
    status: 'in-progress',
    category: 'software',
    pitch: 'Dhaka city management and emergency response system.',
    role: 'Built the entire original platform in PHP/MySQL; currently modernizing the architecture to Next.js as an independent project.',
    stack: ['PHP', 'MySQL', 'Next.js (in-progress)', 'TypeScript'],
    challenge:
      'Modeling emergency-response workflows and incident management queries in PHP and MySQL; now rearchitecting the relational structure for modern Next.js server actions and geospatial incident clustering.',
    outcome:
      'A proven civic reporting prototype serving as the foundation for an upcoming production Next.js rewrite.',
    links: [
      { label: 'GitHub Repository', href: 'https://github.com/ninja-bean/Gov_Connect-DhakaGird-' },
    ],
    object: 'pin',
  },
  {
    slug: 'vtol-drone',
    title: 'VTOL Drone (CanSat)',
    year: 2026,
    status: 'research',
    category: 'hardware',
    pitch: 'Fixed-wing VTOL drone airframe design and aerodynamic analysis.',
    role: 'Designed the complete drone airframe in CAD. Researched the NACA 4412 airfoil, aviation papers, and VTOL mechanics.',
    team: 'Airframe & Aerodynamics Researcher, UIU CanSat Team',
    stack: ['Fusion 360', 'Aerodynamics', 'NACA 4412 CAD', 'VTOL Mechanics'],
    challenge:
      'Evaluating airfoil profiles to achieve sufficient aerodynamic lift at low transition speeds while minimizing drag, and turning theoretical research into a buildable, structurally sound CAD airframe.',
    outcome:
      'Produced complete parametric 3D CAD models and structural assembly plans for the UIU CanSat aviation initiative.',
    links: [
      { label: 'CAD Research (Physical Airframe Prototype)', href: '#experience' },
    ],
    object: 'cross',
  },
];
