import api from './api';

export const subjectService = {
  async getAllSubjects(categoryId) {
    const { data } = await api.get('/subjects', {
      params: { categoryId },
    });
    return data.data;
  },
  async createSubject(payload) {
    const { data } = await api.post('/subjects', payload);
    return data.data;
  },
  async updateSubject(id, payload) {
    const { data } = await api.put(`/subjects/${id}`, payload);
    return data.data;
  },
  async deleteSubject(id) {
    const { data } = await api.delete(`/subjects/${id}`);
    return data.data;
  },
};
