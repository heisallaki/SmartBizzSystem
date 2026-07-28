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
const { requireAuth, requireRole } = require("../middleware/auth");
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
router.use(requireRole("Admin", "Manager"));

router.get("/", validate(listPurchaseOrdersQuerySchema, "query"), getPurchaseOrders);
router.get("/:id", getPurchaseOrder);
router.post("/", validate(createPurchaseOrderSchema), postPurchaseOrder);
router.patch("/:id", validate(updatePurchaseOrderSchema), patchPurchaseOrder);
router.patch("/:id/status", validate(updateStatusSchema), patchStatus);
router.post("/:id/receive", validate(receivePurchaseOrderSchema), postReceive);
router.delete("/:id", deletePurchaseOrder);

module.exports = router;