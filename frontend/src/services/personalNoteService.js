import api from './api';

export const getPersonalNotes = async ({ skip = 0, take = 100 } = {}) => {
  const response = await api.get('/personal-notes', {
    params: { skip, take },
  });
  return response.data.data;
};

export const getPersonalNote = async (nodeId) => {
  const response = await api.get(`/personal-notes/nodes/${nodeId}`);
  return response.data.data.note;
};

export const savePersonalNote = async (nodeId, content) => {
  const response = await api.put(`/personal-notes/nodes/${nodeId}`, {
    content,
  });
  return response.data.data;
};

export const deletePersonalNote = async (nodeId) => {
  const response = await api.delete(`/personal-notes/nodes/${nodeId}`);
  return response.data;
};

export const exportRoadmapNotesPdf = async (roadmapId) => {
  const response = await api.get(
    `/personal-notes/roadmaps/${roadmapId}/export`,
    { responseType: 'blob' }
  );
  const disposition = response.headers['content-disposition'] || '';
  const filenameMatch = disposition.match(/filename="?([^";]+)"?/i);

  return {
    blob: response.data,
    filename: filenameMatch?.[1] || 'roadmap-personal-notes.pdf',
  };
};
