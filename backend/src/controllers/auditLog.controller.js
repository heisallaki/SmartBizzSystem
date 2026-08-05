const auditService = require("../services/audit.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getAuditLogs = asyncHandler(async (req, res) => {
  const result = await auditService.listAuditLogs(req.query);

  ApiResponse.ok(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
  });
});

const getAuditMeta = asyncHandler(async (req, res) => {
  const meta = await auditService.getAuditMeta();
  ApiResponse.ok(res, meta);
});

module.exports = { getAuditLogs, getAuditMeta };