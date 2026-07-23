// Just the 3 system roles for picker dropdowns — no sensitive data, so this
// only requires being logged in, not Admin specifically.

const { Router } = require("express");
const { getRoles } = require("../controllers/user.controller");
const { requireAuth } = require("../middleware/auth");

const router = Router();

router.use(requireAuth);
router.get("/", getRoles);

module.exports = router;