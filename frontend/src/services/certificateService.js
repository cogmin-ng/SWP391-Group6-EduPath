import api from './api';

/**
 * Get all certificates for the current mentee.
 * Falls back to mock data if the API is not available.
 */
export const getMyCertificates = async () => {
  const res = await api.get('/certificates/my');
  return res.data.data;
};

/**
 * Get a single certificate by ID.
 * Falls back to mock data if the API is not available.
 */
export const getCertificateById = async (id) => {
  const res = await api.get(`/certificates/${id}`);
  return res.data.data;
};

/**
 * Download certificate file.
 * TODO: Implement when backend API is ready.
 */
export const downloadCertificate = async (id) => {
  // TODO: Implement download via backend API
  // Expected endpoint: GET /api/certificates/:id/download
  // Should return a blob / file stream
  try {
    const res = await api.get(`/certificates/${id}/download`, {
      responseType: 'blob',
    });
    return res.data;
  } catch (err) {
    console.warn('Certificate download API not available:', err.message);
    throw new Error('Chức năng tải chứng chỉ chưa sẵn sàng. Vui lòng thử lại sau.');
  }
};
