const prisma = require('../lib/prisma');

exports.getAllMajors = async () => {
  const majors = await prisma.major.findMany({
    where: { isDeleted: false },
    select: { id: true, name: true, code: true },
    orderBy: { name: 'asc' },
  });

  return majors;
};
