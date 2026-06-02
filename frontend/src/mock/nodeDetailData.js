export const nodeDetail = {
  id: 1,
  title: 'Backend Development',
  description: 'Học ExpressJS, Prisma, PostgreSQL và Authentication.',
  category: 'Backend',
  nodeNumber: 2,
  totalNodes: 3,
};

export const checklistItems = [
  {
    id: 1,
    title: 'Hiểu ExpressJS',
    completed: true,
  },
  {
    id: 2,
    title: 'Hiểu Middleware',
    completed: true,
  },
  {
    id: 3,
    title: 'Kết nối PostgreSQL với Prisma',
    completed: false,
  },
];

export const materials = [
  {
    id: 1,
    title: 'ExpressJS Crash Course',
    type: 'VIDEO',
    duration: '45 MINS',
    description: 'A comprehensive introduction to building RESTful APIs with Express.',
    icon: 'Play',
  },
  {
    id: 2,
    title: 'Prisma Official Docs',
    type: 'DOCUMENTATION',
    description: 'Reference guide for Prisma ORM schema and client usage.',
    icon: 'BookOpen',
  },
];

export const tips = [
  {
    id: 1,
    title: 'Luôn tách Controller và Service để code dễ bảo trì và dễ viết unit test hơn.',
    icon: 'Lightbulb',
  },
  {
    id: 2,
    title: 'Đừng bao giờ lưu mật khẩu dưới dạng plain-text, hãy sử dụng thư viện bcrypt để hash.',
    icon: 'Lock',
  },
];

export const quizzes = [
  {
    id: 1,
    question: 'JWT (JSON Web Token) chủ yếu được sử dụng để làm gì?',
    options: [
      {
        id: 'a',
        label: 'Mã hóa mật khẩu người dùng',
      },
      {
        id: 'b',
        label: 'Xác thực và ủy quyền an toàn giữa các bên',
        isCorrect: true,
      },
      {
        id: 'c',
        label: 'Lưu trữ dữ liệu session trên server',
      },
      {
        id: 'd',
        label: 'Thêm lựa chọn...',
      },
    ],
    selectedAnswer: 'b',
    explanation: 'JWT là token dùng để xác thực người dùng.',
  },
];
