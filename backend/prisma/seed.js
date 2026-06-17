const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

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


  const subjects = [
    {
      name: 'MAS291',
      description: 'Statistics and Probability',
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
        role: {
          connect: { id: roles[name].id },
        },
      },
      create: {
        email,
        name,
        passwordHash,
        role: {
          connect: { id: roles[name].id },
        },
      },
    });
  }

  const mentorProfiles = [
    { name: 'Sarah J.', email: 'sarah.j@example.com' },
    { name: 'Marcus K.', email: 'marcus.k@example.com' },
    { name: 'Alex L.', email: 'alex.l@example.com' },
    { name: 'Ria D.', email: 'ria.d@example.com' },
    { name: 'Steve M.', email: 'steve.m@example.com' },
    { name: 'Elena C.', email: 'elena.c@example.com' },
  ];

  const mentors = {};
  for (const profile of mentorProfiles) {
    const mentor = await prisma.user.upsert({
      where: { email: profile.email },
      update: {
        name: profile.name,
        passwordHash,
        role: {
          connect: { id: roles.MENTOR.id },
        },
      },
      create: {
        email: profile.email,
        name: profile.name,
        passwordHash,
        role: {
          connect: { id: roles.MENTOR.id },
        },
      },
    });

    mentors[profile.name] = mentor;
  }

  const subjectRecords = await prisma.subject.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const subjectByName = Object.fromEntries(subjectRecords.map((subject) => [subject.name, subject]));

  const learningPaths = [
    {
      title: 'Java Web Application Development Bootcamp',
      description: 'Build production-ready Java web applications with MVC structure, persistence, and deployment fundamentals.',
      thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80',
      status: 'PUBLISHED',
      isPublic: true,
      xpReward: 320,
      mentorId: mentors['Sarah J.'].id,
      subjectId: subjectByName.PRJ301.id,
    },
    {
      title: 'REST API Design with Node and Express',
      description: 'Learn to model resources, secure endpoints, and ship clean REST APIs for real product workflows.',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80',
      status: 'PUBLISHED',
      isPublic: true,
      xpReward: 260,
      mentorId: mentors['Marcus K.'].id,
      subjectId: subjectByName.PRJ301.id,
    },
    {
      title: 'Database Integration for Backend Systems',
      description: 'Design practical schemas, write efficient queries, and integrate relational databases into backend services.',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1600&q=80',
      status: 'DRAFT',
      isPublic: false,
      xpReward: 280,
      mentorId: mentors['Steve M.'].id,
      subjectId: subjectByName.PRJ301.id,
    },
    {
      title: 'Software Project Management Essentials',
      description: 'Understand scope, planning, team coordination, and delivery practices for software project execution.',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
      status: 'PUBLISHED',
      isPublic: true,
      xpReward: 180,
      mentorId: mentors['Elena C.'].id,
      subjectId: subjectByName.SWP391.id,
    },
    {
      title: 'Agile Delivery for Student Teams',
      description: 'Run team-based software delivery with lightweight agile practices that fit academic project settings.',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80',
      status: 'PUBLISHED',
      isPublic: true,
      xpReward: 220,
      mentorId: mentors['Alex L.'].id,
      subjectId: subjectByName.SWP391.id,
    },
    {
      title: 'Capstone Planning and Execution',
      description: 'Prepare for capstone delivery with milestone planning, ownership boundaries, quality control, and presentation readiness.',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
      status: 'DRAFT',
      isPublic: false,
      xpReward: 300,
      mentorId: mentors['Ria D.'].id,
      subjectId: subjectByName.SWP391.id,
    },
    {
      title: 'Statistics and Probability Foundations',
      description: 'Build confidence with distributions, inference, and core probability concepts used in engineering and analytics.',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1600&q=80',
      status: 'PUBLISHED',
      isPublic: true,
      xpReward: 210,
      mentorId: mentors['Sarah J.'].id,
      subjectId: subjectByName.MAS291.id,
    },
    {
      title: 'Applied Probability for Data Analysis',
      description: 'Use practical probability and statistical reasoning to frame uncertainty in data-driven problem solving.',
      thumbnail: 'https://images.unsplash.com/photo-1518186233392-c232efbf2373?auto=format&fit=crop&w=1600&q=80',
      status: 'PUBLISHED',
      isPublic: true,
      xpReward: 240,
      mentorId: mentors['Marcus K.'].id,
      subjectId: subjectByName.MAS291.id,
    },
    {
      title: 'Quantitative Thinking for Engineers',
      description: 'Train the problem-solving habits engineers need when estimating, validating, and modeling technical decisions.',
      thumbnail: 'https://images.unsplash.com/photo-1509869175650-a1d97972541a?auto=format&fit=crop&w=1600&q=80',
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
