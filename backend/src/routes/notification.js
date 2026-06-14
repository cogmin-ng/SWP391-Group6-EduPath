const Router = require('express').Router;
const notificationController = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     tags:
 *       - Notification
 *     summary: Get user's notifications
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: skip
 *         in: query
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: take
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/NotificationListResponse'
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/',
  requireAuth,
  notificationController.getNotifications
);

/**
 * @swagger
 * /api/notifications/unread:
 *   get:
 *     tags:
 *       - Notification
 *     summary: Get unread notifications count
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Unread notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     unreadNotifications:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/NotificationResponse'
 *                     unreadCount:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/unread',
  requireAuth,
  notificationController.getUnreadNotifications
);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     tags:
 *       - Notification
 *     summary: Mark notification as read
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/NotificationResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Notification not found
 */
router.put(
  '/:id/read',
  requireAuth,
  notificationController.markAsRead
);

/**
 * @swagger
 * /api/notifications/read-all:
 *   put:
 *     tags:
 *       - Notification
 *     summary: Mark all notifications as read
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/read-all',
  requireAuth,
  notificationController.markAllAsRead
);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     tags:
 *       - Notification
 *     summary: Delete a notification
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Notification not found
 */
router.delete(
  '/:id',
  requireAuth,
  notificationController.deleteNotification
);

module.exports = router;
