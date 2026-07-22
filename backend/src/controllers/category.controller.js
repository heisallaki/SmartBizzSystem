const categoryService = require("../services/category.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategories();
  ApiResponse.ok(res, categories);
});

const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(Number(req.params.id));
  ApiResponse.ok(res, category);
});

const postCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body, req.user.id);
  ApiResponse.created(res, category);
});

const patchCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(
    Number(req.params.id),
    req.body,
    req.user.id
  );
  ApiResponse.ok(res, category);
});

const deleteCategoryHandler = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(Number(req.params.id), req.user.id);
  ApiResponse.noContent(res);
});

module.exports = {
  getCategories,
  getCategory,
  postCategory,
  patchCategory,
  deleteCategory: deleteCategoryHandler,
};