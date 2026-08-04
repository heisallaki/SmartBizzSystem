const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");

const NOTIFIABLE_ROLES = ["Admin", "Manager"];

async function getNotifiableUserIds(db) {
  const roles = await db.role.findMany({
    where: { name: { in: NOTIFIABLE_ROLES } },
    select: { id: true },
  });
  const roleIds = roles.map((role) => role.id);

  const users = await db.user.findMany({
    where: { roleId: { in: roleIds }, status: "Active", deletedAt: null },
    select: { id: true },
  });

  return users.map((user) => user.id);
}

async function createForUsers(db, userIds, { type, title, message }) {
  if (userIds.length === 0) return;

  await db.notification.createMany({
    data: userIds.map((userId) => ({ userId, type, title, message })),
  });
}

async function notifyLowStock(product, tx) {
  const db = tx || prisma;

  try {
    const userIds = await getNotifiableUserIds(db);

    const title = product.status === "OutOfStock" ? "Product out of stock" : "Product running low";
    const unit = product.stock === 1 ? "unit" : "units";

    await createForUsers(db, userIds, {
      type: "low_stock",
      title,
      message: `${product.name} is now at ${product.stock} ${unit} in stock.`,
    });
  } catch (error) {
    console.error("Failed to create low stock notification", error);
  }
}

async function notifyNewSale(sale, tx) {
  const db = tx || prisma;

  try {
    const userIds = await getNotifiableUserIds(db);

    await createForUsers(db, userIds, {
      type: "sale",
      title: "New sale completed",
      message: `${sale.invoiceNumber} was completed for KES ${Number(sale.grandTotal).toLocaleString()}.`,
    });
  } catch (error) {
    console.error("Failed to create sale notification", error);
  }
}

async function listNotifications({ userId, isRead, page, limit }) {
  const where = {
    userId,
    ...(isRead !== undefined && { isRead }),
  };

  const [items, total, unreadCount] = await prisma.$transaction([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    unreadCount,
  };
}

async function getUnreadCount(userId) {
  return prisma.notification.count({ where: { userId, isRead: false } });
}

async function markAsRead(id, userId) {
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification || notification.userId !== userId) {
    throw ApiError.notFound("Notification not found.");
  }

  return prisma.notification.update({
    where: { id },
    data: { isRead: true, readAt: new Date() },
  });
}

async function markAllAsRead(userId) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
}

async function deleteNotification(id, userId) {
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification || notification.userId !== userId) {
    throw ApiError.notFound("Notification not found.");
  }

  await prisma.notification.delete({ where: { id } });
}

module.exports = {
  notifyLowStock,
  notifyNewSale,
  listNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};