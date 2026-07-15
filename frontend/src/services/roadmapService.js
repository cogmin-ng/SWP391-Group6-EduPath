// ============================================================
// Roadmap & Node API Service
// Currently returns mock data. Replace with real axios calls
// when the backend endpoints are ready.
// ============================================================

import { mockQuiz, mockTips } from '../mock/menteeNodeDetailData';
import api from './api';

/**
 * Fetch mentor roadmaps.
 * @param {number} skip 
 * @param {number} take 
 * @returns {Promise<Object>} { roadmaps: Array, total: number }
 */
export const getMentorRoadmaps = async (skip = 0, take = 20) => {
  const res = await api.get(`/roadmaps/mentor?skip=${skip}&take=${take}`);
  return res.data.data;
};

/**
 * Fetch roadmap overview (sidebar data).
 * @param {string} roadmapId
 * @returns {Promise<Object>}
 */
export const getRoadmapById = async (roadmapId) => {
  const res = await api.get(`/roadmaps/${roadmapId}`);
  return res.data.data;
};

export const getRoadmapBySlug = async (slug) => {
  const res = await api.get(`/roadmaps/slug/${slug}`);
  return res.data.data;
};

/**
 * Create a new roadmap.
 * @param {Object} roadmapData
 * @returns {Promise<Object>}
 */
export const createRoadmap = async (roadmapData) => {
  const res = await api.post('/roadmaps', roadmapData);
  return res.data.data;
};

/**
 * Update an existing roadmap along with node synchronization.
 * @param {string} roadmapId 
 * @param {Object} roadmapData 
 * @returns {Promise<Object>}
 */
export const updateRoadmap = async (roadmapId, roadmapData) => {
  const res = await api.put(`/roadmaps/${roadmapId}`, roadmapData);
  return res.data.data;
};

/**
 * Submit a roadmap for review (DRAFT -> PENDING).
 * @param {string} roadmapId 
 * @returns {Promise<Object>}
 */
export const submitRoadmap = async (roadmapId) => {
  const res = await api.post(`/roadmaps/${roadmapId}/submit`);
  return res.data.data;
};

/**
 * Delete a roadmap (soft delete).
 * @param {string} roadmapId 
 * @returns {Promise<void>}
 */
export const deleteRoadmap = async (roadmapId) => {
  await api.delete(`/roadmaps/${roadmapId}`);
};

/**
 * Fetch node details.
 * @param {string} roadmapId
 * @param {string} nodeId
 * @returns {Promise<Object>}
 */
export const getNodeDetails = async (_roadmapId, nodeId) => {
  // Using the new node endpoint from nodeService
  const res = await api.get(`/nodes/${nodeId}`);
  return res.data.data;
};

/**
 * Fetch checklist items for a node.
 * @param {string} nodeId
 * @returns {Promise<Array>}
 */
export const getChecklist = async (nodeId) => {
  const res = await api.get(`/nodes/${nodeId}`);
  return res.data.data.checklists || [];
};

/**
 * Fetch learning materials for a node.
 * @param {string} nodeId
 * @returns {Promise<Array>}
 */
export const getMaterials = async (nodeId) => {
  const res = await api.get(`/nodes/${nodeId}`);
  return res.data.data.materials || [];
};

/**
 * Fetch quiz info for a node.
 * @param {string} nodeId
 * @returns {Promise<Object>}
 */
export const getQuiz = async () => {
  // TODO: Replace with → api.get(`/nodes/${nodeId}/quiz`)
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockQuiz), 200);
  });
};

/**
 * Fetch community tips for a node.
 * @param {string} nodeId
 * @returns {Promise<Array>}
 */
export const getTips = async (nodeId) => {
  try {
    const res = await api.get(`/tips/node/${nodeId}`);
    return res.data.data;
  } catch {
    // fallback to mock
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTips), 200);
    });
  }
};

/**
 * Submit a new tip.
 * @param {string} nodeId
 * @param {string|Object} content - either string (legacy) or {title, content}
 * @returns {Promise<Object>}
 * @throws {Error} if submission fails
 */
export const submitTip = async (nodeId, content) => {
  const payload = typeof content === 'string' ? { nodeId, content } : { nodeId, title: content.title, content: content.content };
  const res = await api.post('/tips/submit', payload);
  return res.data.data;
};

/**
 * Fetch pending tips for mentor review.
 * @param {number} skip - Pagination offset (default 0)
 * @param {number} take - Pagination limit (default 10)
 * @returns {Promise<Object>} { tips: Array, total: number }
 */
export const getPendingTips = async (skip = 0, take = 10) => {
  try {
    const res = await api.get(`/tips/pending?skip=${skip}&take=${take}`);
    return res.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || 'Failed to fetch pending tips',
      { cause: error }
    );
  }
};

/**
 * Approve a pending tip.
 * @param {string} tipId - The tip ID to approve
 * @returns {Promise<Object>} Updated tip object
 */
export const approveTip = async (tipId) => {
  try {
    const res = await api.put(`/tips/${tipId}/approve`);
    return res.data.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to approve tip', {
      cause: error,
    });
  }
};

/**
 * Reject a pending tip with reason.
 * @param {string} tipId - The tip ID to reject
 * @param {string} rejectReason - Reason for rejection (5-500 chars)
 * @returns {Promise<Object>} Updated tip object
 */
export const rejectTip = async (tipId, rejectReason) => {
  try {
    const res = await api.put(`/tips/${tipId}/reject`, { rejectReason });
    return res.data.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to reject tip', {
      cause: error,
    });
  }
};

/**
 * Fetch mentee's tip contribution history.
 * @param {number} skip - Pagination offset (default 0)
 * @param {number} take - Pagination limit (default 10)
 * @returns {Promise<Object>} { tips: Array, total: number }
 */
export const getContributionHistory = async (skip = 0, take = 10, status) => {
  try {
    const res = await api.get('/tips/my-contributions', {
      params: { skip, take, ...(status ? { status } : {}) },
    });
    return res.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || 'Failed to fetch contribution history',
      { cause: error }
    );
  }
};

/**
 * Fetch a single tip by ID.
 * @param {string} tipId - The tip ID
 * @returns {Promise<Object>} Tip object
 */
export const getTipById = async (tipId) => {
  try {
    const res = await api.get(`/tips/${tipId}`);
    return res.data.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch tip', {
      cause: error,
    });
  }
};

/**
 * Fetch all roadmaps pending review (Admin only).
 * @returns {Promise<Object>} { roadmaps: Array, total: number }
 */
export const getPendingRoadmaps = async (skip = 0, take = 20) => {
  const res = await api.get(`/roadmaps/pending?skip=${skip}&take=${take}`);
  return res.data.data;
};

/**
 * Fetch roadmap status statistics (Admin only).
 * @returns {Promise<Object>} Status counts
 */
export const getRoadmapStatsByAdmin = async () => {
  const res = await api.get('/roadmaps/stats');
  return res.data.data;
};

/**
 * Approve or Reject a roadmap (Admin only).
 * @param {string} id - Roadmap ID
 * @param {string} status - 'APPROVED' or 'REJECTED'
 * @param {string} feedback - Review feedback
 * @returns {Promise<Object>} Updated roadmap
 */
export const reviewRoadmap = async (id, status, feedback) => {
  const payload = { status };
  if (feedback && feedback.trim()) payload.feedback = feedback.trim();
  const res = await api.post(`/roadmaps/${id}/review`, payload);
  return res.data.data;
};

/**
 * Fetch mentor dashboard stats.
 * @returns {Promise<Object>} Mentor stats
 */
export const getMentorDashboardStats = async () => {
  const res = await api.get('/roadmaps/mentor/stats');
  return res.data.data;
};
