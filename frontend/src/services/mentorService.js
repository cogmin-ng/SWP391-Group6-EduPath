import api from './api';

export const mentorService = {
  async getHotMentors(page = 1, limit = 9) {
    const { data } = await api.get('/mentors/hot', {
      params: { page, limit },
    });
    return data.data;
  },
};
