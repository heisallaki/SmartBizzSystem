const purchaseOrderService = require("../services/purchaseOrder.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getPurchaseOrders = asyncHandler(async (req, res) => {
  const result = await purchaseOrderService.listPurchaseOrders(req.query);
  ApiResponse.ok(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
  });
});

const getPurchaseOrder = asyncHandler(async (req, res) => {
  const po = await purchaseOrderService.getPurchaseOrderById(Number(req.params.id));
  ApiResponse.ok(res, po);
});

const postPurchaseOrder = asyncHandler(async (req, res) => {
  const po = await purchaseOrderService.createPurchaseOrder(req.body, req.user.id);
  ApiResponse.created(res, po);
});

const patchPurchaseOrder = asyncHandler(async (req, res) => {
  const po = await purchaseOrderService.updatePurchaseOrder(
    Number(req.params.id),
    req.body,
    req.user.id
  );
  ApiResponse.ok(res, po);
});

const patchStatus = asyncHandler(async (req, res) => {
  const po = await purchaseOrderService.updateStatus(
    Number(req.params.id),
    req.body.status,
    req.user.id
  );
  ApiResponse.ok(res, po);
});

const postReceive = asyncHandler(async (req, res) => {
  const po = await purchaseOrderService.receivePurchaseOrder(
    Number(req.params.id),
    req.body.items,
    req.user.id
  );
  ApiResponse.ok(res, po);
});

const deletePurchaseOrderHandler = asyncHandler(async (req, res) => {
  await purchaseOrderService.deletePurchaseOrder(Number(req.params.id), req.user.id);
  ApiResponse.noContent(res);
});

module.exports = {
  getPurchaseOrders,
  getPurchaseOrder,
  postPurchaseOrder,
  patchPurchaseOrder,
  patchStatus,
  postReceive,
  deletePurchaseOrder: deletePurchaseOrderHandler,
};