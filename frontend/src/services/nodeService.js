import api from './api';

export const getNodeDetails = async (nodeId) => {
  try {
    const response = await api.get(`/nodes/${nodeId}`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết node:', error);
    throw error;
  }
};

export const syncNodeDetails = async (nodeId, data) => {
  try {
    const response = await api.put(`/nodes/${nodeId}/details`, data);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi đồng bộ chi tiết node:', error);
    throw error;
  }
};

export const toggleChecklistProgress = async (nodeId, checklistId, completed) => {
  const response = await api.put(`/nodes/${nodeId}/checklists/${checklistId}/toggle`, {
    completed,
  });
  return response.data.data;
};

export const updateNodeProgress = async (nodeId, completed) => {
  const response = await api.put(`/nodes/${nodeId}/progress`, {
    completed,
  });
  return response.data.data;
};
