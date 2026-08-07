const { Router } = require("express");
const {
  getCategories,
  getCategory,
  postCategory,
  patchCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { requireAuth } = require("../middleware/auth");
const { requirePermission } = require("../middleware/permission");
const validate = require("../middleware/validate");
const { createCategorySchema, updateCategorySchema } = require("../validators/category.validator");

const router = Router();

router.use(requireAuth);

router.get("/", requirePermission("Inventory", "view"), getCategories);
router.get("/:id", requirePermission("Inventory", "view"), getCategory);
router.post(
  "/",
  requirePermission("Inventory", "create"),
  validate(createCategorySchema),
  postCategory
);
router.patch(
  "/:id",
  requirePermission("Inventory", "edit"),
  validate(updateCategorySchema),
  patchCategory
);
router.delete("/:id", requirePermission("Inventory", "delete"), deleteCategory);

module.exports = router;