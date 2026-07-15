import api from './api';

export const getComments = async (nodeId, skip = 0, limit = 20) => {
  const res = await api.get(
    `/node-comments/node/${nodeId}?skip=${skip}&limit=${limit}`
  );
  return res.data.data;
};

export const createComment = async (nodeId, { content }) => {
  const res = await api.post(`/node-comments/node/${nodeId}`, { content });
  return res.data.data;
};

export const createReply = async (commentId, { content }) => {
  const res = await api.post(`/node-comments/${commentId}/reply`, { content });
  return res.data.data;
};

export const updateComment = async (commentId, { content }) => {
  const res = await api.put(`/node-comments/${commentId}`, { content });
  return res.data.data;
};

export const deleteComment = async (commentId) => {
  const res = await api.delete(`/node-comments/${commentId}`);
  return res.data;
};
