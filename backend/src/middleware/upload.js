const multer = require('multer');
const ApiError = require('../utils/ApiError');
const { upload: uploadMessages } = require('../constants/messages');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    files: 1,
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const isAllowed =
      file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');

    if (!isAllowed) {
      return cb(new ApiError(400, uploadMessages.invalidFileType));
    }

    return cb(null, true);
  },
});

const handleMulterError = (error, next) => {
  if (!error) {
    return next();
  }

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return next(new ApiError(400, uploadMessages.fileTooLarge));
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      return next(new ApiError(400, 'Only one file can be uploaded at a time'));
    }

    return next(new ApiError(400, error.message));
  }

  return next(error);
};

const singleMediaUpload = (req, res, next) => {
  upload.single('file')(req, res, (error) => {
    return handleMulterError(error, next);
  });
};

module.exports = {
  singleMediaUpload,
};
