const dashboardService = require("../services/dashboard.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getDashboard();
  ApiResponse.ok(res, dashboard);
});

module.exports = { getDashboard };