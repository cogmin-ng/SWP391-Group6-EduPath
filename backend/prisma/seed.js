const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {

  // tạo role USER nếu chưa có
  const userRole = await prisma.role.upsert({
    where: {
      name: 'USER'
    },
    update: {},
    create: {
      name: 'USER',
      description: 'Normal user'
    }
  });

  console.log("ROLE:", userRole);

  // tạo user
  const user = await prisma.user.create({
    data: {
      name: 'Dang Tran Minh Dang',
      email: 'dang@example.com',
      password: '123456',
      roleId: userRole.id,
      status: 'ACTIVE'
    }
  });

  console.log("USER:", user);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });