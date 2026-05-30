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
