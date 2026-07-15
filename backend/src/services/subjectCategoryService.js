const prisma = require('../lib/prisma');
const ApiError = require('../utils/ApiError');

exports.getAllCategories = async () => {
  const categories = await prisma.subjectCategory.findMany({
    where: { isDeleted: false },
    include: {
      subjects: {
        where: { isDeleted: false },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          description: true,
          categoryId: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return categories;
};

exports.createCategory = async ({ name, description }) => {
  const existing = await prisma.subjectCategory.findUnique({
    where: { name },
  });

  if (existing) {
    if (existing.isDeleted) {
      return prisma.subjectCategory.update({
        where: { id: existing.id },
        data: { isDeleted: false, description, updatedAt: new Date() },
      });
    }
    throw new ApiError(400, 'Tên danh mục đã tồn tại');
  }

  return prisma.subjectCategory.create({
    data: { name, description },
  });
};

exports.updateCategory = async (id, { name, description }) => {
  const existingCategory = await prisma.subjectCategory.findUnique({
    where: { id },
  });

  if (!existingCategory || existingCategory.isDeleted) {
    throw new ApiError(404, 'Không tìm thấy danh mục');
  }

  if (name) {
    const existingWithName = await prisma.subjectCategory.findUnique({
      where: { name },
    });
    if (existingWithName && existingWithName.id !== id) {
      throw new ApiError(400, 'Tên danh mục đã tồn tại');
    }
  }

  return prisma.subjectCategory.update({
    where: { id },
    data: { name, description, updatedAt: new Date() },
  });
};

exports.deleteCategory = async (id) => {
  const existingCategory = await prisma.subjectCategory.findUnique({
    where: { id },
  });

  if (!existingCategory || existingCategory.isDeleted) {
    throw new ApiError(404, 'Không tìm thấy danh mục');
  }

  return prisma.subjectCategory.update({
    where: { id },
    data: { isDeleted: true, updatedAt: new Date() },
  });
};
