const { Router } = require("express");
const { postBackup, getBackups } = require("../controllers/backup.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { listBackupsQuerySchema } = require("../validators/backup.validator");

const router = Router();

router.use(requireAuth);
router.use(requireRole("Admin"));

router.get("/", validate(listBackupsQuerySchema, "query"), getBackups);
router.post("/", postBackup);

module.exports = router;