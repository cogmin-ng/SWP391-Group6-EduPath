export const INITIAL_USER = {
  name: "Học viên",
  level: 12,
  currentXp: 620,
  maxXp: 1000,
  streakDays: 7,
  weekStreak: {
    T2: true,
    T3: true,
    T4: true,
    T5: true,
    T6: true,
    T7: true,
    CN: false,
  },
  isProUnlocked: false,
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

export const INITIAL_COURSES = [
  {
    id: "fullstack-web",
    title: "Fullstack Web Development",
    description:
      "Xây dựng web ứng dụng tối ưu từ frontend đến backend bằng React, Node.js & Express.",
    level: "Advanced",
    progress: 72,
    tutor: "Alex Johnson",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    isEnrolled: true,
    nodes: [
      {
        id: "node-env",
        label: "Thiết lập môi trường & Hello World",
        description:
          "Làm quen với Node.js, NPM, và thiết lập cấu trúc boilerplate đầu tiên.",
        completed: true,
        checklist: [
          {
            id: "fs-1",
            label: "Cài đặt Node.js LTS & npm",
            completed: true,
            xpValue: 10,
          },
          {
            id: "fs-2",
            label: "Tạo cấu hình package.json chuẩn",
            completed: true,
            xpValue: 15,
          },
          {
            id: "fs-3",
            label: "Viết server cơ bản sử dụng package http có sẵn",
            completed: true,
            xpValue: 20,
          },
        ],
      },
      {
        id: "express-basics",
        label: "Express.js Cơ Bản",
        description:
          "Học cách viết route, handle GET/POST request và sử dụng middleware lọc dữ liệu.",
        completed: true,
        checklist: [
          {
            id: "fs-4",
            label: "Cài đặt express & tsx",
            completed: true,
            xpValue: 15,
          },
          {
            id: "fs-5",
            label: "Thiết lập Express router và xử lý param / query",
            completed: true,
            xpValue: 20,
          },
          {
            id: "fs-6",
            label: "Sử dụng cors & body-parser middleware",
            completed: true,
            xpValue: 15,
          },
        ],
      },
      {
        id: "database-relations",
        label: "Cơ sở dữ liệu & Database Relations",
        description:
          "Khám phá SQLite & SQL queries, thiết lập bảng quan hệ và thực hiện câu lệnh join.",
        completed: true,
        checklist: [
          {
            id: "fs-7",
            label: "Thiết lập Database SQLite",
            completed: true,
            xpValue: 20,
          },
          {
            id: "fs-8",
            label: "Hoàn thành checklist 'Setup Database'",
            completed: true,
            xpValue: 15,
          },
          {
            id: "fs-9",
            label: "Viết SQL Query nhiều bảng quan hệ",
            completed: true,
            xpValue: 20,
          },
        ],
      },
      {
        id: "api-auth",
        label: "API & Authentication Security",
        description:
          "Triển khai hệ thống phân quyền, mã hóa mật khẩu bcrypt và sinh chữ ký JWT token.",
        completed: false,
        checklist: [
          {
            id: "fs-10",
            label: "Triển khai cơ chế hash mật khẩu bằng bcrypt",
            completed: true,
            xpValue: 25,
          },
          {
            id: "fs-11",
            label: "Viết middleware xác thực chữ ký JWT token",
            completed: false,
            xpValue: 30,
          },
          {
            id: "fs-12",
            label: "Làm bài quiz 'RESTful APIs - Quiz 1' đạt trên 80%",
            completed: false,
            xpValue: 25,
          },
          {
            id: "fs-13",
            label: "Xử lý refresh token an toàn với cookie httpOnly",
            completed: false,
            xpValue: 30,
          },
        ],
      },
      {
        id: "prod-deploy",
        label: "Đóng gói & Triển khai Cloud Run",
        description:
          "Build file Dockerfile tối ưu hóa tài nguyên và thiết lập kiểm định CI/CD tự động lên Cloud.",
        completed: false,
        checklist: [
          {
            id: "fs-14",
            label: "Tạo Dockerfile multi-stage tiết kiệm bộ nhớ",
            completed: false,
            xpValue: 25,
          },
          {
            id: "fs-15",
            label: "Cấu hình CI/CD thông qua Github Actions",
            completed: false,
            xpValue: 30,
          },
          {
            id: "fs-16",
            label: "Deploy lên môi trường Production của Cloud Run",
            completed: false,
            xpValue: 35,
          },
        ],
      },
    ],
  },
  {
    id: "uiux-masterclass",
    title: "UI/UX Design Masterclass",
    description:
      "Học tư duy thiết kế, trải nghiệm người dùng, sử dụng Figma đỉnh cao và làm Prototype.",
    level: "Intermediate",
    progress: 45,
    tutor: "Sarah Chen",
    image:
      "https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=800&q=80",
    isEnrolled: true,
    nodes: [
      {
        id: "user-research",
        label: "User Research & Persona",
        description:
          "Khảo sát hành vi người dùng, vẽ biểu đồ thói quen nhằm xác định Persona cụ thể.",
        completed: true,
        checklist: [
          {
            id: "ux-1",
            label: "Thực hiện phỏng vấn 5 khách hàng tiềm năng",
            completed: true,
            xpValue: 20,
          },
          {
            id: "ux-2",
            label: "Xây dựng 2 bản Persona khách hàng chuẩn hóa",
            completed: true,
            xpValue: 20,
          },
        ],
      },
      {
        id: "wireframing",
        label: "Wireframing & Grids",
        description:
          "Thiết kế layout dạng khung xương lo-fi, áp dụng quy chuẩn Layout Grids cân bằng tỷ lệ.",
        completed: false,
        checklist: [
          {
            id: "ux-3",
            label: "Vẽ phác thảo lo-fi wireframe trên tập giấy",
            completed: true,
            xpValue: 15,
          },
          {
            id: "ux-4",
            label: "Quy đổi wireframe lofi lên Figma với grid 8px",
            completed: false,
            xpValue: 20,
          },
          {
            id: "ux-5",
            label: "Nhận feedback cải thiện bộ cục bố trí màn hình",
            completed: false,
            xpValue: 15,
          },
        ],
      },
      {
        id: "figma-components",
        label: "Figma Component & Auto-Layout",
        description:
          "Làm chủ sức mạnh của Figma: Auto Layout nâng cao, Component Variants và Design System.",
        completed: false,
        checklist: [
          {
            id: "ux-6",
            label: "Xây dựng bảng mầu sắc & typography chuẩn",
            completed: false,
            xpValue: 25,
          },
          {
            id: "ux-7",
            label: "Tạo bộ nút nhấn (Button) có nhiều tương tác hover/click",
            completed: false,
            xpValue: 30,
          },
        ],
      },
    ],
  },
  {
    id: "python-data",
    title: "Python for Data Science",
    description:
      "Sử dụng ngôn ngữ Python làm chủ dữ liệu lớn thông qua thư viện NumPy, Pandas & Matplotlib.",
    level: "Beginner",
    progress: 28,
    tutor: "David Miller",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    isEnrolled: true,
    nodes: [
      {
        id: "py-fundamentals",
        label: "Cấu trúc dữ lịêu & Cú pháp Python",
        description:
          "Khai báo biến, mảng list, dict, viết hàm logic, xử lý vòng lặp for/while thông dụng.",
        completed: true,
        checklist: [
          {
            id: "py-1",
            label: "Nắm vững kiểu dữ liệu list, tuple, set, dict",
            completed: true,
            xpValue: 15,
          },
          {
            id: "py-2",
            label: "Sử dụng hàm map(), filter() và lambda",
            completed: true,
            xpValue: 15,
          },
          {
            id: "py-3",
            label: "Làm bài tập xử lý chuỗi và quản lý từ điển",
            completed: true,
            xpValue: 20,
          },
        ],
      },
      {
        id: "pandas-basics",
        label: "Trực quan dữ liệu với Pandas",
        description:
          "Đọc file CSV, Excel, nhóm dữ liệu groupby, kết nối và làm sạch các ô bị mờ nhạt (dropna).",
        completed: false,
        checklist: [
          {
            id: "py-4",
            label: "Import và đọc dữ liệu từ file csv mẫu",
            completed: true,
            xpValue: 15,
          },
          {
            id: "py-5",
            label: "Xử lý lọc các trường có dữ liệu Null",
            completed: false,
            xpValue: 20,
          },
          {
            id: "py-6",
            label: "Sử dụng hàm groupby để thống kê số lượng",
            completed: false,
            xpValue: 25,
          },
        ],
      },
    ],
  },
  {
    id: "devops-fundamentals",
    title: "DevOps Fundamentals",
    description:
      "Nhập môn thế giới DevOps: Quản trị hệ thống Linux, Docker containerization và CI/CD pipelines.",
    level: "Intermediate",
    progress: 60,
    tutor: "Emily White",
    image:
      "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80",
    isEnrolled: true,
    nodes: [
      {
        id: "linux-admin",
        label: "Hệ điều hành Linux căn bản",
        description:
          "Sử dụng terminal thành thạo, quản lý phân quyền file ssh, theo dõi tài nguyên RAM/CPU.",
        completed: true,
        checklist: [
          {
            id: "do-1",
            label: "Sử dụng dòng lệnh shell cơ bản ls, cd, rm",
            completed: true,
            xpValue: 15,
          },
          {
            id: "do-2",
            label: "Quản lý User & Phân quyền file bằng chmod/chown",
            completed: true,
            xpValue: 20,
          },
          {
            id: "do-3",
            label: "Kiểm tra CPU, RAM bằng htop và free -m",
            completed: true,
            xpValue: 15,
          },
        ],
      },
      {
        id: "docker-basics",
        label: "Docker Container hóa ứng dụng",
        description:
          "Cách đóng gói source code thành Image, chia sẻ lên DockerHub, chạy container cô lập an toàn.",
        completed: false,
        checklist: [
          {
            id: "do-4",
            label: "Viết file docker-compose.yml khởi tạo ứng dụng",
            completed: true,
            xpValue: 20,
          },
          {
            id: "do-5",
            label: "Cấu hình Docker Volumes để lưu trữ dữ liệu bền vững",
            completed: false,
            xpValue: 25,
          },
          {
            id: "do-6",
            label: "Mở port container và liên kết mạng bridge-network",
            completed: false,
            xpValue: 20,
          },
        ],
      },
    ],
  },
];

export const SUGGESTED_COURSES = [
  {
    id: "typescript-adv",
    title: "TypeScript Advanced",
    description:
      "Làm chủ Generics, Utility Types, Decorators, và kỹ thuật ép kiểu bảo vệ dữ liệu cực chất.",
    level: "Advanced",
    progress: 0,
    tutor: "Chris Hemsworth",
    image:
      "https://images.unsplash.com/photo-1516116211223-5c359a36298a?auto=format&fit=crop&w=800&q=80",
    isEnrolled: false,
    rating: 4.8,
    learners: "1.2k học viên",
    nodes: [
      {
        id: "ts-generic",
        label: "Generics nâng cao",
        description:
          "Xây dựng các interface, hàm động tự thích ứng kiểu dữ liệu.",
        completed: false,
        checklist: [],
      },
    ],
  },
  {
    id: "react-fundamentals",
    title: "React.js Fundamentals",
    description:
      "Nền tảng vững chắc cho người mới: React Hooks, State, Props, và cách quản lý vòng đời component.",
    level: "Beginner",
    progress: 0,
    tutor: "Taylor Swift",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    isEnrolled: false,
    rating: 4.7,
    learners: "3.4k học viên",
    nodes: [],
  },
  {
    id: "linux-basics",
    title: "Linux Command Line Basics",
    description:
      "Giải mã sự huyền bí của dòng lệnh Bash shell, viết shell script tự động hóa tác vụ chỉ trong 3 giờ.",
    level: "Beginner",
    progress: 0,
    tutor: "Linus Torvalds",
    image:
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80",
    isEnrolled: false,
    rating: 4.6,
    learners: "2.1k học viên",
    nodes: [],
  },
  {
    id: "docker-k8s",
    title: "Docker & Kubernetes Pro",
    description:
      "Học cách thiết kế hệ sinh thái container tự động scale, quản lý load balancer hiệu quả cao.",
    level: "Advanced",
    progress: 0,
    tutor: "Emily White",
    image:
      "https://images.unsplash.com/photo-1605745341112-85968b193355?auto=format&fit=crop&w=800&q=80",
    isEnrolled: false,
    rating: 4.9,
    learners: "1.8k học viên",
    nodes: [],
  },
];

export const INITIAL_BADGES = [
  {
    id: "badge-streak-7",
    title: "Consistent Learner",
    description:
      "Học tập liên tục đều đặn trong suốt 7 ngày vừa qua không ngắt quãng.",
    xpReward: 100,
    isUnlocked: true,
    iconName: "zap",
    unlockedDate: "Hôm nay",
  },
  {
    id: "badge-quiz-ace",
    title: "Thợ Săn Học Thuật",
    description:
      "Làm bài kiểm tra (Quiz) đạt số điểm tuyệt đối 100% trong lần đầu thử sức.",
    xpReward: 150,
    isUnlocked: true,
    iconName: "award",
  },
  {
    id: "badge-tip-approved",
    title: "Ngôi Sao Đóng Góp",
    description:
      "Có tối thiểu 1 Tip-trick công nghệ được hội đồng chuyên môn EduPath duyệt.",
    xpReward: 120,
    isUnlocked: true,
    iconName: "star",
  },
  {
    id: "badge-master-fullstack",
    title: "Docker Master Pro",
    description:
      "Hoàn tất toàn bộ các bài học và node thực chiến thuộc lộ trình DevOps.",
    xpReward: 300,
    isUnlocked: false,
    iconName: "shield",
  },
];

export const INITIAL_ACTIVITIES = [
  {
    id: "act-1",
    title: "Hoàn thành checklist 'Setup Database'",
    description:
      "Tiến trình Database Relations / SQLite của lộ trình Web Development",
    timeAgo: "2 giờ trước",
    xpGained: 10,
    iconType: "check",
  },
  {
    id: "act-2",
    title: "Làm quiz 'RESTful APIs - Quiz 1'",
    description: "Đạt số điểm cực cao 85% đúng mục tiêu",
    timeAgo: "5 giờ trước",
    xpGained: 20,
    iconType: "quiz",
  },
  {
    id: "act-3",
    title: "Tip-trick của bạn đã được duyệt",
    description:
      "Bài chia sẻ 'Mẹo tối ưu composite index trong SQL database' được đăng tải",
    timeAgo: "1 ngày trước",
    xpGained: 15,
    iconType: "tip",
  },
  {
    id: "act-4",
    title: "Tham gia lộ trình mới",
    description:
      "Được ghi danh thành công vào lộ trình 'UI/UX Design Masterclass'",
    timeAgo: "2 ngày trước",
    xpGained: 0,
    iconType: "join",
  },
];

export const INITIAL_CERTIFICATES = [
  {
    id: "cert-basic-js",
    courseTitle: "JavaScript Core Algorithms Foundations",
    issueDate: "2026-05-12",
    credentialId: "EDP-810A2B-91C",
    isUnlocked: true,
    tutor: "Alex Johnson",
  },
  {
    id: "cert-react-basics",
    courseTitle: "React.js Component Architecture Master",
    issueDate: "2026-05-20",
    credentialId: "EDP-492B10-85A",
    isUnlocked: true,
    tutor: "Taylor Swift",
  },
  {
    id: "cert-figma-pro",
    courseTitle: "Advanced Auto Layout and UI Kits in Figma",
    issueDate: "2026-05-25",
    credentialId: "EDP-112C88-99F",
    isUnlocked: true,
    tutor: "Sarah Chen",
  },
  {
    id: "cert-fullstack-dev",
    courseTitle: "Fullstack Web Architect Certificate",
    issueDate: "",
    credentialId: "EDP-TEMP-PENDING",
    isUnlocked: false,
    tutor: "Alex Johnson",
  },
];
