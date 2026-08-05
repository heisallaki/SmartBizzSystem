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
    console.error("Failed to write audit log:", error);
  }
}

function mapAuditLog(entry) {
  return {
    id: entry.id,
    userId: entry.userId,
    userName: entry.user?.fullName || "System",
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    metadata: entry.metadata,
    ipAddress: entry.ipAddress,
    createdAt: entry.createdAt,
  };
}

async function listAuditLogs({ userId, entityType, action, startDate, endDate, page, limit }) {
  const where = {
    ...(userId !== undefined && { userId }),
    ...(entityType && { entityType }),
    ...(action && { action }),
    ...((startDate || endDate) && {
      createdAt: {
        ...(startDate && { gte: new Date(`${startDate}T00:00:00.000Z`) }),
        ...(endDate && { lte: new Date(`${endDate}T23:59:59.999Z`) }),
      },
    }),
  };

  const [items, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      where,
      include: { user: { select: { id: true, fullName: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    items: items.map(mapAuditLog),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

async function getAuditMeta() {
  const [actions, entityTypes] = await Promise.all([
    prisma.auditLog.findMany({
      distinct: ["action"],
      select: { action: true },
      orderBy: { action: "asc" },
    }),
    prisma.auditLog.findMany({
      distinct: ["entityType"],
      select: { entityType: true },
      orderBy: { entityType: "asc" },
    }),
  ]);

  return {
    actions: actions.map((entry) => entry.action),
    entityTypes: entityTypes.map((entry) => entry.entityType),
  };
}

module.exports = { logAudit, listAuditLogs, getAuditMeta };