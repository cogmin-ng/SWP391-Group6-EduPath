import api from './api';

export const getMentorLearners = async ({
  page = 1,
  limit = 10,
  search = '',
  status,
} = {}) => {
  const response = await api.get('/mentors/learners', {
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
      ...(status ? { status } : {}),
    },
  });
  return response.data.data;
};

export const sendLearnerReminder = async (enrollmentId, payload) => {
  const response = await api.post(
    `/mentors/learners/${enrollmentId}/reminders`,
    payload
  );
  return response.data.data;
};
