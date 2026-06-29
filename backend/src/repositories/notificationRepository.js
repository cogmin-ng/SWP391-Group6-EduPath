const prisma = require('../lib/prisma');

const ACTIVE_NOTIFICATION_FILTER = { isDeleted: false };

exports.findByIdActive = async (id) => {
  return prisma.notification.findFirst({
    where: { id, ...ACTIVE_NOTIFICATION_FILTER },
    include: {
      relatedTip: {
        include: {
          createdBy: {
            select: { id: true, name: true, email: true, avatar: true },
          },
          contributor: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      },
    },
  });
};

exports.findByUser = async (userId, { skip = 0, take = 10 }) => {
  return prisma.notification.findMany({
    where: {
      userId,
      ...ACTIVE_NOTIFICATION_FILTER,
    },
    include: {
      relatedTip: true,
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  });
};

exports.countByUser = async (userId) => {
  return prisma.notification.count({
    where: {
      userId,
      ...ACTIVE_NOTIFICATION_FILTER,
    },
  });
};

exports.findUnreadByUser = async (userId) => {
  return prisma.notification.findMany({
    where: {
      userId,
      isRead: false,
      ...ACTIVE_NOTIFICATION_FILTER,
    },
    include: {
      relatedTip: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

exports.countUnreadByUser = async (userId) => {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
      ...ACTIVE_NOTIFICATION_FILTER,
    },
  });
};

exports.create = async (data, prismaClient = prisma) => {
  return prismaClient.notification.create({
    data,
    include: {
      relatedTip: true,
    },
  });
};

exports.createMany = async (data, prismaClient = prisma) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  return prismaClient.notification.createManyAndReturn({
    data,
    include: {
      relatedTip: true,
    },
  });
};

exports.update = async (id, data) => {
  return prisma.notification.update({
    where: { id },
    data,
    include: {
      relatedTip: true,
    },
  });
};

exports.markAsRead = async (id) => {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
    include: {
      relatedTip: true,
    },
  });
};

exports.markAllAsReadByUser = async (userId) => {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: { isRead: true },
  });
};

exports.softDelete = async (id) => {
  return prisma.notification.update({
    where: { id },
    data: { isDeleted: true },
  });
};
