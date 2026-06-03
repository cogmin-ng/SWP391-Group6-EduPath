// ============================================================
// Roadmap & Node API Service
// Currently returns mock data. Replace with real axios calls
// when the backend endpoints are ready.
// ============================================================

import {
  mockRoadmap,
  mockNode,
  mockChecklist,
  mockMaterials,
  mockQuiz,
  mockTips,
} from '../mock/menteeNodeDetailData';
import api from './api';

/**
 * Fetch roadmap overview (sidebar data).
 * @param {string} roadmapId
 * @returns {Promise<Object>}
 */
export const getRoadmapById = async (roadmapId) => {
  // TODO: Replace with → api.get(`/roadmaps/${roadmapId}`)
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRoadmap), 300);
  });
};

/**
 * Fetch node details.
 * @param {string} roadmapId
 * @param {string} nodeId
 * @returns {Promise<Object>}
 */
export const getNodeDetails = async (roadmapId, nodeId) => {
  // TODO: Replace with → api.get(`/roadmaps/${roadmapId}/nodes/${nodeId}`)
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockNode), 300);
  });
};

/**
 * Fetch checklist items for a node.
 * @param {string} nodeId
 * @returns {Promise<Array>}
 */
export const getChecklist = async (nodeId) => {
  // TODO: Replace with → api.get(`/nodes/${nodeId}/checklist`)
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockChecklist), 200);
  });
};

/**
 * Fetch learning materials for a node.
 * @param {string} nodeId
 * @returns {Promise<Array>}
 */
export const getMaterials = async (nodeId) => {
  // TODO: Replace with → api.get(`/nodes/${nodeId}/materials`)
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMaterials), 200);
  });
};

/**
 * Fetch quiz info for a node.
 * @param {string} nodeId
 * @returns {Promise<Object>}
 */
export const getQuiz = async (nodeId) => {
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
  } catch (err) {
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
  } catch (err) {
    throw new Error(err?.response?.data?.message || 'Failed to fetch pending tips');
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
  } catch (err) {
    throw new Error(err?.response?.data?.message || 'Failed to approve tip');
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
  } catch (err) {
    throw new Error(err?.response?.data?.message || 'Failed to reject tip');
  }
};

/**
 * Fetch mentee's tip contribution history.
 * @param {number} skip - Pagination offset (default 0)
 * @param {number} take - Pagination limit (default 10)
 * @returns {Promise<Object>} { tips: Array, total: number }
 */
export const getContributionHistory = async (skip = 0, take = 10) => {
  try {
    const res = await api.get(`/tips/my-contributions?skip=${skip}&take=${take}`);
    return res.data.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message || 'Failed to fetch contribution history');
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
  } catch (err) {
    throw new Error(err?.response?.data?.message || 'Failed to fetch tip');
  }
};
