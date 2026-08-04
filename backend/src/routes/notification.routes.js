const { Router } = require("express");
const {
  getNotifications,
  getUnreadCount,
  patchMarkAsRead,
  postMarkAllAsRead,
  deleteNotification,
} = require("../controllers/notification.controller");
const { requireAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { listNotificationsQuerySchema } = require("../validators/notification.validator");

const router = Router();

router.use(requireAuth);

router.get("/", validate(listNotificationsQuerySchema, "query"), getNotifications);
router.get("/unread-count", getUnreadCount);
router.post("/read-all", postMarkAllAsRead);
router.patch("/:id/read", patchMarkAsRead);
router.delete("/:id", deleteNotification);

module.exports = router;