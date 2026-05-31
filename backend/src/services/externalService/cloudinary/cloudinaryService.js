const path = require('node:path');
const { randomUUID } = require('node:crypto');
const ApiError = require('../../../utils/ApiError');
const config = require('../../../config');
const {
  cloudinary,
  isCloudinaryConfigured,
} = require('../../../lib/cloudinary');
const { upload: uploadMessages } = require('../../../constants/messages');

const buildUploadOptions = ({ folder, resourceType, filename }) => {
  const parsedName = path.parse(filename || 'upload').name;

  return {
    folder: folder || config.cloudinary.uploadFolder,
    resource_type: resourceType || 'auto',
    public_id: `${parsedName}-${randomUUID()}`,
    overwrite: false,
    unique_filename: false,
    use_filename: false,
    secure: true,
  };
};

const uploadBuffer = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );

    stream.end(buffer);
  });
};

exports.uploadMedia = async (file, { folder, resourceType } = {}) => {
  if (!isCloudinaryConfigured()) {
    throw new ApiError(503, uploadMessages.cloudinaryNotConfigured);
  }

  if (!file || !file.buffer) {
    throw new ApiError(400, uploadMessages.fileRequired);
  }

  const result = await uploadBuffer(
    file.buffer,
    buildUploadOptions({
      folder,
      resourceType,
      filename: file.originalname,
    })
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type,
    format: result.format || null,
    bytes: result.bytes || null,
    width: result.width || null,
    height: result.height || null,
    originalName: file.originalname || null,
  };
};

exports.deleteMedia = async (publicId, resourceType = 'image') => {
  if (!isCloudinaryConfigured()) {
    throw new ApiError(503, uploadMessages.cloudinaryNotConfigured);
  }

  if (!publicId) {
    throw new ApiError(400, 'publicId is required');
  }

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};
