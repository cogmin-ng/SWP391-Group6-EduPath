const prisma = require('../lib/prisma');

exports.getAllSubjects = async (categoryId, excludeRegisteredByUserId) => {
  const where = { isDeleted: false };
  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (excludeRegisteredByUserId) {
    const registeredSubjects = await prisma.advisorSubject.findMany({
      where: {
        application: {
          userId: excludeRegisteredByUserId,
          isDeleted: false,
        }
      },
      select: { subjectId: true }
    });
    
    const registeredSubjectIds = registeredSubjects.map(rs => rs.subjectId);
    
    if (registeredSubjectIds.length > 0) {
      where.id = { notIn: registeredSubjectIds };
    }
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
