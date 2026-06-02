const ENROLLMENTS_KEY = 'enrolledRoadmaps';

export function getEnrollments() {
  const raw = localStorage.getItem(ENROLLMENTS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isEnrolled(roadmapSlug) {
  return getEnrollments().some((item) => item.slug === roadmapSlug);
}

export function enrollRoadmap(roadmapSlug) {
  const enrollments = getEnrollments();
  if (enrollments.some((item) => item.slug === roadmapSlug)) {
    return enrollments;
  }

  const next = [
    ...enrollments,
    {
      slug: roadmapSlug,
      progress: 45,
      enrolledAt: new Date().toISOString(),
    },
  ];

  localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(next));
  return next;
}

export function getEnrollmentBySlug(roadmapSlug) {
  return getEnrollments().find((item) => item.slug === roadmapSlug) || null;
}

export function updateEnrollmentProgress(roadmapSlug, nextProgress) {
  const enrollments = getEnrollments();
  const updated = enrollments.map((item) => {
    if (item.slug !== roadmapSlug) return item;
    return { ...item, progress: Math.max(0, Math.min(100, nextProgress)) };
  });
  localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(updated));
  return updated;
}
