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
  const title = String(notification?.title || '').toLowerCase();
  const content = String(notification?.content || '').toLowerCase();

  switch (notificationType) {
    case 'CONTRIBUTION':
      if (normalizedRole === 'MENTOR') return '/mentor/reviews';
      if (normalizedRole === 'ADMIN') return '/admin/categories';
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
    case 'SYSTEM':
      if (normalizedRole === 'ADMIN') {
        if (title.includes('mentor') || content.includes('mentor')) {
          return '/admin/mentors';
        }
        if (title.includes('lộ trình') || content.includes('lộ trình') || title.includes('roadmap') || content.includes('roadmap')) {
          return '/admin/roadmaps';
        }
      }
      if (normalizedRole === 'MENTOR') {
        if (title.includes('lộ trình') || content.includes('lộ trình') || title.includes('roadmap') || content.includes('roadmap')) {
          return '/mentor/roadmaps';
        }
        if (title.includes('đóng góp') || content.includes('đóng góp') || title.includes('tip') || content.includes('gợi ý')) {
          return '/mentor/reviews';
        }
      }
      return defaultRouteByRole[normalizedRole] || '/';
    default:
      if (title.includes('lộ trình') || content.includes('lộ trình')) {
        if (normalizedRole === 'ADMIN') return '/admin/roadmaps';
        if (normalizedRole === 'MENTOR') return '/mentor/roadmaps';
        return '/roadmaps';
      }
      return defaultRouteByRole[normalizedRole] || '/';
  }
};
