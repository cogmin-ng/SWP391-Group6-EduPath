import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const { data } = await api.get('/users/dashboard-stats');
    return data.data;
  },

  getUsers: async ({ skip = 0, take = 10 }) => {
    const { data } = await api.get('/users', {
      params: { skip, take }
    });
    return data.data;
  },

  searchUsers: async ({ q, skip = 0, take = 10 }) => {
    const { data } = await api.get('/users/search', {
      params: { q, skip, take }
    });
    return data.data;
  },

  updateUserRole: async (userId, roleId) => {
    const { data } = await api.put(`/users/${userId}/role`, { roleId });
    return data.data;
  },

  updateUserStatus: async (userId, status) => {
    const { data } = await api.put(`/users/${userId}`, { status });
    return data.data;
  },

  deleteUser: async (userId) => {
    const { data } = await api.delete(`/users/${userId}`);
    return data.data;
  },

  getRoles: async () => {
    const { data } = await api.get('/roles', {
      params: { take: 100 } // Get all roles
    });
    return data.data;
  }
};
