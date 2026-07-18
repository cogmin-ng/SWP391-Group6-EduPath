import api from './api';

export const exploreService = {
  async getLearningPaths() {
    const { data } = await api.get('/learning-paths/explore');
    return data.data;
  },

  async getHotLearningPaths(page = 1, limit = 9) {
    const { data } = await api.get('/learning-paths/hot', {
      params: { page, limit },
    });
    return data.data;
  },
};
