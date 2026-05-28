const uploadService = require('../services/upload.service');
const apiResponse = require('../utils/apiResponse');

exports.uploadFile = async (req, res) => {
  // Business logic for upload
  const fileData = await uploadService.processUpload(req.body);
  
  return apiResponse(res, fileData, 'Upload successful');
};