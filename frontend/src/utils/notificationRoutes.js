const normalizeRole = (role = '') => {
  const upperRole = String(role).toUpperCase();
  if (upperRole === 'MENTEE' || upperRole === 'LEARNER') return 'MENTEE';
  if (upperRole === 'MENTOR') return 'MENTOR';
  if (upperRole === 'ADMIN') return 'ADMIN';
  return upperRole;
};

const defaultRouteByRole = {
  ADMIN: '/admin/dashboard',
  MENTOR: '/mentor/dashboard',
  MENTEE: '/mentee/homepage',
};

export const getNotificationTargetRoute = (notification = {}, role = 'MENTEE') => {
  const normalizedRole = normalizeRole(role);
  const notificationType = String(notification?.type || 'SYSTEM').toUpperCase();

  switch (notificationType) {
    case 'CONTRIBUTION':
      if (normalizedRole === 'MENTOR') return '/mentor/reviews';
      if (normalizedRole === 'ADMIN') return '/admin/dashboard';
      return '/mentee/contributions';
    case 'CERTIFICATE':
      if (normalizedRole === 'MENTEE') return '/my-certificates';
      return defaultRouteByRole[normalizedRole] || '/';
    case 'ROADMAP':
      if (normalizedRole === 'ADMIN') return '/admin/roadmaps';
      if (normalizedRole === 'MENTOR') return '/mentor/roadmaps';
      return '/roadmaps';
    case 'QUIZ':
      if (normalizedRole === 'MENTEE') return '/roadmaps';
      if (normalizedRole === 'MENTOR') return '/mentor/dashboard';
      return defaultRouteByRole[normalizedRole] || '/';
    default:
      return defaultRouteByRole[normalizedRole] || '/';
  }
};
