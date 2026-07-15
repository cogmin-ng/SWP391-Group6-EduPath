const prisma = require('../lib/prisma');
const crypto = require('crypto');
const ApiError = require('../utils/ApiError');
const notificationService = require('./notificationService');

const CERTIFICATE_THRESHOLD = 100;

function serializeCertificate(certificate) {
  if (!certificate) return null;

  return {
    id: certificate.id,
    learningPathTitle: certificate.learningPath?.title || '',
    mentorName: certificate.learningPath?.mentor?.name || 'Unknown',
    issuedAt: certificate.issuedAt,
    certificateUrl: certificate.certificateUrl,
    verificationId: certificate.verificationId,
  };
}

/**
 * Idempotent: creates a certificate only if the user is eligible
 * and doesn't already have one for this learning path.
 */
exports.createCertificateIfEligible = async (userId, learningPathId) => {
  // 1. Check enrollment progress
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      learningPathId,
      isDeleted: false,
    },
    select: {
      progressPercent: true,
      learningPath: { select: { title: true } },
    },
  });

  if (!enrollment || enrollment.progressPercent < CERTIFICATE_THRESHOLD) {
    return { certificate: null, notification: null, created: false };
  }

  // 2. Check if certificate already exists (idempotent guard)
  const existing = await prisma.certificate.findUnique({
    where: {
      userId_learningPathId: { userId, learningPathId },
    },
    include: {
      learningPath: {
        select: {
          title: true,
          mentor: { select: { name: true } },
        },
      },
    },
  });

  if (existing && !existing.isDeleted) {
    return {
      certificate: serializeCertificate(existing),
      notification: null,
      created: false,
    };
  }

  // Certificate and its notification must be persisted together so the UI can
  // safely announce completion as soon as this operation returns.
  return prisma.$transaction(async (tx) => {
    const certificate = existing
      ? await tx.certificate.update({
          where: { id: existing.id },
          data: {
            isDeleted: false,
            issuedAt: new Date(),
            verificationId: crypto.randomUUID(),
          },
          include: {
            learningPath: {
              select: {
                title: true,
                mentor: { select: { name: true } },
              },
            },
          },
        })
      : await tx.certificate.create({
          data: {
            userId,
            learningPathId,
            verificationId: crypto.randomUUID(),
          },
          include: {
            learningPath: {
              select: {
                title: true,
                mentor: { select: { name: true } },
              },
            },
          },
        });

    const notification = await notificationService.createNotification(
      userId,
      {
        type: 'CERTIFICATE',
        title: 'Hoàn thành lộ trình và nhận chứng chỉ',
        content: `Chúc mừng! Bạn đã hoàn thành lộ trình “${enrollment.learningPath.title}” và nhận được chứng chỉ mới.`,
      },
      tx
    );

    return {
      certificate: serializeCertificate(certificate),
      notification,
      created: true,
    };
  });
};

/**
 * Get all certificates for the current user.
 */
exports.getMyCertificates = async (userId) => {
  const certificates = await prisma.certificate.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    select: {
      id: true,
      issuedAt: true,
      certificateUrl: true,
      verificationId: true,
      learningPath: {
        select: {
          id: true,
          title: true,
          mentor: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { issuedAt: 'desc' },
  });

  return certificates.map((cert) => ({
    id: cert.id,
    learningPathTitle: cert.learningPath.title,
    mentorName: cert.learningPath.mentor?.name || 'Unknown',
    issuedAt: cert.issuedAt,
    certificateUrl: cert.certificateUrl,
    verificationId: cert.verificationId,
  }));
};

/**
 * Get certificate detail. Only the owner can view.
 */
exports.getCertificateDetail = async (certificateId, userId) => {
  const certificate = await prisma.certificate.findFirst({
    where: {
      id: certificateId,
      isDeleted: false,
    },
    select: {
      id: true,
      userId: true,
      issuedAt: true,
      certificateUrl: true,
      verificationId: true,
      learningPath: {
        select: {
          id: true,
          title: true,
          mentor: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!certificate) {
    throw new ApiError(404, 'Certificate not found');
  }

  if (certificate.userId !== userId) {
    throw new ApiError(
      403,
      'You do not have permission to view this certificate'
    );
  }

  return {
    id: certificate.id,
    learningPathTitle: certificate.learningPath.title,
    mentorName: certificate.learningPath.mentor?.name || 'Unknown',
    issuedAt: certificate.issuedAt,
    certificateUrl: certificate.certificateUrl,
    verificationId: certificate.verificationId,
  };
};

/**
 * Public verification endpoint.
 */
exports.verifyCertificate = async (verificationId) => {
  const certificate = await prisma.certificate.findFirst({
    where: {
      verificationId,
      isDeleted: false,
    },
    select: {
      id: true,
      issuedAt: true,
      learningPath: {
        select: {
          title: true,
          mentor: {
            select: { name: true },
          },
        },
      },
    },
  });

  if (!certificate) {
    return { valid: false };
  }

  return {
    valid: true,
    learningPath: certificate.learningPath.title,
    mentor: certificate.learningPath.mentor?.name || 'Unknown',
    issueDate: certificate.issuedAt,
  };
};

/**
 * Download certificate. Only the owner can download.
 * TODO: Integrate PDF generator when available.
 */
exports.downloadCertificate = async (certificateId, userId) => {
  const certificate = await prisma.certificate.findFirst({
    where: {
      id: certificateId,
      isDeleted: false,
    },
    select: {
      id: true,
      userId: true,
      certificateUrl: true,
    },
  });

  if (!certificate) {
    throw new ApiError(404, 'Certificate not found');
  }

  if (certificate.userId !== userId) {
    throw new ApiError(
      403,
      'You do not have permission to download this certificate'
    );
  }

  if (!certificate.certificateUrl) {
    // TODO: Generate PDF certificate on-the-fly when PDF generator is integrated
    throw new ApiError(
      404,
      'Certificate file is not yet available. PDF generation is not implemented.'
    );
  }

  return { certificateUrl: certificate.certificateUrl };
};
