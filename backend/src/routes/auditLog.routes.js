const { Router } = require("express");
const { getAuditLogs, getAuditMeta } = require("../controllers/auditLog.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { listAuditLogsQuerySchema } = require("../validators/auditLog.validator");

const router = Router();

router.use(requireAuth);
router.use(requireRole("Admin"));

router.get("/meta", getAuditMeta);
router.get("/", validate(listAuditLogsQuerySchema, "query"), getAuditLogs);

module.exports = router;