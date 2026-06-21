import api from './api';

export const getMyEnrollmentBySlug = async (slug) => {
  const res = await api.get(`/enrollments/slug/${slug}`);
  return res.data.data;
};

export const enrollInRoadmapBySlug = async (slug) => {
  const res = await api.post(`/enrollments/slug/${slug}`);
  return res.data.data;
};

export const updateEnrollmentProgressBySlug = async (slug, progressPercent) => {
  const res = await api.patch(`/enrollments/slug/${slug}/progress`, {
    progressPercent,
  });
  return res.data.data;
};
