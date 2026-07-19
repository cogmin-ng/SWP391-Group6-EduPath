const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });
const prisma = require('../src/lib/prisma');

async function main() {
  const password = 'password123';
  const passwordHash = await bcrypt.hash(password, 10);

  const roleNames = ['MENTEE', 'MENTOR', 'ADMIN'];

  const roles = {};
  for (const name of roleNames) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    roles[name] = role;
  }

  const mathematics = await prisma.subjectCategory.upsert({
    where: { name: 'Mathematics' },
    update: {},
    create: {
      name: 'Mathematics',
      description: 'Mathematics related subjects',
    },
  });

  const backendDevelopment = await prisma.subjectCategory.upsert({
    where: { name: 'Backend Development' },
    update: {},
    create: {
      name: 'Backend Development',
      description: 'Backend programming subjects',
    },
  });

  const fullStackProject = await prisma.subjectCategory.upsert({
    where: { name: 'Full-Stack Project' },
    update: {},
    create: {
      name: 'Full-Stack Project',
      description: 'Project and software engineering subjects',
    },
  });

  // Seed majors / specializations
  const majorsSeed = [
    { name: 'Công nghệ thông tin', description: 'Information Technology' },
    { name: 'Khoa học máy tính', description: 'Computer Science' },
    { name: 'Công nghệ truyền thông', description: 'Communication Technology' },
    { name: 'Quản trị kinh doanh', description: 'Business Administration' },
    { name: 'Ngôn ngữ', description: 'Languages' },
  ];

  for (const m of majorsSeed) {
    await prisma.major.upsert({
      where: { name: m.name },
      update: { description: m.description, isDeleted: false },
      create: m,
    });
  }

  const subjects = [
    {
      name: 'MAS291',
      description: 'Statistics and Probability',
      categoryId: mathematics.id,
    },
    {
      name: 'MAS101',
      description: 'Calculus',
      categoryId: mathematics.id,
    },
    {
      name: 'PRJ301',
      description: 'Java Web Application Development',
      categoryId: backendDevelopment.id,
    },
    {
      name: 'SWP391',
      description: 'Software Project Management',
      categoryId: fullStackProject.id,
    },
  ];

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { name: subject.name },
      update: {
        description: subject.description,
        categoryId: subject.categoryId,
      },
      create: subject,
    });
  }

  for (const name of roleNames) {
    const email = `${name.toLowerCase()}@example.com`;
    await prisma.user.upsert({
      where: { email },
      update: {
        name,
        passwordHash,
        isVerified: true,
        role: {
          connect: { id: roles[name].id },
        },
      },
      create: {
        email,
        name,
        passwordHash,
        isVerified: true,
        role: {
          connect: { id: roles[name].id },
        },
      },
    });
  }

  const defaultBadges = [
    {
      id: 'badge-xp-beginner',
      title: 'Beginner',
      description: 'Đạt mốc 100 XP đầu tiên trên hành trình học tập.',
      xpReward: 0,
      iconName: 'zap',
      badgeType: 'XP',
      unlockThreshold: 100,
    },
    {
      id: 'badge-xp-fast-learner',
      title: 'Fast Learner',
      description: 'Đạt 300 XP và duy trì nhịp học đều đặn.',
      xpReward: 0,
      iconName: 'award',
      badgeType: 'XP',
      unlockThreshold: 300,
    },
    {
      id: 'badge-xp-dedicated-learner',
      title: 'Dedicated Learner',
      description: 'Đạt 500 XP và thể hiện sự kiên trì trong học tập.',
      xpReward: 0,
      iconName: 'star',
      badgeType: 'XP',
      unlockThreshold: 500,
    },
    {
      id: 'badge-xp-master',
      title: 'XP Master',
      description: 'Đạt 1000 XP và trở thành người học bền bỉ nổi bật.',
      xpReward: 0,
      iconName: 'shield',
      badgeType: 'XP',
      unlockThreshold: 1000,
    },
    {
      id: 'badge-first-step',
      title: 'First Step',
      description: 'Hoàn thành node đầu tiên của bạn.',
      xpReward: 0,
      iconName: 'zap',
      badgeType: 'ACHIEVEMENT',
      unlockThreshold: null,
    },
    {
      id: 'badge-path-finisher',
      title: 'Path Finisher',
      description: 'Hoàn thành learning path đầu tiên.',
      xpReward: 0,
      iconName: 'shield',
      badgeType: 'ACHIEVEMENT',
      unlockThreshold: null,
    },
    {
      id: 'badge-contributor',
      title: 'Contributor',
      description: 'Có ít nhất 1 tip được mentor duyệt.',
      xpReward: 0,
      iconName: 'star',
      badgeType: 'ACHIEVEMENT',
      unlockThreshold: null,
    },
    {
      id: 'badge-quiz-ace',
      title: 'Quiz Ace',
      description: 'Đạt 100% điểm quiz ngay ở lần thử đầu tiên.',
      xpReward: 0,
      iconName: 'award',
      badgeType: 'ACHIEVEMENT',
      unlockThreshold: null,
    },
  ];

  await prisma.badge.updateMany({
    where: {
      id: {
        notIn: defaultBadges.map((badge) => badge.id),
      },
    },
    data: {
      isDeleted: true,
    },
  });

  for (const badge of defaultBadges) {
    await prisma.badge.upsert({
      where: { id: badge.id },
      update: {
        title: badge.title,
        description: badge.description,
        xpReward: badge.xpReward,
        iconName: badge.iconName,
        badgeType: badge.badgeType,
        unlockThreshold: badge.unlockThreshold,
        isDeleted: false,
      },
      create: badge,
    });
  }

  const mentorProfiles = [
    {
      name: 'Sarah J.',
      email: 'sarah.j@example.com',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    },
    {
      name: 'Marcus K.',
      email: 'marcus.k@example.com',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    },
    {
      name: 'Alex L.',
      email: 'alex.l@example.com',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    },
    {
      name: 'Ria D.',
      email: 'ria.d@example.com',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    },
    {
      name: 'Steve M.',
      email: 'steve.m@example.com',
      avatar:
        'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop',
    },
    {
      name: 'Elena C.',
      email: 'elena.c@example.com',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    },
  ];

  const mentors = {};
  for (const profile of mentorProfiles) {
    const mentor = await prisma.user.upsert({
      where: { email: profile.email },
      update: {
        name: profile.name,
        passwordHash,
        avatar: profile.avatar,
        isVerified: true,
        role: {
          connect: { id: roles.MENTOR.id },
        },
      },
      create: {
        email: profile.email,
        name: profile.name,
        passwordHash,
        avatar: profile.avatar,
        isVerified: true,
        role: {
          connect: { id: roles.MENTOR.id },
        },
      },
    });

    mentors[profile.name] = mentor;
  }

  // Set up details for all mentors in the database
  const mentorDetails = {
    MENTOR: {
      specialization: 'UI/UX Design',
      currentSemester: 'Đã tốt nghiệp',
      bio: 'Chuyên gia về Chiến lược Sản phẩm và UI/UX với hơn 10 năm kinh nghiệm dẫn dắt các đội ngũ thiết kế tại các tập đoàn công nghệ hàng đầu toàn cầu.',
      subjects: ['SWP391', 'PRJ301'],
    },
    'Sarah J.': {
      specialization: 'Backend Development & Statistics',
      currentSemester: 'Đã tốt nghiệp',
      bio: 'Chuyên gia Java Web và Khoa học Dữ liệu. Có 8 năm kinh nghiệm giảng dạy và xây dựng hệ thống quy mô lớn.',
      subjects: ['PRJ301', 'MAS291'],
    },
    'Marcus K.': {
      specialization: 'API Design & Data Science',
      currentSemester: 'Đã tốt nghiệp',
      bio: 'Kỹ sư API và chuyên gia thiết kế hệ thống phân tán. Đam mê chia sẻ kiến thức về RESTful API và xác suất ứng dụng.',
      subjects: ['PRJ301', 'MAS291'],
    },
    'Alex L.': {
      specialization: 'Agile Delivery & DevOps',
      currentSemester: 'Đã tốt nghiệp',
      bio: 'Chuyên gia Agile Coach và Quản lý dự án phần mềm. Hơn 6 năm dẫn dắt các dự án phát triển phần mềm linh hoạt.',
      subjects: ['SWP391'],
    },
    'Ria D.': {
      specialization: 'Software Engineering & Capstone Mentor',
      currentSemester: 'Đã tốt nghiệp',
      bio: 'Hơn 5 năm kinh nghiệm quản lý dự án Capstone và tư vấn kiến trúc phần mềm cho các đội ngũ sinh viên.',
      subjects: ['SWP391'],
    },
    'Steve M.': {
      specialization: 'Database Systems & Quantitative Engineering',
      currentSemester: 'Đã tốt nghiệp',
      bio: 'Chuyên gia cơ sở dữ liệu và kỹ thuật định lượng. Nhiều năm kinh nghiệm tối ưu hóa SQL và thiết kế kiến trúc DB.',
      subjects: ['PRJ301', 'MAS291'],
    },
    'Elena C.': {
      specialization: 'Software Project Management',
      currentSemester: 'Đã tốt nghiệp',
      bio: 'Giảng viên và chuyên gia tư vấn Quản lý dự án phần mềm theo tiêu chuẩn PMI. Hướng dẫn lập kế hoạch và phân tích yêu cầu.',
      subjects: ['SWP391'],
    },
  };

  const subjectRecordsForMapping = await prisma.subject.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  const subjectByNameForMapping = Object.fromEntries(
    subjectRecordsForMapping.map((subject) => [subject.name, subject])
  );

  // Update generic MENTOR user bio and avatar if needed
  const genericMentorUser = await prisma.user.findUnique({
    where: { email: 'mentor@example.com' },
  });

  if (genericMentorUser) {
    await prisma.user.update({
      where: { id: genericMentorUser.id },
      data: {
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      },
    });
  }

  const allMentorsForApp = {
    ...mentors,
    MENTOR: genericMentorUser,
  };

  for (const name of Object.keys(mentorDetails)) {
    const details = mentorDetails[name];
    const user = allMentorsForApp[name];
    if (!user) continue;

    // Update bio in User table
    await prisma.user.update({
      where: { id: user.id },
      data: { bio: details.bio },
    });

    // Check if AdvisorApplication exists
    let app = await prisma.advisorApplication.findFirst({
      where: { userId: user.id, isDeleted: false },
    });

    if (app) {
      app = await prisma.advisorApplication.update({
        where: { id: app.id },
        data: {
          specialization: details.specialization,
          currentSemester: details.currentSemester,
          bio: details.bio,
          status: 'APPROVED',
        },
      });
    } else {
      app = await prisma.advisorApplication.create({
        data: {
          userId: user.id,
          specialization: details.specialization,
          currentSemester: details.currentSemester,
          bio: details.bio,
          status: 'APPROVED',
        },
      });
    }

    // Update subjects
    await prisma.advisorSubject.deleteMany({
      where: { advisorApplicationId: app.id },
    });

    for (const subName of details.subjects) {
      const subject = subjectByNameForMapping[subName];
      if (subject) {
        await prisma.advisorSubject.create({
          data: {
            advisorApplicationId: app.id,
            subjectId: subject.id,
          },
        });
      }
    }
  }

  const subjectRecords = await prisma.subject.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const subjectByName = Object.fromEntries(
    subjectRecords.map((subject) => [subject.name, subject])
  );

  const learningPaths = [
    {
      title: 'Java Web Application Development Bootcamp',
      description:
        'Build production-ready Java web applications with MVC structure, persistence, and deployment fundamentals.',
      thumbnail:
        'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80',
      status: 'PUBLISHED',
      isPublic: true,
      xpReward: 320,
      mentorId: mentors['Sarah J.'].id,
      subjectId: subjectByName.PRJ301.id,
    },
    {
      title: 'REST API Design with Node and Express',
      description:
        'Learn to model resources, secure endpoints, and ship clean REST APIs for real product workflows.',
      thumbnail:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80',
      status: 'PUBLISHED',
      isPublic: true,
      xpReward: 260,
      mentorId: mentors['Marcus K.'].id,
      subjectId: subjectByName.PRJ301.id,
    },
    {
      title: 'Database Integration for Backend Systems',
      description:
        'Design practical schemas, write efficient queries, and integrate relational databases into backend services.',
      thumbnail:
        'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1600&q=80',
      status: 'DRAFT',
      isPublic: false,
      xpReward: 280,
      mentorId: mentors['Steve M.'].id,
      subjectId: subjectByName.PRJ301.id,
    },
    {
      title: 'Software Project Management Essentials',
      description:
        'Understand scope, planning, team coordination, and delivery practices for software project execution.',
      thumbnail:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
      status: 'PUBLISHED',
      isPublic: true,
      xpReward: 180,
      mentorId: mentors['Elena C.'].id,
      subjectId: subjectByName.SWP391.id,
    },
    {
      title: 'Agile Delivery for Student Teams',
      description:
        'Run team-based software delivery with lightweight agile practices that fit academic project settings.',
      thumbnail:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80',
      status: 'PUBLISHED',
      isPublic: true,
      xpReward: 220,
      mentorId: mentors['Alex L.'].id,
      subjectId: subjectByName.SWP391.id,
    },
    {
      title: 'Capstone Planning and Execution',
      description:
        'Prepare for capstone delivery with milestone planning, ownership boundaries, quality control, and presentation readiness.',
      thumbnail:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
      status: 'DRAFT',
      isPublic: false,
      xpReward: 300,
      mentorId: mentors['Ria D.'].id,
      subjectId: subjectByName.SWP391.id,
    },
    {
      title: 'Statistics and Probability Foundations',
      description:
        'Build confidence with distributions, inference, and core probability concepts used in engineering and analytics.',
      thumbnail:
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1600&q=80',
      status: 'PUBLISHED',
      isPublic: true,
      xpReward: 210,
      mentorId: mentors['Sarah J.'].id,
      subjectId: subjectByName.MAS291.id,
    },
    {
      title: 'Applied Probability for Data Analysis',
      description:
        'Use practical probability and statistical reasoning to frame uncertainty in data-driven problem solving.',
      thumbnail:
        'https://images.unsplash.com/photo-1518186233392-c232efbf2373?auto=format&fit=crop&w=1600&q=80',
      status: 'PUBLISHED',
      isPublic: true,
      xpReward: 240,
      mentorId: mentors['Marcus K.'].id,
      subjectId: subjectByName.MAS291.id,
    },
    {
      title: 'Quantitative Thinking for Engineers',
      description:
        'Train the problem-solving habits engineers need when estimating, validating, and modeling technical decisions.',
      thumbnail:
        'https://images.unsplash.com/photo-1509869175650-a1d97972541a?auto=format&fit=crop&w=1600&q=80',
      status: 'DRAFT',
      isPublic: false,
      xpReward: 170,
      mentorId: mentors['Steve M.'].id,
      subjectId: subjectByName.MAS291.id,
    },
  ];

  for (const learningPath of learningPaths) {
    const existing = await prisma.learningPath.findFirst({
      where: {
        title: learningPath.title,
        mentorId: learningPath.mentorId,
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.learningPath.update({
        where: { id: existing.id },
        data: learningPath,
      });
      continue;
    }

    await prisma.learningPath.create({
      data: learningPath,
    });
  }

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
