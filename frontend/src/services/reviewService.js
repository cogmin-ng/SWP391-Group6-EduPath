import api from './api';

export const getReviews = async (learningPathId, skip = 0, limit = 20) => {
  const res = await api.get(
    `/reviews/learning-path/${learningPathId}?skip=${skip}&limit=${limit}`
  );
  return res.data.data;
};

export const getMyReview = async (learningPathId) => {
  try {
    const res = await api.get(`/reviews/learning-path/${learningPathId}/my`);
    return res.data.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createReview = async (learningPathId, { rating, comment }) => {
  const res = await api.post(`/reviews/learning-path/${learningPathId}`, {
    rating,
    comment,
  });
  return res.data.data;
};

export const updateReview = async (reviewId, { rating, comment }) => {
  const res = await api.put(`/reviews/${reviewId}`, {
    rating,
    comment,
  });
  return res.data.data;
};

export const deleteReview = async (reviewId) => {
  const res = await api.delete(`/reviews/${reviewId}`);
  return res.data;
};

export const createMentorReply = async (reviewId, { mentorReply }) => {
  const res = await api.post(`/reviews/${reviewId}/reply`, {
    mentorReply,
  });
  return res.data.data;
};

export const updateMentorReply = async (reviewId, { mentorReply }) => {
  const res = await api.put(`/reviews/${reviewId}/reply`, {
    mentorReply,
  });
  return res.data.data;
};

export const deleteMentorReply = async (reviewId) => {
  const res = await api.delete(`/reviews/${reviewId}/reply`);
  return res.data;
};
