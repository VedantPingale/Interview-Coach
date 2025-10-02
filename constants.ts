
import { Domain } from './types';

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Interviews', path: '/interviews' },
  { name: 'Progress Tracker', path: '/progress' },
  { name: 'About', path: '/about' },
];

export const INTERVIEW_DOMAINS: Domain[] = [
  {
    name: 'Tech & Engineering',
    icon: 'fa-microchip',
    specializations: ['Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'DevOps Engineer', 'Data Scientist'],
  },
  {
    name: 'Business & Management',
    icon: 'fa-briefcase',
    specializations: ['Product Manager', 'Project Manager', 'Business Analyst', 'Marketing Manager', 'Sales Director'],
  },
  {
    name: 'Creativity & Communication',
    icon: 'fa-lightbulb',
    specializations: ['UI/UX Designer', 'Content Strategist', 'Public Relations', 'Technical Writer', 'Graphic Designer'],
  },
  {
    name: 'Specialized Fields',
    icon: 'fa-user-doctor',
    specializations: ['Healthcare Professional', 'Legal Advisor', 'Educator', 'Customer Support Rep', 'Government Official'],
  },
];

// Metrics used across analysis and charts
export const METRIC_NAMES = [
  'Technical Knowledge',
  'Problem Solving',
  'Communication',
  'Code Quality',
  'Industry Awareness',
  'Confidence',
] as const;

export const INTERVIEW_METRICS = [
  { name: 'Technical Knowledge', color: '#34D399' }, // emerald-400
  { name: 'Problem Solving', color: '#60A5FA' },      // blue-400
  { name: 'Communication', color: '#F472B6' },        // pink-400
  { name: 'Code Quality', color: '#A78BFA' },         // violet-400
  { name: 'Industry Awareness', color: '#F59E0B' },   // amber-500
  { name: 'Confidence', color: '#22D3EE' },           // cyan-400
];
