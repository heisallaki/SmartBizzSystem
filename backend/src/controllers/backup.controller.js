const backupService = require("../services/backup.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const postBackup = asyncHandler(async (req, res) => {
  const { backup, data, fileName } = await backupService.createBackup(req.user.id);

  ApiResponse.created(res, {
    id: backup.id,
    fileName,
    fileSizeBytes: backup.fileSizeBytes,
    startedAt: backup.startedAt,
    completedAt: backup.completedAt,
    data,
  });
});

const getBackups = asyncHandler(async (req, res) => {
  const result = await backupService.listBackups(req.query);

  ApiResponse.ok(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
  });
});

module.exports = { postBackup, getBackups };