const prisma = require('../lib/prisma');

exports.getAllSubjects = async () => {
  const subjects = await prisma.subject.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      name: true,
      description: true,
      categoryId: true,
    },
    orderBy: { name: 'asc' },
  });

  return subjects;
};
