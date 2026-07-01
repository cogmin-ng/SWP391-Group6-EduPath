import api from './api';

export const subjectService = {
  async getAllSubjects(categoryId) {
    const { data } = await api.get('/subjects', {
      params: { categoryId },
    });
    return data.data;
  },
};
