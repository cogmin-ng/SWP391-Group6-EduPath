const prisma = require('../lib/prisma');

function toRoadmapSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function findLearningPathIdBySlug(slug) {
  const learningPaths = await prisma.learningPath.findMany({
    where: { isDeleted: false },
    select: { id: true, title: true },
  });

  const match = learningPaths.find(
    (item) => toRoadmapSlug(item.title) === slug
  );
  return match?.id || null;
}

module.exports = {
  toRoadmapSlug,
  findLearningPathIdBySlug,
};
