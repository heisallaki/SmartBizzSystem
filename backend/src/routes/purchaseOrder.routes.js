const { Router } = require("express");
const {
  getPurchaseOrders,
  getPurchaseOrder,
  postPurchaseOrder,
  patchPurchaseOrder,
  patchStatus,
  postReceive,
  deletePurchaseOrder,
} = require("../controllers/purchaseOrder.controller");
const { requireAuth } = require("../middleware/auth");
const { requirePermission } = require("../middleware/permission");
const validate = require("../middleware/validate");
const {
  listPurchaseOrdersQuerySchema,
  createPurchaseOrderSchema,
  updatePurchaseOrderSchema,
  updateStatusSchema,
  receivePurchaseOrderSchema,
} = require("../validators/purchaseOrder.validator");

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  requirePermission("Purchase Orders", "view"),
  validate(listPurchaseOrdersQuerySchema, "query"),
  getPurchaseOrders
);
router.get("/:id", requirePermission("Purchase Orders", "view"), getPurchaseOrder);
router.post(
  "/",
  requirePermission("Purchase Orders", "create"),
  validate(createPurchaseOrderSchema),
  postPurchaseOrder
);
router.patch(
  "/:id",
  requirePermission("Purchase Orders", "edit"),
  validate(updatePurchaseOrderSchema),
  patchPurchaseOrder
);
router.patch(
  "/:id/status",
  requirePermission("Purchase Orders", "edit"),
  validate(updateStatusSchema),
  patchStatus
);
router.post(
  "/:id/receive",
  requirePermission("Purchase Orders", "edit"),
  validate(receivePurchaseOrderSchema),
  postReceive
);
router.delete("/:id", requirePermission("Purchase Orders", "delete"), deletePurchaseOrder);

module.exports = router;