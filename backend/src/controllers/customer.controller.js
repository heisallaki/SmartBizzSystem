const customerService = require("../services/customer.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getCustomers = asyncHandler(async (req, res) => {
  const result = await customerService.listCustomers(req.query);
  ApiResponse.ok(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
  });
});

const getCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.getCustomerByCode(req.params.code);
  ApiResponse.ok(res, customer);
});

const postCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.createCustomer(req.body, req.user.id);
  ApiResponse.created(res, customer);
});

const patchCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.updateCustomer(
    req.params.code,
    req.body,
    req.user.id
  );
  ApiResponse.ok(res, customer);
});

const deleteCustomerHandler = asyncHandler(async (req, res) => {
  await customerService.deleteCustomer(req.params.code, req.user.id);
  ApiResponse.noContent(res);
});

const getStatistics = asyncHandler(async (req, res) => {
  const stats = await customerService.getStatistics();
  ApiResponse.ok(res, stats);
});

module.exports = {
  getCustomers,
  getCustomer,
  postCustomer,
  patchCustomer,
  deleteCustomer: deleteCustomerHandler,
  getStatistics,
};