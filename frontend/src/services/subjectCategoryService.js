import api from './api';

export const subjectCategoryService = {
  async getSubjectCategories() {
    const { data } = await api.get('/subject-categories');
    return data.data;
  },
  async createSubjectCategory(payload) {
    const { data } = await api.post('/subject-categories', payload);
    return data.data;
  },
  async updateSubjectCategory(id, payload) {
    const { data } = await api.put(`/subject-categories/${id}`, payload);
    return data.data;
  },
  async deleteSubjectCategory(id) {
    const { data } = await api.delete(`/subject-categories/${id}`);
    return data.data;
  },
};
