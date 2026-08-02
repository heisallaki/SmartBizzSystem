const expenseService = require("../services/expense.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getExpenseCategories = asyncHandler(async (req, res) => {
  const categories = await expenseService.listExpenseCategories();
  ApiResponse.ok(res, categories);
});

const postExpenseCategory = asyncHandler(async (req, res) => {
  const category = await expenseService.createExpenseCategory(req.body, req.user.id);
  ApiResponse.created(res, category);
});

const getExpenses = asyncHandler(async (req, res) => {
  const result = await expenseService.listExpenses(req.query);
  ApiResponse.ok(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
  });
});

const getExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.getExpenseById(Number(req.params.id));
  ApiResponse.ok(res, expense);
});

const postExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.createExpense(req.body, req.user.id);
  ApiResponse.created(res, expense);
});

const patchExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.updateExpense(
    Number(req.params.id),
    req.body,
    req.user.id
  );
  ApiResponse.ok(res, expense);
});

const deleteExpenseHandler = asyncHandler(async (req, res) => {
  await expenseService.deleteExpense(Number(req.params.id), req.user.id);
  ApiResponse.noContent(res);
});

module.exports = {
  getExpenseCategories,
  postExpenseCategory,
  getExpenses,
  getExpense,
  postExpense,
  patchExpense,
  deleteExpense: deleteExpenseHandler,
};