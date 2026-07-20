const userRepository = require('../repositories/userRepository');
const roleRepository = require('../repositories/roleRepository');
const ApiError = require('../utils/ApiError');
const cloudinaryService = require('./externalService/cloudinary/cloudinaryService');
const prisma = require('../lib/prisma');
const { getLevelInfo } = require('../utils/level');

const userMessages = {
  notFound: 'User not found',
  emailAlreadyInUse: 'Email already in use',
  invalidId: 'Invalid user id',
  invalidEmail: 'Invalid email format',
  cannotUpdateOwnRole: 'Cannot update your own role',
  cannotDeleteOwnAccount: 'Cannot delete your own account',
  cannotUpdateAnotherAvatar: 'Cannot update another user avatar',
};

exports.getUsers = async ({ roleId, skip = 0, take = 10 }) => {
  const [users, total] = await Promise.all([
    userRepository.findAll({ roleId, skip, take }),
    userRepository.count({ roleId }),
  ]);

  return { users, total };
};

exports.searchUsers = async ({ query, roleId, skip = 0, take = 10 }) => {
  const [users, total] = await Promise.all([
    userRepository.search({ query, roleId, skip, take }),
    userRepository.searchCount({ query, roleId }),
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
  const levelInfo = getLevelInfo(user.xp);

  return {
    user: {
      id: user.id,
      name: user.name || 'Học viên',
      email: user.email,
      avatarUrl: user.avatar,
      bio: user.bio,
      xp: user.xp,
      ...levelInfo,
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

  const user = await userRepository.findByIdWithRoles(id);
  if (!user) {
    throw new ApiError(404, userMessages.notFound);
  }

  if (user.role?.name === 'MENTOR') {
    throw new ApiError(400, 'Cannot change role of a user who is currently a MENTOR');
  }

  if (user.email === 'admin@example.com') {
    throw new ApiError(400, 'Tài khoản admin@example.com không thể bị thay đổi quyền');
  }

  if (roleId) {
    const role = await roleRepository.findById(roleId);
    if (!role) {
      throw new ApiError(400, 'Role not found');
    }

    if (role.name === 'MENTOR') {
      throw new ApiError(400, 'Cannot directly update role to MENTOR from user management');
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

  if (user.email === 'admin@example.com') {
    throw new ApiError(400, 'Tài khoản admin@example.com không thể bị xóa');
  }

  await userRepository.hardDelete(id);
};

exports.getDashboardStats = async () => {
  const prisma = require('../lib/prisma');

  const [totalUsers, totalMentors, totalMentees, totalRoadmaps] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.user.count({ where: { isDeleted: false, role: { name: 'MENTOR' } } }),
    prisma.user.count({ where: { isDeleted: false, role: { name: 'MENTEE' } } }),
    prisma.learningPath.count({ where: { isDeleted: false } })
  ]);

  // Fetch latest activities for dashboard
  const [latestUsers, latestApps, latestRoadmaps] = await Promise.all([
    prisma.user.findMany({ take: 20, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, createdAt: true, status: true } }),
    prisma.advisorApplication.findMany({ take: 20, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true } } } }),
    prisma.learningPath.findMany({ take: 20, orderBy: { createdAt: 'desc' }, include: { mentor: { select: { name: true } } } })
  ]);

  const activities = [];

  latestUsers.forEach(u => {
    activities.push({
      id: `u_${u.id}`,
      user: u.name || 'Người dùng mới',
      action: 'Đăng ký tài khoản',
      date: u.createdAt.toISOString(),
      status: u.status === 'ACTIVE' ? 'Thành công' : 'Đang chờ'
    });
  });

  latestApps.forEach(a => {
    activities.push({
      id: `a_${a.id}`,
      user: a.user?.name || 'Vô danh',
      action: 'Yêu cầu làm Người hướng dẫn',
      date: a.createdAt.toISOString(),
      status: a.status === 'APPROVED' ? 'Đã duyệt' : a.status === 'REJECTED' ? 'Từ chối' : 'Đang chờ'
    });
  });

  latestRoadmaps.forEach(r => {
    activities.push({
      id: `r_${r.id}`,
      user: r.mentor?.name || 'Vô danh',
      action: `Tạo lộ trình: ${r.title}`,
      date: r.createdAt.toISOString(),
      status: r.status === 'APPROVED' ? 'Đã duyệt' : r.status === 'PUBLISHED' ? 'Thành công' : r.status === 'REJECTED' ? 'Từ chối' : 'Đang chờ'
    });
  });

  // Sort activities and take top 20
  activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentActivities = activities.slice(0, 20);

  return {
    totalUsers,
    totalMentors,
    totalMentees,
    totalRoadmaps,
    recentActivities
  };
};

exports.getHotMentors = async ({ page = 1, limit = 9 } = {}) => {
  const result = await userRepository.getHotMentors({ page, limit });

  // Map to the response format, removing the score field
  return {
    mentors: result.mentors.map((mentor) => ({
      id: mentor.id,
      fullName: mentor.fullName,
      avatar: mentor.avatar,
      bio: mentor.bio,
      averageRating: mentor.averageRating,
      totalLearners: mentor.totalLearners,
      totalLearningPaths: mentor.totalLearningPaths,
      totalReviews: mentor.totalReviews,
      subjects: mentor.subjects,
      createdAt: mentor.createdAt,
    })),
    pagination: result.pagination,
  };
};
