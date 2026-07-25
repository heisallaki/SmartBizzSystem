const supplierService = require("../services/supplier.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getSuppliers = asyncHandler(async (req, res) => {
  const result = await supplierService.listSuppliers(req.query);
  ApiResponse.ok(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
  });
});

const getSupplier = asyncHandler(async (req, res) => {
  const supplier = await supplierService.getSupplierById(Number(req.params.id));
  ApiResponse.ok(res, supplier);
});

const postSupplier = asyncHandler(async (req, res) => {
  const supplier = await supplierService.createSupplier(req.body, req.user.id);
  ApiResponse.created(res, supplier);
});

const patchSupplier = asyncHandler(async (req, res) => {
  const supplier = await supplierService.updateSupplier(
    Number(req.params.id),
    req.body,
    req.user.id
  );
  ApiResponse.ok(res, supplier);
});

const deleteSupplierHandler = asyncHandler(async (req, res) => {
  await supplierService.deleteSupplier(Number(req.params.id), req.user.id);
  ApiResponse.noContent(res);
});

module.exports = {
  getSuppliers,
  getSupplier,
  postSupplier,
  patchSupplier,
  deleteSupplier: deleteSupplierHandler,
};