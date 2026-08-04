const notificationService = require("../services/notification.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.listNotifications({
    userId: req.user.id,
    ...req.query,
  });

  ApiResponse.ok(
    res,
    { items: result.items, unreadCount: result.unreadCount },
    { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages }
  );
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user.id);
  ApiResponse.ok(res, { count });
});

const patchMarkAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(Number(req.params.id), req.user.id);
  ApiResponse.ok(res, notification);
});

const postMarkAllAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);
  ApiResponse.ok(res, { success: true });
});

const deleteNotificationHandler = asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(Number(req.params.id), req.user.id);
  ApiResponse.noContent(res);
});

module.exports = {
  getNotifications,
  getUnreadCount,
  patchMarkAsRead,
  postMarkAllAsRead,
  deleteNotification: deleteNotificationHandler,
};