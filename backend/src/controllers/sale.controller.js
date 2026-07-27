const saleService = require("../services/sale.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getSales = asyncHandler(async (req, res) => {
  const result = await saleService.listSales(req.query);
  ApiResponse.ok(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
  });
});

const getSale = asyncHandler(async (req, res) => {
  const sale = await saleService.getSaleById(Number(req.params.id));
  ApiResponse.ok(res, sale);
});

const postSale = asyncHandler(async (req, res) => {
  const sale = await saleService.createSale(req.body, req.user.id);
  ApiResponse.created(res, sale);
});

const patchSale = asyncHandler(async (req, res) => {
  const sale = await saleService.updateSale(Number(req.params.id), req.body, req.user.id);
  ApiResponse.ok(res, sale);
});

const postVoidSale = asyncHandler(async (req, res) => {
  const sale = await saleService.voidSale(Number(req.params.id), req.user.id);
  ApiResponse.ok(res, sale);
});

const deleteSaleHandler = asyncHandler(async (req, res) => {
  await saleService.deleteSale(Number(req.params.id), req.user.id);
  ApiResponse.noContent(res);
});

module.exports = {
  getSales,
  getSale,
  postSale,
  patchSale,
  postVoidSale,
  deleteSale: deleteSaleHandler,
};