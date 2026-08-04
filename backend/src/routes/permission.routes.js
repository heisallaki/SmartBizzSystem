const { Router } = require("express");
const {
  getPermissions,
  getRoleMatrix,
  putRoleMatrix,
} = require("../controllers/permission.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { updateRolePermissionsSchema } = require("../validators/permission.validator");

const router = Router();

router.use(requireAuth);
router.use(requireRole("Admin"));

router.get("/", getPermissions);
router.get("/roles/:roleId", getRoleMatrix);
router.put("/roles/:roleId", validate(updateRolePermissionsSchema), putRoleMatrix);

module.exports = router;