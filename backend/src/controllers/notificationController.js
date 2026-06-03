const notificationService = require('../services/notificationService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.getNotifications = asyncHandler(async (req, res) => {
  const { skip, take } = req.query;
  const userId = req.user.id;

  const { notifications, total } = await notificationService.getNotificationsByUser(
    userId,
    {
      skip: Number(skip) || 0,
      take: Number(take) || 10,
    }
  );

  return sendSuccess(res, {
    message: 'Notifications retrieved successfully',
    data: { notifications, total },
  });
});

exports.getUnreadNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { unreadNotifications, unreadCount } = await notificationService.getUnreadNotifications(userId);

  return sendSuccess(res, {
    message: 'Unread notifications retrieved successfully',
    data: { unreadNotifications, unreadCount },
  });
});

exports.markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const notification = await notificationService.markNotificationAsRead(id, userId);

  return sendSuccess(res, {
    message: 'Notification marked as read',
    data: notification,
  });
});

exports.markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await notificationService.markAllAsRead(userId);

  return sendSuccess(res, {
    message: result.message,
    data: {},
  });
});

exports.deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  await notificationService.deleteNotification(id, userId);

  return sendSuccess(res, {
    message: 'Notification deleted successfully',
    data: {},
  });
});
