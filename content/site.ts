export interface SiteConfig {
  name: string;
  role: string;
  headline: string;
  subline: string;
  email: string;
  github: {
    username: string;
    url: string;
  };
  linkedin: {
    username: string;
    url: string;
  };
  hackerRank: {
    title: string;
    url: string;
  };
  researchGate: {
    title: string;
    url: string;
  };
  confidentialResearch: string;
}

export const siteConfig: SiteConfig = {
  name: 'Injabin Alam',
  role: 'Software Engineer',
  headline: 'Software engineer. Full-stack and backend systems, built end to end.',
  subline:
    'CSE student at United International University, Dhaka. I plan, build and ship software with teams, and I also work with hardware when a project needs it. Open to software engineering internships and junior roles.',
  email: 'injabin29@gmail.com',
  github: {
    username: 'ninja-bean',
    url: 'https://github.com/ninja-bean',
  },
  linkedin: {
    username: 'injabin',
    url: 'https://linkedin.com/in/injabin',
  },
  hackerRank: {
    title: '5-Star Java Problem Solving',
    url: 'https://www.hackerrank.com/profile/malam2330344',
  },
  researchGate: {
    title: 'Cybersecurity Incidents and Their Social Impacts',
    url: 'https://www.researchgate.net',
  },
  confidentialResearch:
    'Currently doing early-stage applied machine learning research (details confidential).',
};
