const notificationPreferenceService = require("../services/notificationPreference.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getNotificationPreferences = asyncHandler(async (req, res) => {
  const preferences = await notificationPreferenceService.getNotificationPreferences();
  ApiResponse.ok(res, preferences);
});

const patchNotificationPreferences = asyncHandler(async (req, res) => {
  const preferences = await notificationPreferenceService.updateNotificationPreferences(
    req.body,
    req.user.id
  );
  ApiResponse.ok(res, preferences);
});

module.exports = { getNotificationPreferences, patchNotificationPreferences };