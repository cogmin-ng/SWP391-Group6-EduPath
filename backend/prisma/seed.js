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

  const subjects = [
    {
      name: 'SWP391',
      description: 'Software Project Management',
    },
    {
      name: 'PRJ301',
      description: 'Java Web Application Development',
    },
    {
      name: 'MAS291',
      description: 'Statistics and Probability',
    },
  ];

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { name: subject.name },
      update: {},
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
