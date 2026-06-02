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
  durationMinutes: 15,
  questions: [
    {
      id: 'q1',
      question: 'What is the primary purpose of the `useEffect` Hook in React?',
      options: [
        { id: 'A', label: 'To manage local component state across renders.' },
        { id: 'B', label: 'To perform side effects in functional components, such as data fetching or subscriptions.', isCorrect: true },
        { id: 'C', label: 'To directly manipulate the DOM before the browser paints the screen.' },
        { id: 'D', label: 'To optimize rendering performance by memoizing child components.' },
      ],
    },
    {
      id: 'q2',
      question: 'Which of the following is the correct way to declare a variable in JavaScript that cannot be reassigned?',
      options: [
        { id: 'A', label: 'let x = 10;' },
        { id: 'B', label: 'var x = 10;' },
        { id: 'C', label: 'const x = 10;', isCorrect: true },
        { id: 'D', label: 'static x = 10;' },
      ],
    },
    {
      id: 'q3',
      question: 'What does the `===` operator do in JavaScript?',
      options: [
        { id: 'A', label: 'Assigns a value to a variable.' },
        { id: 'B', label: 'Compares two values without type coercion.', isCorrect: true },
        { id: 'C', label: 'Compares two values with type coercion.' },
        { id: 'D', label: 'Checks if a property exists in an object.' },
      ],
    },
    {
      id: 'q4',
      question: 'Which method adds one or more elements to the end of an array and returns the new length?',
      options: [
        { id: 'A', label: 'push()', isCorrect: true },
        { id: 'B', label: 'pop()' },
        { id: 'C', label: 'shift()' },
        { id: 'D', label: 'unshift()' },
      ],
    },
    {
      id: 'q5',
      question: 'What is a Promise in JavaScript?',
      options: [
        { id: 'A', label: 'A function that executes immediately.' },
        { id: 'B', label: 'An object representing the eventual completion or failure of an asynchronous operation.', isCorrect: true },
        { id: 'C', label: 'A way to declare synchronous variables.' },
        { id: 'D', label: 'A debugging tool for tracking errors.' },
      ],
    },
    {
      id: 'q6',
      question: 'What does the `map()` method return?',
      options: [
        { id: 'A', label: 'A filtered subset of the original array.' },
        { id: 'B', label: 'A new array with each element transformed by the callback.', isCorrect: true },
        { id: 'C', label: 'A single reduced value.' },
        { id: 'D', label: 'The original array mutated in place.' },
      ],
    },
    {
      id: 'q7',
      question: 'Which keyword is used to handle asynchronous operations in a synchronous-like manner?',
      options: [
        { id: 'A', label: 'async/await', isCorrect: true },
        { id: 'B', label: 'try/catch' },
        { id: 'C', label: 'import/export' },
        { id: 'D', label: 'if/else' },
      ],
    },
    {
      id: 'q8',
      question: 'What is the output of `typeof null` in JavaScript?',
      options: [
        { id: 'A', label: '"null"' },
        { id: 'B', label: '"undefined"' },
        { id: 'C', label: '"object"', isCorrect: true },
        { id: 'D', label: '"boolean"' },
      ],
    },
    {
      id: 'q9',
      question: 'What does the spread operator (`...`) do when used with an object?',
      options: [
        { id: 'A', label: 'Deletes properties from the object.' },
        { id: 'B', label: 'Copies all enumerable properties from one object to another.', isCorrect: true },
        { id: 'C', label: 'Converts the object to an array.' },
        { id: 'D', label: 'Freezes the object to prevent modification.' },
      ],
    },
    {
      id: 'q10',
      question: 'Which of the following is a correct way to export a function from a module in ES6?',
      options: [
        { id: 'A', label: 'module.exports = myFunction;' },
        { id: 'B', label: 'export function myFunction() {}', isCorrect: true },
        { id: 'C', label: 'exports.myFunction = () => {};' },
        { id: 'D', label: 'define("myFunction", () => {});' },
      ],
    },
  ],
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
