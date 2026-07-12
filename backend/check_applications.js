const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const apps = await prisma.advisorApplication.findMany({
      where: { userId: 'cmr2uyvpz0000q4nist62tta2' },
      include: {
        mentorSubjects: {
          include: { subject: true },
        },
      },
    });
    console.log(
      'Applications for Nguyễn Huy Hiếu:',
      JSON.stringify(apps, null, 2)
    );
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
