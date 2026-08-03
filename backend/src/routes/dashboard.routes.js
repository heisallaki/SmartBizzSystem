const { Router } = require("express");
const { getDashboard } = require("../controllers/dashboard.controller");
const { requireAuth } = require("../middleware/auth");

const router = Router();

router.use(requireAuth);

router.get("/", getDashboard);

module.exports = router;