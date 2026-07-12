const prisma = require('../lib/prisma');
const crypto = require('crypto');
const ApiError = require('../utils/ApiError');
const notificationService = require('./notificationService');

const CERTIFICATE_THRESHOLD = 95;

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
    select: { progressPercent: true },
  });

  if (!enrollment || enrollment.progressPercent < CERTIFICATE_THRESHOLD) {
    return null;
  }

  // 2. Check if certificate already exists (idempotent guard)
  const existing = await prisma.certificate.findUnique({
    where: {
      userId_learningPathId: { userId, learningPathId },
    },
  });

  if (existing) {
    return existing;
  }

  // 3. Create certificate
  const certificate = await prisma.certificate.create({
    data: {
      userId,
      learningPathId,
      verificationId: crypto.randomUUID(),
    },
  });

  // 4. Create notification (fire-and-forget style, don't block)
  try {
    await notificationService.createNotification(userId, {
      type: 'CERTIFICATE',
      title: 'Congratulations!',
      content:
        'You have successfully completed the Learning Path and earned a Certificate.',
    });
  } catch (err) {
    // Log but don't fail the certificate creation
    console.error('Failed to create certificate notification:', err.message);
  }

  return certificate;
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
