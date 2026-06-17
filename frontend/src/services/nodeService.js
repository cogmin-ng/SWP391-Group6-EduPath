import api from './api';

export const getNodeDetails = async (nodeId) => {
  try {
    const response = await api.get(`/nodes/${nodeId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết node:', error);
    throw error;
  }
};

export const syncNodeDetails = async (nodeId, data) => {
  try {
    const response = await api.put(`/nodes/${nodeId}/details`, data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đồng bộ chi tiết node:', error);
    throw error;
  }
};
