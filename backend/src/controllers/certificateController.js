const certificateService = require('../services/certificateService');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/response');

exports.getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await certificateService.getMyCertificates(req.user.id);

  return sendSuccess(res, {
    message: 'Certificates retrieved successfully',
    data: certificates,
  });
});

exports.getCertificateDetail = asyncHandler(async (req, res) => {
  const certificate = await certificateService.getCertificateDetail(
    req.params.id,
    req.user.id
  );

  return sendSuccess(res, {
    message: 'Certificate retrieved successfully',
    data: certificate,
  });
});

exports.verifyCertificate = asyncHandler(async (req, res) => {
  const result = await certificateService.verifyCertificate(
    req.params.verificationId
  );

  return sendSuccess(res, {
    message: result.valid
      ? 'Certificate is valid'
      : 'Certificate not found or invalid',
    data: result,
  });
});

exports.downloadCertificate = asyncHandler(async (req, res) => {
  const result = await certificateService.downloadCertificate(
    req.params.id,
    req.user.id
  );

  return sendSuccess(res, {
    message: 'Certificate download URL retrieved successfully',
    data: result,
  });
});
