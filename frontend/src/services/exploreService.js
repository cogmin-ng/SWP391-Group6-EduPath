import api from './api';

export const exploreService = {
  async getLearningPaths() {
    const { data } = await api.get('/learning-paths/explore');
    return data.data;
  },
};
