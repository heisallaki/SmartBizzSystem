const reportService = require("../services/report.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getReports = asyncHandler(async (req, res) => {
  const report = await reportService.generateReport(req.query);
  ApiResponse.ok(res, report);
});

module.exports = { getReports };