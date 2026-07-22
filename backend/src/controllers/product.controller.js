const productService = require("../services/product.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.listProducts(req.query);
  ApiResponse.ok(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(Number(req.params.id));
  ApiResponse.ok(res, product);
});

const postProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body, req.user.id);
  ApiResponse.created(res, product);
});

const patchProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(
    Number(req.params.id),
    req.body,
    req.user.id
  );
  ApiResponse.ok(res, product);
});

const deleteProductHandler = asyncHandler(async (req, res) => {
  await productService.deleteProduct(Number(req.params.id), req.user.id);
  ApiResponse.noContent(res);
});

const postAdjustStock = asyncHandler(async (req, res) => {
  const result = await productService.adjustStock({
    productId: Number(req.params.id),
    ...req.body,
    actorId: req.user.id,
  });
  ApiResponse.ok(res, result);
});

const postBatchAdjustStock = asyncHandler(async (req, res) => {
  const results = await productService.batchAdjustStock({
    ...req.body,
    actorId: req.user.id,
  });
  ApiResponse.ok(res, results);
});

const getStockMovements = asyncHandler(async (req, res) => {
  const result = await productService.listStockMovements(Number(req.params.id), req.query);
  ApiResponse.ok(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
  });
});

module.exports = {
  getProducts,
  getProduct,
  postProduct,
  patchProduct,
  deleteProduct: deleteProductHandler,
  postAdjustStock,
  postBatchAdjustStock,
  getStockMovements,
};