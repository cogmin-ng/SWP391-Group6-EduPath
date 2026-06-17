import api from './api';

export const subjectCategoryService = {
  async getSubjectCategories() {
    const { data } = await api.get('/subject-categories');
    return data.data;
  },
};
