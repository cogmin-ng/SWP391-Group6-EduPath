const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const updated = await prisma.advisorApplication.updateMany({
      where: { userId: 'cmr2uyvpz0000q4nist62tta2', status: 'APPROVED' },
      data: { isDeleted: false }
    });
    console.log('Updated application isDeleted to false:', updated);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
