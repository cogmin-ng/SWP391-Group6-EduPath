const userRepository = require('../repositories/userRepository');
const roleRepository = require('../repositories/roleRepository');
const ApiError = require('../utils/ApiError');
const cloudinaryService = require('./externalService/cloudinary/cloudinaryService');
const prisma = require('../lib/prisma');

const userMessages = {
  notFound: 'User not found',
  emailAlreadyInUse: 'Email already in use',
  invalidId: 'Invalid user id',
  invalidEmail: 'Invalid email format',
  cannotUpdateOwnRole: 'Cannot update your own role',
  cannotDeleteOwnAccount: 'Cannot delete your own account',
  cannotUpdateAnotherAvatar: 'Cannot update another user avatar',
};

exports.getUsers = async ({ skip = 0, take = 10 }) => {
  const [users, total] = await Promise.all([
    userRepository.findAll({ skip, take }),
    userRepository.count(),
  ]);

  return { users, total };
};

exports.searchUsers = async ({ query, skip = 0, take = 10 }) => {
  const [users, total] = await Promise.all([
    userRepository.search({ query, skip, take }),
    userRepository.searchCount(query),
  ]);

  return { users, total };
};

exports.getUserById = async (id) => {
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, userMessages.invalidId);
  }

  const user = await userRepository.findByIdActive(id);
  if (!user) {
    throw new ApiError(404, userMessages.notFound);
  }

  const userWithRole = await userRepository.findByIdWithRoles(id);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    xp: user.xp,
    status: user.status,
    role: userWithRole?.role?.name || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

exports.getMenteeProfile = async (userId) => {
  const [
    user,
    enrollments,
    certificates,
    passedQuizzes,
    totalContributions,
    approvedContributions,
  ] = await Promise.all([
    prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        xp: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        role: { select: { name: true } },
      },
    }),
    prisma.enrollment.findMany({
      where: { userId, isDeleted: false, status: { not: 'DROPPED' } },
      select: { status: true, progressPercent: true },
    }),
    prisma.certificate.findMany({
      where: { userId, isDeleted: false },
      select: {
        id: true,
        issuedAt: true,
        verificationId: true,
        learningPath: {
          select: {
            title: true,
            mentor: { select: { name: true } },
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    }),
    prisma.quizAttempt.findMany({
      where: { userId, isDeleted: false, status: 'PASS' },
      distinct: ['quizId'],
      select: { quizId: true },
    }),
    prisma.tip.count({
      where: { contributorId: userId, isDeleted: false },
    }),
    prisma.tip.count({
      where: {
        contributorId: userId,
        isDeleted: false,
        status: 'APPROVED',
      },
    }),
  ]);

  if (!user) throw new ApiError(404, userMessages.notFound);

  const completedRoadmaps = enrollments.filter(
    (item) => item.status === 'COMPLETED' || item.progressPercent >= 100
  ).length;
  const activeRoadmaps = enrollments.filter(
    (item) => item.status === 'ACTIVE' && item.progressPercent < 100
  ).length;
  const averageProgress = enrollments.length
    ? enrollments.reduce(
        (total, item) => total + Number(item.progressPercent || 0),
        0
      ) / enrollments.length
    : 0;

  return {
    user: {
      id: user.id,
      name: user.name || 'Học viên',
      email: user.email,
      avatarUrl: user.avatar,
      bio: user.bio,
      xp: user.xp,
      status: user.status,
      role: user.role?.name || 'MENTEE',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    stats: {
      enrolledRoadmapCount: enrollments.length,
      activeRoadmapCount: activeRoadmaps,
      completedRoadmapCount: completedRoadmaps,
      averageProgress: Number(averageProgress.toFixed(1)),
      certificateCount: certificates.length,
      passedQuizCount: passedQuizzes.length,
      totalContributionCount: totalContributions,
      approvedContributionCount: approvedContributions,
    },
    recentCertificates: certificates.slice(0, 3).map((certificate) => ({
      id: certificate.id,
      learningPathTitle: certificate.learningPath.title,
      mentorName: certificate.learningPath.mentor?.name || 'Unknown',
      issuedAt: certificate.issuedAt,
      verificationId: certificate.verificationId,
    })),
  };
};

exports.updateUser = async (
  id,
  { name, avatar, bio, status },
  currentUserId,
  roles = []
) => {
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, userMessages.invalidId);
  }

  if (currentUserId !== id && !roles.includes('ADMIN')) {
    throw new ApiError(403, 'You do not have permission to update this user');
  }

  const user = await userRepository.findByIdActive(id);
  if (!user) {
    throw new ApiError(404, userMessages.notFound);
  }

  const updateData = {};
  if (name !== undefined && name !== null) updateData.name = name;
  if (avatar !== undefined && avatar !== null) updateData.avatar = avatar;
  if (bio !== undefined && bio !== null) updateData.bio = bio;
  if (status !== undefined && status !== null) updateData.status = status;

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, 'No fields to update');
  }

  updateData.updatedAt = new Date();

  const updated = await userRepository.update(id, updateData);

  const userWithRole = await userRepository.findByIdWithRoles(id);
  return {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    avatar: updated.avatar,
    bio: updated.bio,
    xp: updated.xp,
    status: updated.status,
    role: userWithRole?.role?.name || null,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
};

exports.updateUserAvatar = async (id, file, currentUserId) => {
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, userMessages.invalidId);
  }

  if (currentUserId && currentUserId !== id) {
    throw new ApiError(403, userMessages.cannotUpdateAnotherAvatar);
  }

  const user = await userRepository.findByIdActive(id);
  if (!user) {
    throw new ApiError(404, userMessages.notFound);
  }

  const uploaded = await cloudinaryService.uploadMedia(file, {
    folder: 'avatars',
    resourceType: 'image',
  });

  const updated = await userRepository.update(id, {
    avatar: uploaded.url,
    updatedAt: new Date(),
  });

  const userWithRole = await userRepository.findByIdWithRoles(id);
  return {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    avatar: updated.avatar,
    bio: updated.bio,
    xp: updated.xp,
    status: updated.status,
    role: userWithRole?.role?.name || null,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
};

exports.updateUserRole = async (id, { roleId }, currentUserId) => {
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, userMessages.invalidId);
  }

  if (id === currentUserId) {
    throw new ApiError(403, userMessages.cannotUpdateOwnRole);
  }

  const user = await userRepository.findByIdActive(id);
  if (!user) {
    throw new ApiError(404, userMessages.notFound);
  }

  if (roleId) {
    const role = await roleRepository.findById(roleId);
    if (!role) {
      throw new ApiError(400, 'Role not found');
    }

    // If changing role to something other than MENTOR (e.g. MENTEE), reset mentor applications
    if (role.name !== 'MENTOR') {
      const prisma = require('../lib/prisma');
      await prisma.advisorApplication.updateMany({
        where: {
          userId: id,
          isDeleted: false,
        },
        data: {
          isDeleted: true,
        },
      });
    }
  }

  const updated = await userRepository.update(id, { roleId: roleId || null });

  const userWithRole = await userRepository.findByIdWithRoles(id);
  return {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    avatar: updated.avatar,
    bio: updated.bio,
    xp: updated.xp,
    status: updated.status,
    role: userWithRole?.role?.name || null,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
};

exports.deleteUser = async (id, currentUserId) => {
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, userMessages.invalidId);
  }

  if (id === currentUserId) {
    throw new ApiError(403, userMessages.cannotDeleteOwnAccount);
  }

  const user = await userRepository.findByIdActive(id);
  if (!user) {
    throw new ApiError(404, userMessages.notFound);
  }

  await userRepository.hardDelete(id);
};
