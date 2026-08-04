const prisma = require('../src/lib/prisma');

async function main() {
  const c = await prisma.bankQuestion.count();
  console.log('BankQuestion count:', c);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
