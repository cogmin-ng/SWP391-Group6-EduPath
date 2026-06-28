import api from './api';

export const subjectService = {
  async getAllSubjects() {
    const { data } = await api.get('/subjects');
    return data.data;
  },
};
