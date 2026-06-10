const prisma = require('../lib/prisma');
const ApiError = require('../utils/ApiError');

const messages = {
  alreadyPending: 'You already have a pending application',
  invalidSubjects: 'One or more selected subjects do not exist',
  invalidAcademicSubjects: 'One or more academic record subjects do not exist',
  notFound: 'Application not found',
};

/**
 * Create a new advisor (mentor) application within a single transaction.
 *
 * @param {string} userId
 * @param {object} data
 */
exports.createApplication = async (userId, data) => {
  const {
    specialization,
    currentSemester,
    bio,
    experience,
    transcriptUrl,
    subjectIds,
    academicRecords,
  } = data;

  // 1. Check if user already has a PENDING application
  const existing = await prisma.advisorApplication.findFirst({
    where: {
      userId,
      status: 'PENDING',
      isDeleted: false,
    },
  });

  if (existing) {
    throw new ApiError(409, messages.alreadyPending);
  }

  // 2. Verify all subjectIds exist
  const subjects = await prisma.subject.findMany({
    where: {
      id: { in: subjectIds },
      isDeleted: false,
    },
    select: { id: true },
  });

  if (subjects.length !== subjectIds.length) {
    throw new ApiError(400, messages.invalidSubjects);
  }

  // 3. Verify all academic record subjectIds exist
  const academicSubjectIds = academicRecords.map((r) => r.subjectId);
  const academicSubjects = await prisma.subject.findMany({
    where: {
      id: { in: academicSubjectIds },
      isDeleted: false,
    },
    select: { id: true },
  });

  if (academicSubjects.length !== new Set(academicSubjectIds).size) {
    throw new ApiError(400, messages.invalidAcademicSubjects);
  }

  // 4. Create everything in a transaction
  const application = await prisma.$transaction(async (tx) => {
    // Create AdvisorApplication
    const app = await tx.advisorApplication.create({
      data: {
        userId,
        specialization,
        currentSemester,
        bio,
        experience,
        transcriptUrl: transcriptUrl || null,
        status: 'PENDING',
      },
    });

    // Create AdvisorSubject records
    await tx.advisorSubject.createMany({
      data: subjectIds.map((subjectId) => ({
        advisorApplicationId: app.id,
        subjectId,
      })),
    });

    // Create AdvisorAcademicRecord records
    await tx.advisorAcademicRecord.createMany({
      data: academicRecords.map((record) => ({
        advisorApplicationId: app.id,
        subjectId: record.subjectId,
        grade: record.grade,
      })),
    });

    // Return the full application with relations
    return tx.advisorApplication.findUnique({
      where: { id: app.id },
      include: {
        mentorSubjects: {
          include: { subject: { select: { id: true, name: true } } },
        },
        academicRecords: {
          include: { subject: { select: { id: true, name: true } } },
        },
      },
    });
  });

  return application;
};

/**
 * Get the current user's latest application.
 *
 * @param {string} userId
 */
exports.getMyApplication = async (userId) => {
  const application = await prisma.advisorApplication.findFirst({
    where: {
      userId,
      isDeleted: false,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      mentorSubjects: {
        include: { subject: { select: { id: true, name: true } } },
      },
      academicRecords: {
        include: { subject: { select: { id: true, name: true } } },
      },
    },
  });

  return application;
};
