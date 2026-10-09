export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  startDate: string;
  endDate: string;
  description: string;
  tags: string[];
}

export const experiences: ExperienceItem[] = [
  {
    id: 'outlier',
    role: 'AI Data Contributor',
    organization: 'Outlier',
    period: 'Sep 2026 – Present',
    startDate: '2026-09',
    endDate: 'Present',
    description:
      'Evaluate and compare visual and multilingual content against detailed quality guidelines. Work requires consistency, precise written feedback, and following changing specifications.',
    tags: ['Quality Guidelines', 'Data Evaluation', 'Multilingual Analysis'],
  },
  {
    id: 'uiu-cansat',
    role: 'Intern (Airframe & CAD)',
    organization: 'UIU CanSat Team',
    period: 'Aug 2025 – Aug 2026',
    startDate: '2025-08',
    endDate: '2026-08',
    description:
      'Designed the complete airframe of a fixed-wing VTOL drone in CAD. Researched aviation and VTOL design in depth, including the NACA 4412 airfoil and published papers related to the project.',
    tags: ['Fusion 360', 'VTOL Airframe', 'NACA 4412', 'Aviation Research'],
  },
  {
    id: 'uiu-app-forum',
    role: 'General Member',
    organization: 'UIU App Forum',
    period: 'Oct 2023 – Jan 2026',
    startDate: '2023-10',
    endDate: '2026-01',
    description:
      'Collaborated on software development sessions, team workshops, and student engineering exhibitions, contributing to web and mobile prototyping.',
    tags: ['Software Engineering', 'Team Workshops', 'Community Prototyping'],
  },
  {
    id: 'uiu-education',
    role: 'B.Sc. in Computer Science & Engineering',
    organization: 'United International University, Dhaka',
    period: '2022 – Present',
    startDate: '2022-10',
    endDate: 'Present',
    description:
      'Pursuing undergraduate studies with strong emphasis on full-stack systems, backend engineering, data structures, algorithms, and microprocessors.',
    tags: ['Data Structures', 'Algorithms', 'Databases', 'Microprocessors'],
  },
];
