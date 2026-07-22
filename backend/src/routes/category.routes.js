const { Router } = require("express");
const {
  getCategories,
  getCategory,
  postCategory,
  patchCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createCategorySchema, updateCategorySchema } = require("../validators/category.validator");

const router = Router();

router.use(requireAuth);

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post("/", requireRole("Admin", "Manager"), validate(createCategorySchema), postCategory);
router.patch(
  "/:id",
  requireRole("Admin", "Manager"),
  validate(updateCategorySchema),
  patchCategory
);
router.delete("/:id", requireRole("Admin", "Manager"), deleteCategory);

module.exports = router;