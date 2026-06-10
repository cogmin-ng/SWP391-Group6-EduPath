import api from './api';

export const notificationService = {
  /**
   * Get user's notifications.
   * @param {Object} params { skip, take }
   */
  async getNotifications(params = { skip: 0, take: 10 }) {
    const { data } = await api.get('/notifications', { params });
    return data.data; // usually { notifications, total }
  },

  /**
   * Get unread notifications counts
   */
  async getUnreadCount() {
    const { data } = await api.get('/notifications/unread');
    return data.data;
  },

  /**
   * Mark a notification as read.
   * @param {string} id
   */
  async markAsRead(id) {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data.data;
  },

  /**
   * Mark all notifications as read.
   */
  async markAllAsRead() {
    const { data } = await api.put('/notifications/read-all');
    return data;
  }
};
