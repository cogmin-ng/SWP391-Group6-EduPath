const personalNoteService = require('../services/personalNoteService');
const notePdfExporter = require('../services/notePdfExporter');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

function buildPdfFilename(title) {
  const slug = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return `${slug || 'roadmap'}-personal-notes.pdf`;
}

exports.listNotes = asyncHandler(async (req, res) => {
  const result = await personalNoteService.listNotes(req.user.id, req.query);

  return sendSuccess(res, {
    message: 'Personal learning notes retrieved successfully',
    data: result,
  });
});

exports.getNote = asyncHandler(async (req, res) => {
  const note = await personalNoteService.getNote(
    req.params.nodeId,
    req.user.id
  );

  return sendSuccess(res, {
    message: 'Personal learning note retrieved successfully',
    data: { note },
  });
});

exports.saveNote = asyncHandler(async (req, res) => {
  const note = await personalNoteService.saveNote(
    req.params.nodeId,
    req.user.id,
    req.body.content
  );

  return sendSuccess(res, {
    message: 'Personal learning note saved successfully',
    data: note,
  });
});

exports.deleteNote = asyncHandler(async (req, res) => {
  await personalNoteService.deleteNote(req.params.nodeId, req.user.id);

  return sendSuccess(res, {
    message: 'Personal learning note deleted successfully',
  });
});

exports.exportRoadmapNotes = asyncHandler(async (req, res) => {
  const exportData = await personalNoteService.getRoadmapExportData(
    req.params.roadmapId,
    req.user.id
  );
  const filename = buildPdfFilename(exportData.roadmap.title);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Cache-Control', 'private, no-store');
  notePdfExporter.stream(res, exportData);
});
