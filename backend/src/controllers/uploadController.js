const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');
const cloudinaryService = require('../services/externalService/cloudinary/cloudinaryService');
const { upload: uploadMessages } = require('../constants/messages');

exports.uploadMedia = asyncHandler(async (req, res) => {
  const uploaded = await cloudinaryService.uploadMedia(req.file, {
    folder: req.body.folder,
    resourceType: req.body.resourceType,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: uploadMessages.uploadSuccess,
    data: uploaded,
  });
});

exports.deleteMedia = asyncHandler(async (req, res) => {
  const { publicId, resourceType } = req.body;

  await cloudinaryService.deleteMedia(publicId, resourceType);

  return sendSuccess(res, {
    message: uploadMessages.deleteSuccess,
    data: {
      publicId,
      resourceType,
    },
  });
});
