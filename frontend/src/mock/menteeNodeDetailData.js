// ============================================================
// Mock data for Mentee Node Details page
// All data is separated so components receive data via props.
// Replace each export with an API call in roadmapService.js later.
// ============================================================

/**
 * Roadmap-level information shown in the sidebar.
 */
export const mockRoadmap = {
  id: 'frontend-dev',
  title: 'Frontend Developer Roadmap',
  progress: 65, // percentage
  nodes: [
    { id: 'html-basics', title: 'HTML Basics', status: 'completed' },
    { id: 'css-fundamentals', title: 'CSS Fundamentals', status: 'completed' },
    {
      id: 'js-fundamentals',
      title: 'JavaScript Fundamentals',
      status: 'in-progress',
    },
    { id: 'react-basics', title: 'React Basics', status: 'locked' },
    { id: 'react-router', title: 'React Router', status: 'locked' },
    { id: 'state-management', title: 'State Management', status: 'locked' },
  ],
};

/**
 * Current node detail.
 */
export const mockNode = {
  id: 'js-fundamentals',
  title: 'JavaScript Fundamentals',
  description:
    'Học các kiến thức JavaScript nền tảng trước khi chuyển sang React. Master the building blocks of web interactivity.',
  nodeNumber: 3,
  totalNodes: 6,
  level: 'Beginner',
  estimatedHours: 8,
  mentorGuided: true,
  updatedAt: 'Oct 24',
};

/**
 * Checklist items for the current node.
 * `completed` is toggled locally by the mentee.
 */
export const mockChecklist = [
  { id: 'cl-1', title: 'Understand Variables & Types', completed: true },
  { id: 'cl-2', title: 'Functions & Scope', completed: true },
  { id: 'cl-3', title: 'Arrays & Iteration', completed: true },
  { id: 'cl-4', title: 'Objects & Prototypes', completed: false },
  { id: 'cl-5', title: 'DOM Manipulation Basics', completed: false },
];

/**
 * Learning materials attached to the node.
 * `type` values: VIDEO | ARTICLE | DOCUMENTATION
 */
export const mockMaterials = [
  {
    id: 'mat-1',
    title: 'JavaScript Introduction',
    type: 'VIDEO',
    buttonLabel: 'Watch',
    url: '#',
  },
  {
    id: 'mat-2',
    title: 'JS Fundamentals Read',
    type: 'ARTICLE',
    buttonLabel: 'Read',
    url: '#',
  },
  {
    id: 'mat-3',
    title: 'MDN JavaScript Guide',
    type: 'DOCUMENTATION',
    buttonLabel: 'Open',
    url: '#',
  },
];

/**
 * Quiz data for the node. Each node has exactly 1 quiz.
 */
export const mockQuiz = {
  id: 'quiz-js-basics',
  title: 'JavaScript Basics Quiz',
  questionCount: 15,
  durationMinutes: 15,
};

/**
 * Tips & tricks shared by the community.
 */
export const mockTips = [
  {
    id: 'tip-1',
    content: "Don't memorize syntax, understand the essence.",
  },
  {
    id: 'tip-2',
    content: 'Do exercises immediately after reading a concept.',
  },
  {
    id: 'tip-3',
    content: 'Use Browser DevTools frequently for debugging.',
  },
];
