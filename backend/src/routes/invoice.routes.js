const { Router } = require("express");
const {
  getInvoices,
  getInvoice,
  postInvoiceFromSale,
  postStandaloneInvoice,
  patchInvoice,
  postRecordPayment,
  postVoidInvoice,
  deleteInvoice,
} = require("../controllers/invoice.controller");
const { requireAuth } = require("../middleware/auth");
const { requirePermission } = require("../middleware/permission");
const validate = require("../middleware/validate");
const {
  listInvoicesQuerySchema,
  createFromSaleSchema,
  createStandaloneSchema,
  updateInvoiceSchema,
  recordPaymentSchema,
} = require("../validators/invoice.validator");

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  requirePermission("Invoices", "view"),
  validate(listInvoicesQuerySchema, "query"),
  getInvoices
);
router.get("/:id", requirePermission("Invoices", "view"), getInvoice);

router.post(
  "/from-sale",
  requirePermission("Invoices", "create"),
  validate(createFromSaleSchema),
  postInvoiceFromSale
);
router.post(
  "/",
  requirePermission("Invoices", "create"),
  validate(createStandaloneSchema),
  postStandaloneInvoice
);
router.patch(
  "/:id",
  requirePermission("Invoices", "edit"),
  validate(updateInvoiceSchema),
  patchInvoice
);
router.post(
  "/:id/payments",
  requirePermission("Invoices", "edit"),
  validate(recordPaymentSchema),
  postRecordPayment
);
router.post("/:id/void", requirePermission("Invoices", "edit"), postVoidInvoice);
router.delete("/:id", requirePermission("Invoices", "delete"), deleteInvoice);

module.exports = router;