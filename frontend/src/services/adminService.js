import api from './api';

export const adminService = {
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
  }
};
