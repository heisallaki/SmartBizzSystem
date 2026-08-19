const { Router } = require("express");
const { getRoles } = require("../controllers/user.controller");
const { requireAuth } = require("../middleware/auth");

const router = Router();

router.use(requireAuth);
router.get("/", getRoles);

module.exports = router;