export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  category: 'software' | 'data' | 'competition' | 'research';
  badgeColor: 'blue' | 'yellow' | 'red';
  date: string;
  description: string;
  url?: string;
  tags: string[];
}

export const certifications: CertificationItem[] = [
  {
    id: 'hp-agile-pm',
    title: 'Agile Project Management',
    issuer: 'HP LIFE eLearning',
    category: 'software',
    badgeColor: 'blue',
    date: 'Certified May 2026',
    description:
      'Mastery of agile frameworks, sprint planning, backlog grooming, team velocity, and rapid workflow adaptation essential for modern software engineering environments.',
    url: 'https://www.life-global.org/certificate/ad9340ec-597d-4fe6-aefa-2aba6d14a017',
    tags: ['Agile', 'Scrum', 'Workflow Management', 'Sprint Planning'],
  },
  {
    id: 'hp-data-analytics',
    title: 'Data Science & Analytics',
    issuer: 'HP LIFE eLearning',
    category: 'data',
    badgeColor: 'yellow',
    date: 'Certified May 2026',
    description:
      'Rigorous foundation in exploratory data analysis, data extraction, statistical interpretation, predictive visualization, and data-driven computational decision making.',
    url: 'https://www.life-global.org/certificate/0b1d3e49-91ab-4dcc-a26d-05802eb87ce4',
    tags: ['Data Science', 'Analytics', 'Statistical Analysis', 'Decision Modeling'],
  },
  {
    id: 'uiu-physics-olympiad',
    title: 'University Physics Olympiad',
    issuer: 'UIU Physics Competition',
    category: 'competition',
    badgeColor: 'red',
    date: 'Accomplishment Certificate',
    description:
      'Participated in the UIU university-level Physics Competition as part of a team. Awarded an official accomplishment certificate for exceptional performance, physical problem solving, and teamwork.',
    url: 'https://github.com/xrayian/UPC2025_951B',
    tags: ['Physics Olympiad', 'Team Problem Solving', 'Analytical Mechanics', 'UPC 2025'],
  },
  {
    id: 'hackerrank-5-star',
    title: '5-Star Java Problem Solving',
    issuer: 'HackerRank',
    category: 'software',
    badgeColor: 'blue',
    date: 'Verified High-Tier Rank',
    description:
      'Verified high-tier badge on HackerRank demonstrating rigorous algorithm design, dynamic programming, and computational data structure proficiency.',
    url: 'https://www.hackerrank.com/profile/malam2330344',
    tags: ['Java', 'Algorithms', 'Data Structures', 'Problem Solving'],
  },
  {
    id: 'research-cybersecurity',
    title: 'Cybersecurity Incidents & Social Impacts',
    issuer: 'Research Preprint',
    category: 'research',
    badgeColor: 'yellow',
    date: 'Preprint Publication',
    description:
      'Academic research exploration investigating incident trends, vulnerability disclosures, and societal ramifications across digital infrastructure.',
    url: 'https://www.researchgate.net',
    tags: ['Cybersecurity', 'Research Preprint', 'Infrastructure Analysis'],
  },
  {
    id: 'applied-ml-research',
    title: 'Applied Machine Learning Research',
    issuer: 'Active Research Group',
    category: 'research',
    badgeColor: 'yellow',
    date: 'Active Investigation',
    description:
      'Currently doing early-stage applied machine learning research (details confidential).',
    tags: ['Applied ML', 'Early-Stage', 'Confidential'],
  },
];
