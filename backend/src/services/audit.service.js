const prisma = require("../config/prisma");

async function logAudit({
  userId = null,
  action,
  entityType,
  entityId = null,
  metadata = null,
  ipAddress = null,
}) {
  try {
    await prisma.auditLog.create({
      data: { userId, action, entityType, entityId, metadata, ipAddress },
    });
  } catch (error) {
    // An audit-log write failing should never take down the request that
    // triggered it — log it locally and move on.
    console.error("Failed to write audit log:", error);
  }
}

module.exports = { logAudit };