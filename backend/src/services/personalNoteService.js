const ApiError = require('../utils/ApiError');
const personalNoteRepository = require('../repositories/personalNoteRepository');
const { toRoadmapSlug } = require('../utils/roadmapSlug');

const MSG = {
  nodeNotFound: 'Node not found',
  roadmapNotFound: 'Roadmap not found',
  notEnrolled: 'You are not enrolled in this roadmap',
  noteNotFound: 'Personal learning note not found',
  noNotes: 'This roadmap does not have any personal learning notes to export',
  userNotFound: 'User not found',
};

async function assertNodeEnrollment(nodeId, userId) {
  const node = await personalNoteRepository.findNodeAccess(nodeId, userId);
  if (!node) throw new ApiError(404, MSG.nodeNotFound);

  if (!node.learningPath.enrollments.length) {
    throw new ApiError(403, MSG.notEnrolled);
  }

  return node;
}

exports.listNotes = async (userId, { skip = 0, take = 50 } = {}) => {
  const [notes, total] = await Promise.all([
    personalNoteRepository.findManyByUser(userId, { skip, take }),
    personalNoteRepository.countByUser(userId),
  ]);

  return {
    notes: notes.map((note) => ({
      ...note,
      node: {
        ...note.node,
        learningPath: {
          ...note.node.learningPath,
          slug: toRoadmapSlug(note.node.learningPath.title),
        },
      },
    })),
    total,
  };
};

exports.getNote = async (nodeId, userId) => {
  await assertNodeEnrollment(nodeId, userId);
  return personalNoteRepository.findByNodeAndUser(nodeId, userId);
};

exports.saveNote = async (nodeId, userId, content) => {
  await assertNodeEnrollment(nodeId, userId);
  return personalNoteRepository.upsert({
    nodeId,
    userId,
    content: content.trim(),
  });
};

exports.deleteNote = async (nodeId, userId) => {
  await assertNodeEnrollment(nodeId, userId);
  const result = await personalNoteRepository.softDelete(nodeId, userId);
  if (!result.count) throw new ApiError(404, MSG.noteNotFound);
};

exports.getRoadmapExportData = async (roadmapId, userId) => {
  const [roadmap, user] = await Promise.all([
    personalNoteRepository.findRoadmapForExport(roadmapId, userId),
    personalNoteRepository.findUserForExport(userId),
  ]);

  if (!roadmap) throw new ApiError(404, MSG.roadmapNotFound);
  if (!roadmap.enrollments.length) throw new ApiError(403, MSG.notEnrolled);
  if (!user) throw new ApiError(404, MSG.userNotFound);

  const notes = roadmap.nodes.flatMap((node) => {
    const note = node.personalLearningNotes[0];
    return note ? [{ ...note, node }] : [];
  });

  if (!notes.length) throw new ApiError(404, MSG.noNotes);

  return {
    roadmap: { id: roadmap.id, title: roadmap.title },
    user,
    notes,
    exportedAt: new Date(),
  };
};
