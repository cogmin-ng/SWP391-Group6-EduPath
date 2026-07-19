import api from './api';

export const mentorApplicationService = {
  /**
   * Get all active subjects from the database.
   * @returns {Promise<Array<{ id: string, name: string, description: string }>>}
   */
  async getSubjects(categoryId) {
    const params = { availableForMentor: true };
    if (categoryId) params.categoryId = categoryId;
    const { data } = await api.get('/subjects', { params });
    return data.data;
  },

  async getMajors() {
    const { data } = await api.get('/majors');
    return data.data;
  },

  /**
   * Submit a new advisor (mentor) application.
   *
   * @param {Object} payload
   * @param {string} payload.specialization
   * @param {string} payload.currentSemester
   * @param {string} payload.bio
   * @param {string} payload.experience
   * @param {string} [payload.transcriptUrl]
   * @param {string[]} payload.subjectIds
   * @param {Array<{ subjectId: string, grade: number }>} payload.academicRecords
   */
  async submit(payload) {
    const { data } = await api.post('/advisor-applications', payload);
    return data.data;
  },

  /**
   * Get current user's latest application status.
   * @returns {Promise<Object|null>}
   */
  async getMyApplication() {
    const { data } = await api.get('/advisor-applications/me');
    return data.data;
  },

  /**
   * Get all approved subjects for the current mentor.
   * @returns {Promise<Array<{ id: string, name: string, categoryId: string }>>}
   */
  async getMyApprovedSubjects() {
    const { data } = await api.get('/advisor-applications/me/approved-subjects');
    return data.data;
  },

  /**
   * Upload transcript file via the existing media upload endpoint.
   * @param {File} file
   * @returns {Promise<{ url: string, publicId: string }>}
   */
  async uploadTranscript(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'advisor-transcripts');
    formData.append('resourceType', 'auto');

    const { data } = await api.post('/uploads/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  /**
   * Get all advisor applications (Admin only)
   */
  async getAllApplications() {
    const { data } = await api.get('/advisor-applications/all');
    return data.data;
  },

  /**
   * Update the status of an advisor application
   */
  async updateApplicationStatus(id, status, rejectReason = null) {
    const { data } = await api.put(`/advisor-applications/${id}/status`, { status, rejectReason });
    return data.data;
  },
};
