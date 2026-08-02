const prisma = require('../src/lib/prisma');

async function main() {
  console.log('Starting test seed script...');

  // find all existing bank question ids
  const existing = await prisma.bankQuestion.findMany({ select: { id: true } });
  const existingIds = existing.map(e => e.id);

  if (existingIds.length) {
    console.log(`Found ${existingIds.length} existing bank questions; removing related quiz questions first.`);
    await prisma.quizQuestion.deleteMany({ where: { bankQuestionId: { in: existingIds } } });
  }

  console.log('Deleting existing bank questions...');
  await prisma.bankQuestion.deleteMany({});

  // get a few subjects
  const subjects = await prisma.subject.findMany({ take: 4 });
  if (!subjects || subjects.length === 0) {
    throw new Error('No subjects found in DB. Please create subjects before seeding test questions.');
  }

  const user = await prisma.user.findFirst();
  if (!user) {
    throw new Error('No users found in DB. Please create a user before seeding test questions.');
  }

  console.log(`Using ${subjects.length} subjects and user ${user.id} as creator.`);

  // For each subject, try to find a learning path and node; create test questions
  for (const subj of subjects) {
    const lps = await prisma.learningPath.findMany({ where: { subjectId: subj.id, isDeleted: false }, take: 2 });

    // QUESTION 1: subject only
    await prisma.bankQuestion.create({
      data: {
        question: `Test question for subject ${subj.name} (no path)`,
        explanation: 'Auto-generated test question',
        difficulty: 'TRUNG_BINH',
        subjectId: subj.id,
        creatorId: user.id,
        options: {
          create: [
            { content: 'Option A', isCorrect: true },
            { content: 'Option B', isCorrect: false },
            { content: 'Option C', isCorrect: false }
          ]
        }
      }
    });

    if (lps.length > 0) {
      const lp = lps[0];
      const nodes = await prisma.node.findMany({ where: { learningPathId: lp.id, isDeleted: false }, take: 2 });

      // QUESTION 2: subject + learningPath
      await prisma.bankQuestion.create({
        data: {
          question: `Test question for subject ${subj.name} (path: ${lp.title})`,
          explanation: 'Auto-generated test question (path)',
          difficulty: 'DE',
          subjectId: subj.id,
          learningPathId: lp.id,
          creatorId: user.id,
          options: { create: [ { content: 'A', isCorrect: true }, { content: 'B', isCorrect: false } ] }
        }
      });

      if (nodes.length > 0) {
        const node = nodes[0];
        // QUESTION 3: subject + learningPath + node
        await prisma.bankQuestion.create({
          data: {
            question: `Test question for subject ${subj.name} (path: ${lp.title} / node: ${node.title})`,
            explanation: 'Auto-generated test question (path+node)',
            difficulty: 'KHO',
            subjectId: subj.id,
            learningPathId: lp.id,
            nodeId: node.id,
            creatorId: user.id,
            options: { create: [ { content: 'True', isCorrect: true }, { content: 'False', isCorrect: false } ] }
          }
        });
      }
    }
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
