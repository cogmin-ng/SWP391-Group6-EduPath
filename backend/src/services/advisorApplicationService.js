const prisma = require('../lib/prisma');
const ApiError = require('../utils/ApiError');
const notificationService = require('./notificationService');

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

    // Find all active ADMINs
    const admins = await tx.user.findMany({
      where: {
        role: { name: 'ADMIN' },
        isDeleted: false,
        status: 'ACTIVE',
      },
      select: { id: true },
    });

    // Create notifications for all admins
    if (admins.length > 0) {
      await notificationService.createNotifications(
        admins.map((admin) => admin.id),
        {
          type: 'SYSTEM',
          title: 'Yêu cầu làm Mentor mới',
          content: 'Một học viên vừa gửi yêu cầu để trở thành Mentor. Vui lòng kiểm tra trang quản lý.',
        },
        tx
      );
    }

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

/**
 * Get all advisor applications (Admin only).
 */
exports.getAllApplications = async () => {
  return await prisma.advisorApplication.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          bio: true,
        },
      },
      mentorSubjects: {
        include: { subject: { select: { id: true, name: true } } },
      },
      academicRecords: {
        include: { subject: { select: { id: true, name: true } } },
      },
    },
  });
};

/**
 * Update the status of an advisor application.
 */
exports.updateApplicationStatus = async (id, status, reviewerId, rejectReason) => {
  const application = await prisma.advisorApplication.findUnique({
    where: { id },
  });

  if (!application || application.isDeleted) {
    throw new ApiError(404, messages.notFound);
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Update the application status
    const updatedApp = await tx.advisorApplication.update({
      where: { id },
      data: {
        status,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        rejectReason: status === 'REJECTED' ? rejectReason : null,
      },
    });

    // 2. If approved, change the user's role to MENTOR
    if (status === 'APPROVED') {
      const mentorRole = await tx.role.findUnique({
        where: { name: 'MENTOR' },
      });

      if (mentorRole) {
        await tx.user.update({
          where: { id: application.userId },
          data: { roleId: mentorRole.id },
        });
      }
    }

    if (updatedApp.userId) {
      const notificationPayload = {
        type: 'SYSTEM',
        title: status === 'APPROVED' ? 'Đơn đăng ký Mentor được phê duyệt' : 'Đơn đăng ký Mentor bị từ chối',
        content:
          status === 'APPROVED'
            ? 'Đơn đăng ký Mentor của bạn đã được phê duyệt. Bạn có thể bắt đầu tạo lộ trình và hỗ trợ học viên.'
            : `Đơn đăng ký Mentor của bạn đã bị từ chối.${rejectReason ? ` Lý do: ${rejectReason}` : ''}`,
      };

      await notificationService.createNotification(updatedApp.userId, notificationPayload, tx);
    }

    return updatedApp;
  });
};
