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
  // TODO: Replace with → api.get(`/nodes/${nodeId}/tips`)
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTips), 200);
  });
};

/**
 * Submit a new tip.
 * @param {string} nodeId
 * @param {string} content
 * @returns {Promise<Object>}
 */
export const submitTip = async (nodeId, content) => {
  // TODO: Replace with → api.post(`/nodes/${nodeId}/tips`, { content })
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          id: `tip-${Date.now()}`,
          content,
        }),
      300
    );
  });
};
