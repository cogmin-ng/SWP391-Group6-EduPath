const prisma = require('../lib/prisma');
const ApiError = require('../utils/ApiError');

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

exports.createSubject = async ({ name, description, categoryId }) => {
  const existing = await prisma.subject.findUnique({
    where: { name },
  });

  if (existing) {
    if (existing.isDeleted) {
      return prisma.subject.update({
        where: { id: existing.id },
        data: { isDeleted: false, description, categoryId, updatedAt: new Date() },
      });
    }
    throw new ApiError(400, 'Tên môn học đã tồn tại');
  }

  // Ensure category exists
  if (categoryId) {
    const category = await prisma.subjectCategory.findUnique({ where: { id: categoryId } });
    if (!category || category.isDeleted) {
      throw new ApiError(404, 'Danh mục không tồn tại');
    }
  }

  return prisma.subject.create({
    data: { name, description, categoryId },
  });
};

exports.updateSubject = async (id, { name, description, categoryId }) => {
  const existingSubject = await prisma.subject.findUnique({
    where: { id },
  });

  if (!existingSubject || existingSubject.isDeleted) {
    throw new ApiError(404, 'Không tìm thấy môn học');
  }

  if (name) {
    const existingWithName = await prisma.subject.findUnique({
      where: { name },
    });
    if (existingWithName && existingWithName.id !== id) {
      throw new ApiError(400, 'Tên môn học đã tồn tại');
    }
  }

  if (categoryId) {
    const category = await prisma.subjectCategory.findUnique({ where: { id: categoryId } });
    if (!category || category.isDeleted) {
      throw new ApiError(404, 'Danh mục không tồn tại');
    }
  }

  return prisma.subject.update({
    where: { id },
    data: { name, description, categoryId, updatedAt: new Date() },
  });
};

exports.deleteSubject = async (id) => {
  const existingSubject = await prisma.subject.findUnique({
    where: { id },
  });

  if (!existingSubject || existingSubject.isDeleted) {
    throw new ApiError(404, 'Không tìm thấy môn học');
  }

  return prisma.subject.update({
    where: { id },
    data: { isDeleted: true, updatedAt: new Date() },
  });
};
