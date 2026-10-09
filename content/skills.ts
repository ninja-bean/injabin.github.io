export interface SkillItem {
  name: string;
  category: 'languages' | 'web' | 'ai' | 'hardware';
  relatedProjects?: string[]; // slug of related projects
}

export interface SkillGroup {
  id: 'languages' | 'web' | 'ai' | 'hardware';
  title: string;
  colorToken: 'ink' | 'blue' | 'yellow' | 'red';
  description: string;
  skills: SkillItem[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'languages',
    title: 'Languages',
    colorToken: 'ink',
    description: 'Core languages used across systems, web services, algorithms, and microcontrollers.',
    skills: [
      { name: 'TypeScript', category: 'languages', relatedProjects: ['algoarena', 'nexus-stock-ai'] },
      { name: 'JavaScript', category: 'languages', relatedProjects: ['algoarena', 'nexus-stock-ai'] },
      { name: 'Java', category: 'languages', relatedProjects: ['nextnest'] },
      { name: 'C++', category: 'languages', relatedProjects: ['aquasweep'] },
      { name: 'C', category: 'languages' },
      { name: 'Python', category: 'languages', relatedProjects: ['ml-model-comparison'] },
      { name: 'PHP', category: 'languages', relatedProjects: ['govconnect'] },
      { name: 'SQL', category: 'languages', relatedProjects: ['govconnect'] },
    ],
  },
  {
    id: 'web',
    title: 'Web & Systems',
    colorToken: 'blue',
    description: 'Full-stack engineering, responsive architectures, state management, and relational databases.',
    skills: [
      { name: 'Next.js (App Router)', category: 'web', relatedProjects: ['nexus-stock-ai', 'govconnect'] },
      { name: 'React', category: 'web', relatedProjects: ['algoarena', 'nexus-stock-ai'] },
      { name: 'Node.js', category: 'web', relatedProjects: ['aquasweep'] },
      { name: 'Three.js / WebGL', category: 'web', relatedProjects: ['algoarena'] },
      { name: 'Zustand', category: 'web', relatedProjects: ['algoarena'] },
      { name: 'Tailwind CSS', category: 'web', relatedProjects: ['algoarena', 'nexus-stock-ai'] },
      { name: 'MySQL', category: 'web', relatedProjects: ['govconnect'] },
      { name: 'REST APIs & WebSockets', category: 'web', relatedProjects: ['nexus-stock-ai', 'aquasweep'] },
    ],
  },
  {
    id: 'ai',
    title: 'AI & Data Systems',
    colorToken: 'yellow',
    description: 'Generative AI integration, data quality evaluation, algorithms, and confidential research.',
    skills: [
      { name: 'Gemini API Integration', category: 'ai', relatedProjects: ['nexus-stock-ai'] },
      { name: 'AI Data Quality & Evaluation', category: 'ai', relatedProjects: ['ml-model-comparison'] },
      { name: 'Algorithms & Heuristic Search', category: 'ai', relatedProjects: ['algoarena'] },
      { name: 'Applied ML Research (Confidential)', category: 'ai' },
      { name: 'Telemetry Streams & MQTT', category: 'ai', relatedProjects: ['aquasweep'] },
    ],
  },
  {
    id: 'hardware',
    title: 'Hardware & CAD',
    colorToken: 'red',
    description: 'Embedded microcontrollers, sensor integration, airframe design, and CAD modeling.',
    skills: [
      { name: 'ESP32 & Microcontrollers', category: 'hardware', relatedProjects: ['aquasweep'] },
      { name: 'Arduino', category: 'hardware' },
      { name: 'Fusion 360 (Parametric CAD)', category: 'hardware', relatedProjects: ['vtol-drone'] },
      { name: 'Airfoil & Aerodynamics (NACA 4412)', category: 'hardware', relatedProjects: ['vtol-drone'] },
      { name: 'Sensor Telemetry & Calibration', category: 'hardware', relatedProjects: ['aquasweep'] },
    ],
  },
];
