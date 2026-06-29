const notificationRepository = require('../repositories/notificationRepository');
const ApiError = require('../utils/ApiError');

const notificationMessages = {
  notFound: 'Notification not found',
  invalidId: 'Invalid notification id',
};

const normalizeNotificationPayload = ({ type, title, content, relatedTipId = null }) => ({
  type,
  title,
  content,
  relatedTipId,
});

exports.createNotification = async (userId, payload, prismaClient = null) => {
  if (!userId) return null;

  const notification = await notificationRepository.create(
    {
      userId,
      ...normalizeNotificationPayload(payload),
    },
    prismaClient
  );

  return notification;
};

exports.createNotifications = async (userIds, payload, prismaClient = null) => {
  if (!Array.isArray(userIds) || userIds.length === 0) return [];

  const normalizedPayload = normalizeNotificationPayload(payload);

  const notifications = await notificationRepository.createMany(
    userIds.map((userId) => ({
      userId,
      ...normalizedPayload,
    })),
    prismaClient
  );

  return notifications;
};

exports.getNotificationsByUser = async (userId, { skip = 0, take = 10 }) => {
  const [notifications, total] = await Promise.all([
    notificationRepository.findByUser(userId, { skip, take }),
    notificationRepository.countByUser(userId),
  ]);

  return { notifications, total };
};

exports.getUnreadNotifications = async (userId) => {
  const unreadNotifications = await notificationRepository.findUnreadByUser(userId);
  const unreadCount = await notificationRepository.countUnreadByUser(userId);

  return { unreadNotifications, unreadCount };
};

exports.markNotificationAsRead = async (notificationId, userId) => {
  if (!notificationId || typeof notificationId !== 'string') {
    throw new ApiError(400, notificationMessages.invalidId);
  }

  const notification = await notificationRepository.findByIdActive(notificationId);
  if (!notification) {
    throw new ApiError(404, notificationMessages.notFound);
  }

  // Verify ownership
  if (notification.userId !== userId) {
    throw new ApiError(403, 'You do not have permission to access this notification');
  }

  const updated = await notificationRepository.markAsRead(notificationId);
  return updated;
};

exports.markAllAsRead = async (userId) => {
  await notificationRepository.markAllAsReadByUser(userId);
  return { message: 'All notifications marked as read' };
};

exports.deleteNotification = async (notificationId, userId) => {
  if (!notificationId || typeof notificationId !== 'string') {
    throw new ApiError(400, notificationMessages.invalidId);
  }

  const notification = await notificationRepository.findByIdActive(notificationId);
  if (!notification) {
    throw new ApiError(404, notificationMessages.notFound);
  }

  // Verify ownership
  if (notification.userId !== userId) {
    throw new ApiError(403, 'You do not have permission to access this notification');
  }

  await notificationRepository.softDelete(notificationId);
  return { message: 'Notification deleted successfully' };
};
