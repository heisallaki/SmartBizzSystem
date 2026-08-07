const { Router } = require("express");
const {
  getExpenseCategories,
  postExpenseCategory,
  getExpenses,
  getExpense,
  postExpense,
  patchExpense,
  deleteExpense,
} = require("../controllers/expense.controller");
const { requireAuth } = require("../middleware/auth");
const { requirePermission } = require("../middleware/permission");
const validate = require("../middleware/validate");
const {
  listExpensesQuerySchema,
  createExpenseSchema,
  updateExpenseSchema,
  createExpenseCategorySchema,
} = require("../validators/expense.validator");

const router = Router();

router.use(requireAuth);

router.get("/categories", requirePermission("Expenses", "view"), getExpenseCategories);
router.post(
  "/categories",
  requirePermission("Expenses", "create"),
  validate(createExpenseCategorySchema),
  postExpenseCategory
);

router.get(
  "/",
  requirePermission("Expenses", "view"),
  validate(listExpensesQuerySchema, "query"),
  getExpenses
);
router.get("/:id", requirePermission("Expenses", "view"), getExpense);
router.post(
  "/",
  requirePermission("Expenses", "create"),
  validate(createExpenseSchema),
  postExpense
);
router.patch(
  "/:id",
  requirePermission("Expenses", "edit"),
  validate(updateExpenseSchema),
  patchExpense
);
router.delete("/:id", requirePermission("Expenses", "delete"), deleteExpense);

module.exports = router;