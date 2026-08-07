const { Router } = require("express");
const { getReports } = require("../controllers/report.controller");
const { requireAuth } = require("../middleware/auth");
const { requirePermission } = require("../middleware/permission");
const validate = require("../middleware/validate");
const { reportsQuerySchema } = require("../validators/report.validator");

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  requirePermission("Reports", "view"),
  validate(reportsQuerySchema, "query"),
  getReports
);

module.exports = router;