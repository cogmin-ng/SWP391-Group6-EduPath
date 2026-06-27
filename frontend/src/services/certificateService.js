import api from './api';
import { mockCertificates } from '../mock/certificateData';

/**
 * Get all certificates for the current mentee.
 * Falls back to mock data if the API is not available.
 */
export const getMyCertificates = async () => {
  try {
    const res = await api.get('/certificates/my');
    return res.data.data;
  } catch (err) {
    // TODO: Remove mock fallback when backend API is ready
    console.warn('Certificate API not available, using mock data:', err.message);
    return mockCertificates;
  }
};

/**
 * Get a single certificate by ID.
 * Falls back to mock data if the API is not available.
 */
export const getCertificateById = async (id) => {
  try {
    const res = await api.get(`/certificates/${id}`);
    return res.data.data;
  } catch (err) {
    // TODO: Remove mock fallback when backend API is ready
    console.warn('Certificate API not available, using mock data:', err.message);
    const cert = mockCertificates.find((c) => c.id === id);
    if (!cert) throw new Error('Certificate not found');
    return cert;
  }
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
