import api from './api';

/**
 * Fetch question bank list with search, filters, pagination.
 * @param {Object} params - { skip, take, search, subjectId, difficulty }
 * @returns {Promise<Object>} { questions: Array, total: number }
 */
export const getQuestionBank = async (params = {}) => {
  const res = await api.get('/question-bank', { params });
  return res.data.data;
};

/**
 * Create a new question in the bank.
 * @param {Object} data - { question, options, explanation, difficulty, subjectId }
 * @returns {Promise<Object>} Created question
 */
export const createQuestion = async (data) => {
  const res = await api.post('/question-bank', data);
  return res.data.data;
};

/**
 * Update a question details or options.
 * @param {string} id 
 * @param {Object} data 
 * @returns {Promise<Object>} Updated question
 */
export const updateQuestion = async (id, data) => {
  const res = await api.put(`/question-bank/${id}`, data);
  return res.data.data;
};

/**
 * Soft delete a question from the bank.
 * @param {string} id 
 * @returns {Promise<void>}
 */
export const deleteQuestion = async (id) => {
  await api.delete(`/question-bank/${id}`);
};
