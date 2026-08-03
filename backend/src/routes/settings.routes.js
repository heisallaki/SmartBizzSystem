const { Router } = require("express");
const {
  getBusinessSettings,
  patchBusinessSettings,
} = require("../controllers/businessSetting.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { updateBusinessSettingsSchema } = require("../validators/businessSetting.validator");

const router = Router();

router.use(requireAuth);

router.get("/business", getBusinessSettings);
router.patch(
  "/business",
  requireRole("Admin"),
  validate(updateBusinessSettingsSchema),
  patchBusinessSettings
);

module.exports = router;