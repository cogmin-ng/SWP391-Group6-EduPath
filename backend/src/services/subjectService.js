const prisma = require('../lib/prisma');

exports.getAllSubjects = async (categoryId) => {
  const where = { isDeleted: false };
  if (categoryId) {
    where.categoryId = categoryId;
  }
  const subjects = await prisma.subject.findMany({
    where,
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
