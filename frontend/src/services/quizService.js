import api from './api';

/**
 * Create a new quiz.
 * @param {Object} quizData - Quiz payload with nested questions and options
 * @returns {Promise<Object>} Created quiz
 */
export const createQuiz = async (quizData) => {
  const res = await api.post('/quizzes', quizData);
  return res.data.data;
};

/**
 * Get a quiz by ID with questions and options.
 * @param {string} quizId
 * @returns {Promise<Object>} Quiz object
 */
export const getQuizById = async (quizId) => {
  const res = await api.get(`/quizzes/${quizId}`);
  return res.data.data;
};

/**
 * Get all quizzes for a specific node.
 * @param {string} nodeId
 * @returns {Promise<Array>} List of quizzes
 */
export const getQuizzesByNode = async (nodeId) => {
  const res = await api.get(`/nodes/${nodeId}/quizzes`);
  return res.data.data;
};

/**
 * Update a quiz.
 * @param {string} quizId
 * @param {Object} quizData - Updated quiz payload
 * @returns {Promise<Object>} Updated quiz
 */
export const updateQuiz = async (quizId, quizData) => {
  const res = await api.put(`/quizzes/${quizId}`, quizData);
  return res.data.data;
};

/**
 * Delete a quiz (soft delete).
 * @param {string} quizId
 * @returns {Promise<void>}
 */
export const deleteQuiz = async (quizId) => {
  const res = await api.delete(`/quizzes/${quizId}`);
  return res.data;
};

export const submitQuizAttempt = async (quizId, answers) => {
  const res = await api.post(`/quizzes/${quizId}/attempts`, { answers });
  return res.data.data;
};

export const getMyQuizAttempts = async (quizId) => {
  const res = await api.get(`/quizzes/${quizId}/attempts/me`);
  return res.data.data;
};
