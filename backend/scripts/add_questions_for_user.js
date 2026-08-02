const prisma = require('../src/lib/prisma');

async function main() {
  const email = 'huyn56625@gmail.com';
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`User with email ${email} not found.`);
    process.exit(1);
  }

  console.log('Found user:', user.id);

  const subjects = await prisma.subject.findMany({ take: 3 });
  if (!subjects.length) {
    console.error('No subjects found in DB. Aborting.');
    process.exit(1);
  }

  const created = [];

  for (const subj of subjects) {
    const lps = await prisma.learningPath.findMany({ where: { subjectId: subj.id, isDeleted: false }, take: 2 });

    // subject-only question
    const q1 = await prisma.bankQuestion.create({
      data: {
        question: `Auto test - subject ${subj.name} only`,
        explanation: 'Generated for filter testing',
        difficulty: 'TRUNG_BINH',
        subjectId: subj.id,
        creatorId: user.id,
        options: { create: [ { content: 'A', isCorrect: true }, { content: 'B', isCorrect: false } ] }
      }
    });
    created.push(q1);

    if (lps.length > 0) {
      const lp = lps[0];
      const nodes = await prisma.node.findMany({ where: { learningPathId: lp.id, isDeleted: false }, take: 2 });

      const q2 = await prisma.bankQuestion.create({
        data: {
          question: `Auto test - ${subj.name} / ${lp.title}`,
          explanation: 'Generated for filter testing (path)',
          difficulty: 'DE',
          subjectId: subj.id,
          learningPathId: lp.id,
          creatorId: user.id,
          options: { create: [ { content: 'Yes', isCorrect: true }, { content: 'No', isCorrect: false } ] }
        }
      });
      created.push(q2);

      if (nodes.length > 0) {
        const node = nodes[0];
        const q3 = await prisma.bankQuestion.create({
          data: {
            question: `Auto test - ${subj.name} / ${lp.title} / ${node.title}`,
            explanation: 'Generated for filter testing (path+node)',
            difficulty: 'KHO',
            subjectId: subj.id,
            learningPathId: lp.id,
            nodeId: node.id,
            creatorId: user.id,
            options: { create: [ { content: 'Opt1', isCorrect: true }, { content: 'Opt2', isCorrect: false } ] }
          }
        });
        created.push(q3);
      }
    }
  }

  console.log(`Created ${created.length} bank questions for user ${email}`);
  for (const q of created) {
    console.log('-', q.id, q.question);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
