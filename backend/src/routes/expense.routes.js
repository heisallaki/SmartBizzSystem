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
const { requireAuth, requireRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  listExpensesQuerySchema,
  createExpenseSchema,
  updateExpenseSchema,
  createExpenseCategorySchema,
} = require("../validators/expense.validator");

const router = Router();

router.use(requireAuth);
router.use(requireRole("Admin", "Manager"));

router.get("/categories", getExpenseCategories);
router.post("/categories", validate(createExpenseCategorySchema), postExpenseCategory);

router.get("/", validate(listExpensesQuerySchema, "query"), getExpenses);
router.get("/:id", getExpense);
router.post("/", validate(createExpenseSchema), postExpense);
router.patch("/:id", validate(updateExpenseSchema), patchExpense);
router.delete("/:id", deleteExpense);

module.exports = router;