import api from './api';

export const mentorApplicationService = {
  /**
   * Submit a mentor application.
   * Uses multipart/form-data to support CV file upload.
   *
   * @param {Object} data
   * @param {string} data.fullName
   * @param {string} data.experienceYears
   * @param {string} data.specialization
   * @param {string} data.description
   * @param {string[]} data.certifications
   * @param {string} [data.linkedinUrl]
   * @param {string} [data.githubUrl]
   * @param {string} [data.portfolioUrl]
   * @param {string} [data.personalWebsiteUrl]
   * @param {File}   [data.cvFile]
   */
  submit(data) {
    const formData = new FormData();

    formData.append('fullName', data.fullName);
    formData.append('experienceYears', data.experienceYears);
    formData.append('specialization', data.specialization);
    formData.append('description', data.description);

    if (data.certifications?.length) {
      formData.append('certifications', JSON.stringify(data.certifications));
    }

    if (data.linkedinUrl) formData.append('linkedinUrl', data.linkedinUrl);
    if (data.githubUrl) formData.append('githubUrl', data.githubUrl);
    if (data.portfolioUrl) formData.append('portfolioUrl', data.portfolioUrl);
    if (data.personalWebsiteUrl) formData.append('personalWebsiteUrl', data.personalWebsiteUrl);

    if (data.cvFile) {
      formData.append('cvFile', data.cvFile);
    }

    return api.post('/mentor-applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
