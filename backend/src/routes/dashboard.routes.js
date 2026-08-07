const { Router } = require("express");
const { getDashboard } = require("../controllers/dashboard.controller");
const { requireAuth } = require("../middleware/auth");
const { requirePermission } = require("../middleware/permission");

const router = Router();

router.use(requireAuth);

router.get("/", requirePermission("Dashboard", "view"), getDashboard);

module.exports = router;