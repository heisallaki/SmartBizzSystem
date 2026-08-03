const businessSettingService = require("../services/businessSetting.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getBusinessSettings = asyncHandler(async (req, res) => {
  const settings = await businessSettingService.getBusinessSettings();
  ApiResponse.ok(res, settings);
});

const patchBusinessSettings = asyncHandler(async (req, res) => {
  const settings = await businessSettingService.updateBusinessSettings(req.body, req.user.id);
  ApiResponse.ok(res, settings);
});

module.exports = { getBusinessSettings, patchBusinessSettings };