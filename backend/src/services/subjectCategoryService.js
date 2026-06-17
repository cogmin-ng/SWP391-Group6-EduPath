const prisma = require('../lib/prisma');

exports.getAllCategories = async () => {
  const categories = await prisma.$queryRawUnsafe(`
    SELECT "id", "name", "description"
    FROM "SubjectCategory"
    WHERE "isDeleted" = false
    ORDER BY "name" ASC
  `);

  return categories;
};
