const prisma = require("../config/prisma");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getHealth = asyncHandler(async (req, res) => {
  ApiResponse.ok(res, { status: "ok", uptimeSeconds: process.uptime() });
});

const getDbHealth = asyncHandler(async (req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  ApiResponse.ok(res, { status: "ok", database: "connected" });
});

module.exports = { getHealth, getDbHealth };